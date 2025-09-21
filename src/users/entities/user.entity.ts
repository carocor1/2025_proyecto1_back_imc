import { ImcHistorial } from '../../imc-historial/entities/imc-historial.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('users')
export class User {
  @ApiProperty({
    example: 1,
    description: 'ID único generado automáticamente para el usuario',
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: 'Juan Pérez',
    description: 'Nombre completo del usuario',
  })
  @Column()
  nombre: string;

  @ApiProperty({
    example: 'juan@example.com',
    description: 'Correo electrónico único del usuario',
    uniqueItems: true,
  })
  @Column({ unique: true })
  email: string;

  @ApiProperty({
    example: '123456',
    description:
      'Contraseña del usuario (se recomienda encriptar antes de guardar)',
  })
  @Column({ name: 'contrasenia' })
  contraseña: string;

  @ApiProperty({
    type: () => [ImcHistorial],
    description: 'Historial de IMC asociado al usuario',
    required: false,
  })
  @OneToMany(() => ImcHistorial, (imcHistorial) => imcHistorial.usuario)
  imcHistorial: ImcHistorial[];

  @ApiProperty({
    example: null,
    description: 'Token para reset de contraseña (nullable)',
    required: false,
  })
  @Column({
    name: 'passwordresettoken',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  passwordResetToken: string | null;

  @ApiProperty({
    example: null,
    description: 'Fecha de expiración del token de reset (nullable)',
    required: false,
  })
  @Column({
    name: 'passwordresetexpiration',
    type: 'timestamptz',
    nullable: true,
  })
  passwordResetExpiration: Date | null;
}
