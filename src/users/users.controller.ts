import { Controller, Get, Body, Patch, UseGuards, Req, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { RespuestaUserDto } from './dto/respuesta-user.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthGuard, RequestWithUser } from '../middleware/auth.middleware';
import { IsEmail, IsString } from 'class-validator';

// DTOs para recuperación y reseteo de contraseña
class ForgotPasswordDto {
  @IsEmail()
  email: string;
}

class ResetPasswordDto {
  @IsString()
  token: string;

  @IsString()
  newPassword: string;
}

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AuthGuard)
  @Get()
  @ApiBearerAuth('Authorization')
  @ApiOperation({
    summary: 'Obtener el perfil del usuario autenticado',
  })
  @ApiResponse({
    status: 200,
    description: 'Perfil del usuario obtenido correctamente',
    type: RespuestaUserDto,
  })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  async findMe(@Req() request: RequestWithUser): Promise<RespuestaUserDto> {
    return await this.usersService.findMe(request.user.id);
  }

  @UseGuards(AuthGuard)
  @Patch()
  @ApiBearerAuth('Authorization')
  @ApiOperation({
    summary: 'Actualizar el perfil del usuario autenticado',
  })
  @ApiResponse({
    status: 200,
    description: 'Perfil del usuario actualizado correctamente',
    type: RespuestaUserDto,
  })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiBody({ type: UpdateUserDto })
  async update(
    @Body() updateUserDto: UpdateUserDto,
    @Req() request: RequestWithUser,
  ): Promise<RespuestaUserDto> {
    return await this.usersService.update(request.user.id, updateUserDto);
  }

  @Post('forgot-password')
  @ApiOperation({
    summary: 'Solicitar recuperación de contraseña',
  })
  @ApiResponse({
    status: 200,
    description: 'Email de recuperación enviado',
  })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  @ApiBody({ type: ForgotPasswordDto })
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    await this.usersService.forgotPassword(dto.email);
    return { message: 'Email de recuperación enviado' };
  }

  @Post('reset-password')
  @ApiOperation({
    summary: 'Resetear contraseña con token',
  })
  @ApiResponse({
    status: 200,
    description: 'Contraseña actualizada',
  })
  @ApiResponse({ status: 400, description: 'Token inválido o expirado' })
  @ApiBody({ type: ResetPasswordDto })
  async resetPassword(@Body() dto: ResetPasswordDto) {
    await this.usersService.resetPassword(dto.token, dto.newPassword);
    return { message: 'Contraseña actualizada' };
  }
}
