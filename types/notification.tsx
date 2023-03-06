import type { Job } from './job';

type NotificationType = {
  id: number;
  name: string;
}

export type Notification = {
  date: string;
  id: number;
  user_id: number;
  notification_type: NotificationType;
  job: Job;
  read: boolean;
}