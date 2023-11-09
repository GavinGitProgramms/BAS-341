import 'reflect-metadata'
import { DataSource } from 'typeorm'
import { Appointment, Qualification, User } from './entity'
import {
  Migration1696986519515,
  AddAppointmentCanceled1699546327331,
} from './migration'

const migrations = [Migration1696986519515, AddAppointmentCanceled1699546327331]

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
