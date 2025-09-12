import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '../jwt/jwt.service';
import { LoginDto } from '../users/dto/login.dto';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt'; // Importa bcrypt
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { LoginResponseDto } from 'src/users/dto/login-response.dto';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private userService: UsersService,
  ) {}
  async login(loginDto: LoginDto): Promise<LoginResponseDto> {
    const user = await this.userService.findByEmail(loginDto.email);
    if (!user)
      throw new UnauthorizedException('Usuario con email no encontrado');
    const isPasswordValid = bcrypt.compareSync(
      loginDto.contraseña,
      user.contraseña,
    );
    if (!isPasswordValid)
      throw new UnauthorizedException('Contraseña incorrecta');

    const payload = { email: user.email, sub: String(user.id) };

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

  async register(
    createUserDto: CreateUserDto,
  ): Promise<{ access_token: string }> {
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
    const payload = { email: user.email, sub: String(user.id) };
    return {
      access_token: this.jwtService.generateToken(payload, 'auth'),
    };
  }

  //refactorizar
  async refresh(refreshToken: string): Promise<LoginResponseDto> {
    const tokens = this.jwtService.refreshToken(refreshToken);
    const payload = this.jwtService.getPayload(refreshToken, 'refresh') as {
      sub: string;
      email: string;
    };
    const user = await this.validateUser(Number(payload.sub));
    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken || refreshToken,
      user: {
        id: user.id,
        email: user.email,
        nombre: user.nombre,
      },
    };
  }

  private async validateUser(id: number): Promise<User> {
    const user = await this.userService.findOne(id);
    if (!user) throw new UnauthorizedException('Usuario no encontrado');
    return user;
  }
}
