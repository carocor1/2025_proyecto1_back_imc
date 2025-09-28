import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { UsersMapper } from './mappers/users-mapper';
import { BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { MailService } from '../mail/mail.service';
import { ConfigService } from '@nestjs/config';

const userMock = {
 id: 1,
 nombre: 'Alejo',
 email: 'alejo@gmail.com',
 contraseña: 'contraseña123',
 imcHistorial: [],
 passwordResetExpiration: new Date(Date.now() + 3600000),
 passwordResetToken: null,
};

describe('UsersService', () => {
 let service: UsersService;
 let repo: any;
 let mapper: any;
 let mailService: any;
 let configService: any;

 beforeEach(async () => {
   repo = {
     create: jest.fn().mockResolvedValue(userMock),
     findOne: jest.fn().mockResolvedValue(userMock),
     update: jest.fn().mockResolvedValue(userMock),
     findByEmail: jest.fn().mockResolvedValue(userMock),
     guardarTokenReset: jest.fn().mockResolvedValue(undefined),
     findOneByResetToken: jest.fn().mockResolvedValue(userMock),
     updatePassword: jest.fn().mockResolvedValue(undefined),
   };
   mapper = {
     toResponseDto: jest.fn().mockReturnValue({ id: 1, email: 'alejo@gmail.com', nombre: 'Alejo' }),
   };
   mailService = { sendPasswordReset: jest.fn().mockResolvedValue(undefined) };
   configService = { get: jest.fn().mockReturnValue('http://localhost:3000') };

   const module: TestingModule = await Test.createTestingModule({
     providers: [
       UsersService,
       { provide: 'IUsuarioRepository', useValue: repo },
       { provide: UsersMapper, useValue: mapper },
       { provide: MailService, useValue: mailService },
       { provide: ConfigService, useValue: configService },
     ],
   }).compile();

   service = module.get<UsersService>(UsersService);
 });

 it('should be defined', () => {
   expect(service).toBeDefined();
 });

 it('create should call repository and return user', async () => {
   const dto = { nombre: 'Alejo', email: 'alejo@gmail.com', contraseña: 'contraseña123' };
   const result = await service.create(dto as any);
   expect(repo.create).toHaveBeenCalledWith(dto);
   expect(result).toEqual(userMock);
 });

 it('findOne should return user', async () => {
   const result = await service.findOne(1);
   expect(repo.findOne).toHaveBeenCalledWith(1);
   expect(result).toEqual(userMock);
 });

 it('findOne should throw if user not found', async () => {
   repo.findOne.mockResolvedValueOnce(null);
   await expect(service.findOne(2)).rejects.toThrow(NotFoundException);
 });

 it('findMe should return mapped user', async () => {
   const result = await service.findMe(1);
   expect(repo.findOne).toHaveBeenCalledWith(1);
   expect(mapper.toResponseDto).toHaveBeenCalledWith(userMock);
   expect(result).toEqual({ id: 1, email: 'alejo@gmail.com', nombre: 'Alejo' });
 });

 it('findMe should throw if user not found', async () => {
   repo.findOne.mockResolvedValueOnce(null);
   await expect(service.findMe(2)).rejects.toThrow(NotFoundException);
 });

 it('update should update nombre and return user', async () => {
   const dto = { nombre: 'Nuevo' };
   const result = await service.update(1, dto as any);
   expect(repo.update).toHaveBeenCalledWith(1, { nombre: 'Nuevo' });
   expect(result).toEqual(userMock);
 });

 it('update should update email and return user', async () => {
   repo.findByEmail.mockResolvedValueOnce(null);
   const dto = { email: 'nuevo@mail.com' };
   mapper.toResponseDto.mockReturnValueOnce({ id: 1, email: 'alejo@gmail.com', nombre: 'Alejo' });
   const result = await service.update(1, dto as any);
   expect(repo.update).toHaveBeenCalledWith(1, { email: 'nuevo@mail.com' });
   expect(result).toEqual(userMock);
 });

 it('update should throw BadRequestException if no valid fields', async () => {
   await expect(service.update(1, {} as any)).rejects.toThrow(BadRequestException);
   await expect(service.update(1, { nombre: '', email: '' } as any)).rejects.toThrow(BadRequestException);
 });

 it('update should throw ConflictException if email already exists', async () => {
   repo.findByEmail.mockResolvedValueOnce({ ...userMock, email: 'nuevo@mail.com' });
   mapper.toResponseDto.mockReturnValueOnce({ id: 1, email: 'alejo@gmail.com', nombre: 'Alejo' });
   await expect(service.update(1, { email: 'nuevo@mail.com' } as any)).rejects.toThrow(ConflictException);
 });

 it('findByEmail should call repository and return user', async () => {
   const result = await service.findByEmail('alejo@gmail.com');
   expect(repo.findByEmail).toHaveBeenCalledWith('alejo@gmail.com');
   expect(result).toEqual(userMock);
 });

 it('forgotPassword should throw if user not found', async () => {
   repo.findByEmail.mockResolvedValueOnce(null);
   await expect(service.forgotPassword('no@mail.com')).rejects.toThrow(NotFoundException);
 });

 it('forgotPassword should generate token, save and send mail', async () => {
   await service.forgotPassword('alejo@gmail.com');
   expect(repo.guardarTokenReset).toHaveBeenCalled();
   expect(mailService.sendPasswordReset).toHaveBeenCalled();
 });

 it('resetPassword should throw if user not found', async () => {
   repo.findOneByResetToken.mockResolvedValueOnce(null);
   await expect(service.resetPassword('token', 'newpass')).rejects.toThrow(BadRequestException);
 });

 it('resetPassword should throw if token expired', async () => {
   repo.findOneByResetToken.mockResolvedValueOnce({ ...userMock, passwordResetExpiration: new Date(Date.now() - 1000) });
   await expect(service.resetPassword('token', 'newpass')).rejects.toThrow(BadRequestException);
 });

 it('resetPassword should update password if valid', async () => {
   repo.findOneByResetToken.mockResolvedValueOnce(userMock);
   jest.spyOn(require('bcrypt'), 'genSalt').mockResolvedValue('salt');
   jest.spyOn(require('bcrypt'), 'hash').mockResolvedValue('hashed');
   await service.resetPassword('token', 'newpass');
   expect(repo.updatePassword).toHaveBeenCalledWith(userMock.id, 'hashed');
 });
});
