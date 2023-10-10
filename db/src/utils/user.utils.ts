import { CreateUserArgs, GetUserArgs } from '../types'
import { User, UserType, Qualification } from '../entity'
import { AppDataSource } from '../data-source'
import { createHash } from 'node:crypto'

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
  user.type = type
  user.first_name = first_name
  user.last_name = last_name
  user.email = email
  user.phone_number = phone_number
  user.password_hash = hashPassword(password)
  return userRepo.save(user)
}

/**
 * Creates a new qualification with the given description and user.
 *
 * @param description The description of the qualification.
 * @param user The user associated with the qualification. Can be either a User object or a string representing the user's username.
 * @returns A Promise that resolves to the newly created Qualification object, or null if the user does not exist.
 */
export async function createQualification(
  description: string,
  user: User | string,
): Promise<Qualification | null> {
  await ensureInitialized()

  const qualificationRepo = AppDataSource.getRepository(Qualification)
  const qualification = new Qualification()
  qualification.description = description

  if (typeof user === 'string') {
    const userEntity = await getUser({ username: user })
    if (!userEntity) {
      return null
    }
    qualification.user = userEntity
  } else {
    qualification.user = user
  }

  return qualificationRepo.save(qualification)
}

/**
 * Ensures that the AppDataSource is initialized before proceeding with the function execution.
 *
 * If the AppDataSource is not initialized, it will be initialized before continuing.
 *
 * @returns Promise that resolves when the AppDataSource is initialized.
 */
async function ensureInitialized(): Promise<void> {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize()
  }
}
