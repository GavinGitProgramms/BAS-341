import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Relation,
  OneToMany,
} from 'typeorm'
import { UserType } from './Enums'
import { Qualification } from './Qualification'

@Entity({ schema: 'public', name: 'user' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Index({ unique: true })
  @Column()
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

  @OneToMany(() => Qualification, (qualification) => qualification.user)
  qualifications: Array<Relation<Qualification>>

  @CreateDateColumn()
  created_date: Date

  @UpdateDateColumn()
  updated_date: Date
}
