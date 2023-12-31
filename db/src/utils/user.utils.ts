import { createHash } from 'node:crypto'
import { AppDataSource } from '../data-source'
import { Qualification, User, UserType } from '../entity'
import type {
  CreateQualificationArgs,
  CreateUserArgs,
  GetUserArgs,
  SearchContext,
  SearchResults,
  SearchUsersDto,
  UserDto,
} from '../types'
import { ensureInitialized, likeStr } from './db.utils'
import { FindOptionsOrder, FindOptionsWhere, Not } from 'typeorm'
import { cancelAllAppointments } from './appointment.utils'

/**
 * Hashes a password using the SHA256 algorithm.
 *
 * NOTE: this is not secure and should be improved in a real product.
 *
 * @param password - The password to hash.
 * @returns The hashed password as a hexadecimal string.
 */
export function hashPassword(password: string): string {
  const hash = createHash('sha256')
  hash.update(password)
  return hash.digest('hex')
}

/**
 * Retrieves a user from the database by their username.
 *
 * @param {GetUserArgs} args - The arguments for retrieving a user.
 * @returns {Promise<User | null>} - A promise that resolves with the retrieved user or null if not found.
 */
async function getUser({ username }: GetUserArgs): Promise<User | null> {
  await ensureInitialized()
  const userRepo = AppDataSource.getRepository(User)
  const user = await userRepo.findOne({
    where: { username },
    relations: {
      qualifications: true,
    },
  })
  return user
}

/**
 * Expands the given user to a full User entity.
 *
 * If the user is already a User entity, it is returned as is.
 * If the user is a string, it is used to retrieve the corresponding User entity from the database.
 *
 * @param user - The user to expand, either a User entity or a string representing the username.
 * @returns A Promise that resolves to the expanded User entity.
 * @throws An error if the user is a string and no corresponding User entity is found in the database.
 */
export async function expandUser(user: User | string): Promise<User> {
  // If the user is a string, then we need to retrieve the user entity from the database.
  if (typeof user === 'string') {
    const userEntity = await getUser({ username: user })
    if (!userEntity) {
      throw new Error(`user: '${user}' does not exist`)
    }
    return userEntity
  } else {
    return user
  }
}

/**
 * Searches for users based on the provided DTO and user context.
 *
 * @param {SearchUsersDto} dto - The DTO containing search parameters.
 * @param {SearchContext} context - The context of the user performing the search.
 * @returns {Promise<SearchResults<UserDto>>} - A promise that resolves to the search results.
 */
export async function searchUsers(
  dto: SearchUsersDto,
  context: SearchContext,
): Promise<SearchResults<UserDto>> {
  await ensureInitialized()
  const appointmentRepo = AppDataSource.getRepository(User)

  const whereOptions: FindOptionsWhere<User> = {}

  const requestingUser = await expandUser(context.user)

  if (requestingUser.type !== UserType.ADMIN) {
    throw new Error('only admin users can search for users')
  }

  // Adding additional filters from DTO
  if (dto.username) {
    whereOptions['username'] = likeStr(dto.username)
  }

  if (dto.type && dto.type !== UserType.ADMIN) {
    whereOptions['type'] = dto.type
  } else {
    whereOptions['type'] = Not(UserType.ADMIN)
  }

  if (dto.firstName) {
    whereOptions['first_name'] = likeStr(dto.firstName)
  }

  if (dto.lastName) {
    whereOptions['last_name'] = likeStr(dto.lastName)
  }

  if (dto.phoneNumber) {
    whereOptions['phone_number'] = likeStr(dto.phoneNumber)
  }

  if (dto.email) {
    whereOptions['email'] = likeStr(dto.email)
  }

  if (dto.enabled !== undefined) {
    whereOptions['enabled'] = dto.enabled
  }

  // Pagination and sorting
  const skip = (dto.page - 1) * dto.rowsPerPage
  const take = dto.rowsPerPage

  const order: FindOptionsOrder<User> = {
    [dto.sortField]: dto.sortDirection,
  }

  const users = await appointmentRepo.find({
    where: whereOptions,
    order,
    skip,
    take,
  })

  // Count total appointments
  const total = await appointmentRepo.count({
    where: whereOptions,
  })

  // Map to DTOs and return results with total
  return {
    total: total,
    results: users.map(userDto),
  }
}

/**
 * Disables a user by setting their 'enabled' property to false.
 *
 * Also cancels all appointments for the user after a delay of 1 second.
 *
 * @param username - The username of the user to disable.
 * @returns A promise that resolves to the disabled user as a UserDto.
 * @throws An error if the user cannot be found.
 */
export async function disableUser(username: string): Promise<UserDto> {
  await ensureInitialized()
  const userRepo = AppDataSource.getRepository(User)
  const user = await userRepo.findOne({ where: { username } })
  if (!user) {
    throw new Error(`could not find user: '${username}'`)
  }

  user.enabled = false
  await userRepo.save(user)

  setTimeout(() => cancelAllAppointments(user.username), 1000)
  return userDto(user)
}

/**
 * Enables a user by setting the 'enabled' property to true.
 *
 * @param username - The username of the user to enable.
 * @returns A Promise that resolves to a UserDto representing the enabled user.
 * @throws An Error if the user with the specified username is not found.
 */
export async function enableUser(username: string): Promise<UserDto> {
  await ensureInitialized()
  const userRepo = AppDataSource.getRepository(User)
  const user = await userRepo.findOne({ where: { username } })
  if (!user) {
    throw new Error(`could not find user: '${username}'`)
  }

  user.enabled = true
  await userRepo.save(user)
  return userDto(user)
}

/**
 * Checks if the provided credentials are valid for a user.
 *
 * Also returns false is a user is disabled.
 *
 * @param username - The username of the user.
 * @param password - The password of the user.
 * @returns A Promise that resolves to the User object if the credentials are valid, or false otherwise.
 */
export async function checkCredentials(
  username: string,
  password: string,
): Promise<UserDto | false> {
  const user = await getUser({ username })
  if (!user) {
    return false
  }

  if (!user.enabled) {
    return false
  }

  const hash = hashPassword(password)
  const isCorrect = hash === user.password_hash
  if (isCorrect) {
    return userDto(user)
  }

  return false
}

/**
 * Creates a new user with the given information and saves it to the database.
 *
 * @param {CreateUserArgs} args - The arguments needed to create a new user.
 * @returns {Promise<UserDto | null>} - A Promise that resolves with the newly created user, or null if there was an error.
 */
export async function createUser({
  username,
  type = UserType.REGULAR,
  first_name,
  last_name,
  email,
  phone_number,
  password,
}: CreateUserArgs): Promise<UserDto | null> {
  await ensureInitialized()
  const userRepo = AppDataSource.getRepository(User)
  const user = new User()
  user.username = username

  // Validate the user type
  if (!Object.values(UserType).includes(type)) {
    throw new Error('invalid user type')
  }

  user.type = type

  user.first_name = first_name
  user.last_name = last_name

  // TODO: validate email and phone number with regex
  user.email = email
  user.phone_number = phone_number
  user.password_hash = hashPassword(password)
  return userDto(await userRepo.save(user))
}

/**
 * Creates a new qualification for a service provider user.
 *
 * This is for use by service provider users only.
 *
 * @param {CreateQualificationArgs} args - The arguments needed to create a new qualification.
 * @returns {Promise<UserDto | null>} - The updated user object with the new qualification.
 * @throws {Error} - If the user is not a service provider.
 */
export async function createQualification({
  description,
  user,
}: CreateQualificationArgs): Promise<UserDto | null> {
  await ensureInitialized()
  const qualificationRepo = AppDataSource.getRepository(Qualification)
  const qualification = new Qualification()
  qualification.description = description
  qualification.user = await expandUser(user)

  if (qualification.user.type !== UserType.SERVICE_PROVIDER) {
    throw new Error('only service providers can have qualifications')
  }

  await qualificationRepo.save(qualification)
  const updatedUser = await getUser({ username: qualification.user.username })
  return updatedUser ? userDto(updatedUser) : null
}

/**
 * Converts a User object to a UserDto object by removing the password_hash property.
 *
 * @param user - The User object to convert.
 * @returns The UserDto object.
 */
export function userDto({ password_hash, ...user }: User): UserDto {
  return user
}
