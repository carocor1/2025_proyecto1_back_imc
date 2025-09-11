import { JwtPayload } from 'jsonwebtoken';

export interface Payload extends JwtPayload {
  email: string;
  exp: number;
}
