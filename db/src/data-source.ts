import 'reflect-metadata'
import { DataSource } from 'typeorm'
import { Appointment, Event, Notification, Qualification, User } from './entity'
import {
  Migration1700435027666,
  UsersEnabledMigration1702279479734,
} from './migration'

const migrations = [Migration1700435027666, UsersEnabledMigration1702279479734]

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'test',
  password: 'test',
  database: 'test',
  synchronize: true,
  logging: false,
  entities: [Appointment, Event, Notification, Qualification, User],
  migrations,
  subscribers: [],
})
