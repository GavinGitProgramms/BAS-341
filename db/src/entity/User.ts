import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm'
import { UserType } from './Enums'

@Entity({ name: 'user' })
export class User {
  @PrimaryColumn({ unique: true })
  username: string

  @Column({
    type: 'enum',
    enum: UserType,
    default: UserType.REGULAR,
  })
  type: UserType

  @Column()
  first_name: string

  @Column()
  last_name: string

  @Index({ unique: true })
  @Column()
  email: string

  @Column()
  phone_number: string

  @Column()
  password_hash: string

  @CreateDateColumn()
  created_date: Date

  @UpdateDateColumn()
  updated_date: Date
}
