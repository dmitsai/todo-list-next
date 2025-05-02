import { Status } from './status';

export type Todo = {
  id: string;
  task: string;
  date: string;
  status: Status;
};
