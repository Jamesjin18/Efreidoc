export interface Roles {
  subscriber?: boolean;
  editor?: boolean;
  admin?: boolean;
}

export interface Promotion {
  promotion: string;
  date: Date;
  change: number;
}

export interface User {
  uid: string;
  email: string;
  roles: Roles;
  promotion: Promotion;
}
