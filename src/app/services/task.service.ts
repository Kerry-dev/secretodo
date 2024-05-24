import { Injectable } from '@angular/core';
import { ITaskService } from '../interfaces/ITaskService';
import { BehaviorSubject, Observable, Subscriber } from 'rxjs';
import { ITask } from '../interfaces/ITask';
import { TaskContent, TaskOptionalContent } from '../types/Task';
import { Task } from '../classes/Task';
import { get, has } from 'lodash-es';

@Injectable({
  providedIn: 'root',
})
export class TaskService implements ITaskService {
  private list: Array<ITask>;
  private _changeEvent$: BehaviorSubject<Array<ITask>>;
  public changeEvent$: Observable<Array<ITask>>;

  constructor() {
    this.list = [];
    this._changeEvent$ = new BehaviorSubject<Array<ITask>>([]);
    this.changeEvent$ = this._changeEvent$.asObservable();
  }
  public get(id: number): Observable<ITask | undefined> {
    return new Observable((subscriber: Subscriber<ITask | undefined>) => {
      if (this.list.length === 0) {
        subscriber.next();
        subscriber.complete();
      }
      const target: ITask | undefined = this.list.find((item: ITask) => item.id === id);
      subscriber.next(target);
    });
  }
  public create(payload: TaskContent): Observable<boolean> {
    return new Observable((subscriber: Subscriber<boolean>) => {
      const id = new Date().getTime();
      const newTask: ITask = new Task(Object.assign({ id }, payload));
      if (newTask.id === 0) {
        subscriber.next(false);
        subscriber.complete();
      } else {
        this.list.push(newTask);
        this._changeEvent$.next(this.list);
        subscriber.next(true);
      }
    });
  }
  public update(id: number, payload: TaskOptionalContent): Observable<boolean> {
    return new Observable((subscriber: Subscriber<boolean>) => {
      const id = new Date().getTime();
      const newTask: ITask = new Task(Object.assign({ id }, payload));
      if (newTask.id === 0) {
        subscriber.next(false);
        subscriber.complete();
      } else {
        this.list.push(newTask);
        this._changeEvent$.next(this.list);
        subscriber.next(true);
      }
    });
  }
  public filter(payload: TaskOptionalContent): void {
    const keys: Array<string> = Object.keys(payload);
    if (keys.length === 0) {
      this._changeEvent$.next(this.list);
      return;
    }
    const filterList: Array<ITask> = this.list.filter((item: ITask) => {
      let res: boolean = true;
      if (has(payload, 'isCompleted')) res = res && item.isCompleted === payload.isCompleted;
      if (has(payload, 'description')) {
        const compareString = get(payload, 'description', '');
        res = res && item.description.indexOf(compareString) > -1;
      }
      return res;
    });
    this._changeEvent$.next(filterList);
  }
  public delete(id: number): Observable<boolean> {
    return new Observable((subscriber: Subscriber<boolean>) => {
      const targetIndex: number = this.list.findIndex((item: ITask) => item.id === id);
      if (targetIndex < 0) {
        subscriber.next(false);
        subscriber.complete();
      } else {
        this.list.splice(targetIndex, 1);
        this._changeEvent$.next(this.list);
      }
    });
  }
}
