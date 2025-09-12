import { User } from '../../users/entities/user.entity';

import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class ImcHistorial {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'float' })
  altura: number;

  @Column({ type: 'float' })
  peso: number;

  @Column({ type: 'float' })
  imc: number;

  @Column()
  categoria: string;

  @ManyToOne(() => User, (user) => user.imcHistorial)
  usuario: User;

  @CreateDateColumn()
  fechaHora: Date;
}
