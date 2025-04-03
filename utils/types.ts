type UserRole = "superadmin" | "admin" | "user"; // add other possible roles here

export type UserTypes = {
  id: number;
  name: string;
  email: string;
  mobileNumber: string;
  roles: UserRole[];
  isAdmin: boolean;
  image?: any;
};
