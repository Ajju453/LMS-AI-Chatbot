import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-task-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './task-item.component.html',
  styleUrls: ['./task-item.component.css']
})
export class TaskItemComponent {
  @Input() task!: Task;
  @Output() taskToggled = new EventEmitter<string>();
  @Output() taskDeleted = new EventEmitter<string>();

  toggleTask(): void {
    this.taskToggled.emit(this.task.id);
  }

  deleteTask(): void {
    this.taskDeleted.emit(this.task.id);
  }
}
