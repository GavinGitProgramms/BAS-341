import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
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

export enum EventType {
  APPOINTMENT_CREATED = 'APPOINTMENT_CREATED',
  APPOINTMENT_CANCELED = 'APPOINTMENT_CANCELED',
  APPOINTMENT_UPDATED = 'APPOINTMENT_UPDATED',
  APPOINTMENT_BOOKED = 'APPOINTMENT_BOOKED',
}

export enum NotificationType {
  APP = 'APP',
  SMS = 'SMS',
  EMAIL = 'EMAIL',
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

  @Column({ default: true })
  enabled: boolean

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

  @OneToMany(() => Notification, (notification) => notification.user, {
    cascade: true,
  })
  notifications: Notification[]

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

  @Column()
  description: string

  @ManyToOne(() => User)
  @JoinColumn({ name: 'provider_id' })
  provider: User

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'user_id' })
  user: User | null

  @Column({ type: 'timestamp' })
  start_time: Date

  @Column({ type: 'timestamp' })
  end_time: Date

  @Column({ type: 'boolean', default: false })
  canceled: boolean

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
  @JoinColumn({ name: 'user_id' })
  user: User
}

@Entity({ schema: 'public', name: 'event' })
export class Event {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({
    type: 'enum',
    enum: EventType,
  })
  type: EventType

  @Column('jsonb', { nullable: false, default: {} })
  payload: Record<string, any>

  @CreateDateColumn()
  created_date: Date
}

@Entity({ schema: 'public', name: 'notification' })
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({
    type: 'enum',
    enum: NotificationType,
  })
  type: NotificationType

  @ManyToOne(() => User, (user) => user.notifications)
  @JoinColumn({ name: 'user_id' })
  user: User

  @Column()
  message: string

  @Column({ default: false })
  viewed: boolean

  @CreateDateColumn()
  created_date: Date

  @UpdateDateColumn()
  updated_date: Date
}
