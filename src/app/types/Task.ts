import { FormControl } from '@angular/forms';

export type TaskData = TaskContent & {
  id: number;
};

export type TaskFormModel = {
  description: FormControl<string | null>;
  isCompleted: FormControl<boolean | null>;
  dueTime: FormControl<number | null>;
};

export type TaskContent = {
  description: string;
  isCompleted: boolean;
  dueTime: number;
};

export type TaskOptionalContent = {
  description?: string;
  isCompleted?: boolean;
  dueTime?: number;
};
