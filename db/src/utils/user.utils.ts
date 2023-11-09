import { createHash } from 'node:crypto'
import { AppDataSource } from '../data-source'
import { Qualification, User, UserType } from '../entity'
import type {
  CreateQualificationArgs,
  CreateUserArgs,
  GetUserArgs,
  UserDto,
} from '../types'
import { ensureInitialized } from './db.utils'

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
 * Checks if the provided credentials are valid for a user.
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
