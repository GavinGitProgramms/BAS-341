import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm'
import { User } from './User'

@Entity({ schema: 'public', name: 'qualification' })
export class Qualification {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  description: string

  @ManyToOne(() => User, (user) => user.qualifications)
  @JoinColumn({ name: 'user_id' })
  user: Relation<User>
}
