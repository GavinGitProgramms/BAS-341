import 'reflect-metadata'
import { DataSource } from 'typeorm'
import { Appointment, Qualification, User } from './entity'
import { Migration1696888026478, Migration1696895038806 } from './migration'

const migrations = [Migration1696888026478, Migration1696895038806]

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'test',
  password: 'test',
  database: 'test',
  synchronize: true,
  logging: false,
  entities: [User, Appointment, Qualification],
  migrations,
  subscribers: [],
})
