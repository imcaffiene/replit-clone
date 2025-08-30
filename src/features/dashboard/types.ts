import { Templates } from "@prisma/client";

export type CreatePlayground = {
  title: string;
  description?: string;
  template: Templates;
};

export type PlaygroundResult = {
  success: boolean;
  playground?: any;
  error?: string;
};

export type GetPlaygroundsResult = {
  success: boolean;
  playgrounds?: any[];
  error?: string;
};

export interface User {
  id: string;
  name: string;
  email: string;
  image: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  template: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  user: User;
  starmarks: { isMarked: boolean }[];
}
