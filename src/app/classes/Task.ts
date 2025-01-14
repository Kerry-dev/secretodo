import { BehaviorSubject, Observable } from 'rxjs';
import { get, has } from 'lodash-es';
import { TaskContent, TaskOptionalContent } from '../types/Task';
import { ITask } from '../interfaces/ITask';

export class Task implements ITask {
  public readonly id: number;
  public readonly changeEvent$: Observable<TaskContent | null>;
  private _changeEvent$: BehaviorSubject<TaskContent | null>;
  public description: string;
  public isCompleted: boolean;
  public dueTime: number;

  constructor(payload?: unknown) {
    const description = get(payload, 'description', '');
    const id = description !== '' ? get(payload, 'id', 0) : 0;
    this.id = id;
    this.description = description;
    this.isCompleted = get(payload, 'isCompleted', false);
    this._changeEvent$ = new BehaviorSubject<TaskContent | null>(null);
    this.changeEvent$ = this._changeEvent$.asObservable();
    this.dueTime = get(payload, 'dueTime', 0);
  }
  public modify(payload: TaskOptionalContent): void {
    if (has(payload, 'description')) this.description = get(payload, 'description', '');
    if (has(payload, 'isCompleted')) this.isCompleted = get(payload, 'isCompleted', false);
    if (has(payload, 'dueTime')) this.dueTime = get(payload, 'dueTime', 0);
  }
}
