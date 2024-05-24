import { Observable } from 'rxjs';
import { TaskContent, TaskData } from '../types/Task';

export interface ITask extends TaskData {
  changeEvent$: Observable<TaskContent | null>;
  modify(payload: TaskContent): void;
}
