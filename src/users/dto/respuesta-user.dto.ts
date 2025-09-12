import { ApiProperty } from '@nestjs/swagger';

export class RespuestaUserDto {
  @ApiProperty({
    description: 'Identificador único del usuario en la base de datos.',
    example: 1,
    type: Number,
    required: true,
  })
  id: number;

  @ApiProperty({
    description: 'Nombre completo o de usuario del usuario.',
    example: 'Juan Pérez',
    type: String,
    required: true,
  })
  nombre: string;

  @ApiProperty({
    description: 'Dirección de correo electrónico única del usuario.',
    example: 'juan.perez@example.com',
    type: String,
    required: true,
  })
  email: string;
}
