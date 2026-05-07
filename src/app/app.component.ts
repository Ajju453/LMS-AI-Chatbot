import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TaskFormComponent } from './components/task-form/task-form.component';
import { TaskItemComponent } from './components/task-item/task-item.component';
import { TaskService } from './services/task.service';
import { Task } from './models/task.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TaskFormComponent,
    TaskItemComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [TaskService]
})
export class AppComponent implements OnInit {
  tasks: Task[] = [];
  filteredTasks: Task[] = [];
  filterStatus: 'all' | 'active' | 'completed' = 'all';

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.taskService.getTasks().subscribe((tasks) => {
      this.tasks = tasks;
      this.applyFilter();
    });
  }

  onTaskAdded(task: { title: string; description: string }): void {
    this.taskService.addTask(task.title, task.description);
  }

  onTaskDeleted(id: string): void {
    this.taskService.deleteTask(id);
  }

  onTaskToggled(id: string): void {
    this.taskService.toggleTask(id);
  }

  setFilter(status: 'all' | 'active' | 'completed'): void {
    this.filterStatus = status;
    this.applyFilter();
  }

  private applyFilter(): void {
    switch (this.filterStatus) {
      case 'active':
        this.filteredTasks = this.tasks.filter(task => !task.completed);
        break;
      case 'completed':
        this.filteredTasks = this.tasks.filter(task => task.completed);
        break;
      default:
        this.filteredTasks = [...this.tasks];
    }
  }
}
