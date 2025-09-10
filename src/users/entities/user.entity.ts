import { ImcHistorial } from 'src/imc-historial/entities/imc-historial.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;
  //unique == true?? Para que no se pueda repetir el mail. VER si lo implementamos o deuda técnica.
  @Column()
  email: string;

  @Column()
  contraseña: string;
  /*A agregar
  @OneToMany(() => ImcHistorial, (imcHistorial) => imcHistorial.usuario)
  imcHistorial: ImcHistorial[];
  */
}
