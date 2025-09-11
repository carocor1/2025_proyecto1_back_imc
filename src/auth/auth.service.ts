import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from 'src/jwt/jwt.service';
import { LoginDto } from 'src/users/dto/login.dto';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt'; // Importa bcrypt
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { LoginResponseDto } from 'src/users/dto/login-response.dto';
@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private userService: UsersService,
  ) {}
  async login(loginDto: LoginDto): Promise<LoginResponseDto> {
    const user = await this.userService.findByEmail(loginDto.email);
    if (!user) throw new UnauthorizedException('Usuario no encontrado');

    const isPasswordValid = bcrypt.compareSync(
      loginDto.contraseña,
      user.contraseña,
    );
    if (!isPasswordValid)
      throw new UnauthorizedException('Contraseña incorrecta');

    const payload = { email: user.email };

    return {
      accessToken: this.jwtService.generateToken(payload, 'auth'),
      refreshToken: this.jwtService.generateToken(payload, 'refresh'),
      user: {
        id: user.id,
        email: user.email,
        nombre: user.nombre,
      },
    };
  }

  async register(createUserDto: CreateUserDto) {
    const existingUser = await this.userService.findByEmail(
      createUserDto.email,
    );
    if (existingUser) {
      throw new ConflictException('El usuario ya existe');
    }
    const hashedPassword = bcrypt.hashSync(createUserDto.contraseña, 10);
    const user = await this.userService.create({
      ...createUserDto,
      contraseña: hashedPassword,
    });
    return user;
  }
}
