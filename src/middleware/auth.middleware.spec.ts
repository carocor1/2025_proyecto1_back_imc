import { UnauthorizedException, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from './auth.middleware';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let jwtService: { getPayload: jest.Mock };
  let userService: { findOne: jest.Mock };
  let context: Partial<ExecutionContext>;
  let request: any;

  beforeEach(() => {
    jwtService = { getPayload: jest.fn() };
    userService = { findOne: jest.fn() };
    guard = new AuthGuard(jwtService as any, userService as any);

    request = { headers: {}, user: undefined };
    context = {
      switchToHttp: () => ({
        getRequest: () => request,
      }),
    } as any;
  });

  it('should throw if no token', async () => {
    await expect(guard.canActivate(context as ExecutionContext)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('should throw if payload is invalid', async () => {
    request.headers.authorization = 'token';
    jwtService.getPayload.mockReturnValue(undefined);
    await expect(guard.canActivate(context as ExecutionContext)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('should throw if payload.sub is missing', async () => {
    request.headers.authorization = 'token';
    jwtService.getPayload.mockReturnValue({});
    await expect(guard.canActivate(context as ExecutionContext)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('should throw if user not found', async () => {
    request.headers.authorization = 'token';
    jwtService.getPayload.mockReturnValue({ sub: 1 });
    userService.findOne.mockResolvedValue(null);
    await expect(guard.canActivate(context as ExecutionContext)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('should set request.user and return true if all is valid', async () => {
    request.headers.authorization = 'token';
    jwtService.getPayload.mockReturnValue({ sub: 1 });
    userService.findOne.mockResolvedValue({ id: 1, nombre: 'Test' });
    const result = await guard.canActivate(context as ExecutionContext);
    expect(result).toBe(true);
    expect(request.user).toEqual({ id: 1, nombre: 'Test' });
  });

  it('should throw UnauthorizedException on unexpected error', async () => {
    request.headers.authorization = 'token';
    jwtService.getPayload.mockImplementation(() => {
      throw new Error('fail');
    });
    await expect(guard.canActivate(context as ExecutionContext)).rejects.toThrow(
      UnauthorizedException,
    );
  });
});