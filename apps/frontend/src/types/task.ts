export interface Task {
  id: string;
  title: string;
  description?: string;
  status: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}
