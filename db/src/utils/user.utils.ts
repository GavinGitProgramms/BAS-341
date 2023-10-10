import { createHash } from 'node:crypto'
import { AppDataSource } from '../data-source'
import { Qualification, User, UserType } from '../entity'
import type {
  CreateQualificationArgs,
  CreateUserArgs,
  GetUserArgs,
} from '../types'
import { ensureInitialized } from './db.utils'

/**
 * Hashes a password using the SHA256 algorithm.
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
export async function getUser({ username }: GetUserArgs): Promise<User | null> {
  await ensureInitialized()
  const userRepo = AppDataSource.getRepository(User)
  const user = await userRepo.findOneBy({ username })
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
): Promise<User | false> {
  const user = await getUser({ username })
  if (!user) {
    return false
  }

  const hash = hashPassword(password)
  const isCorrect = hash === user.password_hash
  if (isCorrect) {
    return user
  }

  return false
}

/**
 * Creates a new user with the given information and saves it to the database.
 *
 * @param {CreateUserArgs} args - The arguments needed to create a new user.
 * @returns {Promise<User | null>} - A Promise that resolves with the newly created user, or null if there was an error.
 */
export async function createUser({
  username,
  type = UserType.REGULAR,
  first_name,
  last_name,
  email,
  phone_number,
  password,
}: CreateUserArgs): Promise<User | null> {
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
  return userRepo.save(user)
}

/**
 * Creates a new qualification and saves it to the database.
 *
 * @param {CreateQualificationArgs} args - The arguments needed to create a new qualification.
 * @returns {Promise<Qualification | null>} - The newly created qualification or null if the user does not exist.
 */
export async function createQualification({
  description,
  user,
}: CreateQualificationArgs): Promise<Qualification | null> {
  await ensureInitialized()
  const qualificationRepo = AppDataSource.getRepository(Qualification)
  const qualification = new Qualification()
  qualification.description = description
  qualification.user = await expandUser(user)
  return qualificationRepo.save(qualification)
}
