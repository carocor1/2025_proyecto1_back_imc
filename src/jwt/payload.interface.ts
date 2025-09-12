import { JwtPayload } from 'jsonwebtoken';

export interface Payload extends JwtPayload {
  sub: string;
  email: string;
  exp: number;
}
