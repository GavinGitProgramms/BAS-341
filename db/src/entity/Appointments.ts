import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { AppointmentType } from './Enums'
import { User } from './User'

@Entity({ name: 'appointment' })
export class Appointment {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({
    type: 'enum',
    enum: AppointmentType,
  })
  type: AppointmentType

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

  @CreateDateColumn()
  created_date: Date

  @UpdateDateColumn()
  updated_date: Date
}
