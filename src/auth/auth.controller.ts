import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { LoginDto } from 'src/users/dto/login.dto';
import { User } from 'src/users/entities/user.entity';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { LoginResponseDto } from 'src/users/dto/login-response.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('login')
  @ApiOperation({ summary: 'Iniciar sesión de usuario' })
  @ApiResponse({ status: 200, description: 'Login exitoso', type: User })
  @ApiResponse({ status: 401, description: 'Credenciales inválidas' })
  @ApiBody({ type: LoginDto })
  async login(@Body() loginDto: LoginDto): Promise<LoginResponseDto> {
    return await this.authService.login(loginDto);
  }

  @Post('register')
  //AGREGAR API RESPONSE
  @ApiOperation({ summary: 'Registrar un nuevo usuario' })
  @ApiResponse({ status: 400, description: 'El usuario ya existe' })
  @ApiBody({ type: CreateUserDto })
  async register(
    @Body() createUserDto: CreateUserDto,
  ): Promise<{ access_token: string }> {
    return await this.authService.register(createUserDto);
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Refresh access token using refresh token' })
  @ApiResponse({
    status: 200,
    description: 'Tokens refreshed',
    type: LoginResponseDto,
  })

  //CREAR DTO de REFRESH TOKEN
  @ApiResponse({ status: 401, description: 'Invalid refresh token' })
  @ApiBody({ schema: { properties: { refreshToken: { type: 'string' } } } })
  async refresh(
    @Body('refreshToken') refreshToken: string,
  ): Promise<LoginResponseDto> {
    return await this.authService.refresh(refreshToken);
  }
}
