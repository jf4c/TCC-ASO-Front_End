export interface User {
  id?: string;
  keycloakId?: string;
  email: string;
  nickName: string;        // Backend retorna NickName
  firstName: string;       // Backend retorna FirstName
  lastName: string;        // Backend retorna LastName
  name?: string;           // Campo calculado localmente se necessário
  emailVerified?: boolean;
  roles?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface KeycloakTokenPayload {
  sub: string;
  preferred_username: string;
  email: string;
  email_verified: boolean;
  name: string;
  given_name: string;
  family_name: string;
  realm_access?: {
    roles: string[];
  };
}
