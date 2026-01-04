export type Role = 'ADMIN' | 'TEACHER' | 'STUDENT' | 'PARENT';

export interface RegisterBody {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  role?: Role;
}

export interface LoginBody {
  email: string;
  password: string;
}
