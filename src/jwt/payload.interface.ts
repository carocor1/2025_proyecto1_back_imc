import { JwtPayload } from 'jsonwebtoken';

export interface Payload extends JwtPayload {
  sub: number;
  email: string;
  exp: number;
}
