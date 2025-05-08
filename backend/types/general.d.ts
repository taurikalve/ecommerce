type JwtToken<T extends {}> = {
  iat: number;
  exp: number;
} & T;

type RefreshToken = {
  // email: string;
  // status: number;
  id: string;
} /*& JwtDefault*/;
type AccessToken = {
  id: string;
  status: number;
} /*& JwtDefault*/;

type Stringify<T extends {}> = {
  [K in keyof T]: T[K] extends number ? string : string;
};
