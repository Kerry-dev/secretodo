import { Component, Input, OnInit } from '@angular/core';
import { ITask } from '../../interfaces/ITask';
import { TaskService } from '../../services/task.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { TaskStatus } from '../../enums/task-status';
import { Subscription, tap } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';

@UntilDestroy({ checkProperties: true })
@Component({
  selector: 'app-task-card',
  standalone: true,
  imports: [MatCardModule, MatCheckboxModule],
  templateUrl: './task-card.component.html',
  styleUrl: './task-card.component.scss',
})
export class TaskCardComponent implements OnInit {
  @Input() taskItem!: ITask;
  public taskStatus: TaskStatus;
  public isShowAll: boolean;
  private timerObserve: Subscription | null;
  constructor(private service: TaskService) {
    this.taskStatus = this.taskItem.isCompleted ? TaskStatus.COMPLETE : TaskStatus.NORMAL;
    this.timerObserve = null;
    this.isShowAll = false;
  }
  ngOnInit(): void {
    if (!this.taskItem.isCompleted && this.taskItem.dueTime !== 0) {
      this.handleTimerWatch();
    }
    this.taskItem.changeEvent$
      .pipe(
        tap(() => this.handleTimerWatch()),
        untilDestroyed(this),
      )
      .subscribe();
  }
  public onShowToggleClick(currsStatus: boolean = this.isShowAll): void {
    this.isShowAll = !currsStatus;
  }

  private handleTimerWatch(): void {
    if (this.timerObserve !== null) this.timerObserve.unsubscribe();
    this.timerObserve = this.service.timer$
      .pipe(
        tap(() => {
          this.taskStatus = this.getTaskStatus(this.taskItem.dueTime);
        }),
        untilDestroyed(this),
      )
      .subscribe();
  }

  private getTaskStatus(targetTime: number): TaskStatus {
    const current: number = new Date().getTime();
    if (current > this.taskItem.dueTime) return TaskStatus.DUE;
    const diff: number = targetTime - current;
    if (diff < 3600000) return TaskStatus.WARNING;
    return TaskStatus.NORMAL;
  }
}
