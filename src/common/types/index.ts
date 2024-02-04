export interface IJWTPayload {
  id: string;
  username: string;
  exp?: number;
  iat?: number;
}
