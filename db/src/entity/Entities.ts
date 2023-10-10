import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

export enum UserType {
  REGULAR = 'REGULAR',
  SERVICE_PROVIDER = 'SERVICE_PROVIDER',
  ADMIN = 'ADMIN',
}

export enum AppointmentType {
  BEAUTY = 'BEAUTY',
  FITNESS = 'FITNESS',
  MEDICAL = 'MEDICAL',
}

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

  @OneToMany(() => Appointment, (appointment) => appointment.user, {
    cascade: true,
  })
  appointments: Appointment[]

  @OneToMany(() => Qualification, (qualification) => qualification.user, {
    cascade: true,
  })
  qualifications: Qualification[]

  @CreateDateColumn()
  created_date: Date

  @UpdateDateColumn()
  updated_date: Date
}

@Entity({ schema: 'public', name: 'appointment' })
export class Appointment {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({
    type: 'enum',
    enum: AppointmentType,
  })
  type: AppointmentType

  @ManyToOne(() => User)
  provider: User

  @ManyToOne(() => User, { nullable: true })
  user: User | null

  @Column({ type: 'timestamp' })
  start_time: Date

  @Column({ type: 'timestamp' })
  end_time: Date

  @CreateDateColumn()
  created_date: Date

  @UpdateDateColumn()
  updated_date: Date
}

@Entity({ schema: 'public', name: 'qualification' })
export class Qualification {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  description: string

  @ManyToOne(() => User, (user) => user.qualifications)
  user: User
}