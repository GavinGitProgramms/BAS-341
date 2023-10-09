import 'reflect-metadata'
import { DataSource } from 'typeorm'
import { Appointment, User } from './entity'
import { Migration1696794790742 } from './migration'

const migrations = [Migration1696794790742]

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'test',
  password: 'test',
  database: 'test',
  synchronize: true,
  logging: false,
  entities: [User, Appointment],
  migrations,
  subscribers: [],
})
