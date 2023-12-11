import { Raw } from 'typeorm'
import { AppDataSource } from '../data-source'
import { User, UserType } from '../entity'
import { hashPassword } from './user.utils'

/**
 * Ensures that the AppDataSource is initialized and bootstraps the database if necessary.
 *
 * @returns A Promise that resolves when the initialization is complete.
 */
export async function ensureInitialized(): Promise<void> {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize()
    await bootstrapDatabase()
  }
}

/**
 * Ensures that the default admin user exists in the database.
 *
 * @returns A Promise that resolves when the operation is complete.
 */
async function bootstrapDatabase(): Promise<void> {
  await ensureDefaultAdmin()
}

/**
 * Ensures that a default admin user exists in the database.
 * If the admin user does not exist, it creates one with the following default credentials:
 *
 * - username: 'admin'
 * - password: 'admin'
 * - type: UserType.ADMIN
 * - first_name: 'Admin'
 * - last_name: 'Admin'
 * - email: 'admin@bas.com'
 * - phone_number: '1234567890'
 *
 * @returns Promise that resolves when the default admin user is created.
 */
async function ensureDefaultAdmin(): Promise<void> {
  const userRepository = AppDataSource.getRepository(User)
  let adminUser = await userRepository.findOne({ where: { username: 'admin' } })
  if (!adminUser) {
    adminUser = userRepository.create({
      username: 'admin',
      password_hash: hashPassword('admin'),
      type: UserType.ADMIN,
      first_name: 'Admin',
      last_name: 'Admin',
      email: 'admin@bas.com',
      phone_number: '1234567890',
    })

    await userRepository.save(adminUser)
  }
}

export function likeStr(value: string) {
  return Raw((alias) => `LOWER(${alias}) LIKE LOWER(:value)`, {
    value: `%${value}%`,
  })
}

//   const admin = new User()
//   admin.username = 'admin'
//   admin.password_hash = hashPassword('admin')
//   admin.type = UserType.ADMIN
//   await userRepo.save(admin)

//   const provider = new User()
//   provider.username = 'provider'
//   provider.password_hash = hashPassword('provider')
//   provider.type = UserType.PROVIDER
//   await userRepo.save(provider)

//   const regular = new User()
//   regular.username = 'regular'
//   regular.password_hash = hashPassword('regular')
//   regular.type = UserType.REGULAR
//   await userRepo.save(regular)

//   const appointmentRepo = AppDataSource.getRepository(Appointment)

//   const appointment = new Appointment()
//   appointment.provider = provider
//   appointment.start_time = new Date('2020-01-01T00:00:00Z')
//   appointment.end_time = new Date('2020-01-01T01:00:00Z')
//   await appointmentRepo.save(appointment)

//   const qualificationRepo = AppDataSource.getRepository(Qualification)

//   const qualification = new Qualification()
//   qualification.user = provider
//   qualification.name = 'qualification'
//   qualification.description = 'qualification description'
//   qualification.start_date = new Date('2020-01-01T00:00:00Z')
//   qualification.end_date = new Date('2020-01-01T01:00:00Z')
//   await qualificationRepo.save(qualification)
