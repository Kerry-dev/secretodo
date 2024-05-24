import { Observable } from 'rxjs';
import { ITask } from './ITask';
import { TaskContent, TaskOptionalContent } from '../types/Task';

export interface ITaskService {
  // list: Array<ITask>;
  changeEvent$: Observable<Array<ITask>>;
  timer$: Observable<number>;
  get(id: number): Observable<ITask | undefined>;
  create(payload: TaskContent): Observable<boolean>;
  update(id: number, payload: TaskOptionalContent): Observable<boolean>;
  filter(payload: TaskOptionalContent): void;
  delete(id: number): Observable<boolean>;
}
