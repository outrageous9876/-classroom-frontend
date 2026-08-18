export type Department = {
  id: number;
  name: string;
  code?: string;
};

export type Subject = {
  id: number;
  code: string;
  name: string;
  description?: string;
  department?: Department;
  createdAt?: string;
};

export type User = {
  id: number;
  name: string;
  email: string;
  role?: string;
  createdAt?: string;
};
