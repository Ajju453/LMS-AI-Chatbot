import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Task } from '../models/task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private tasks$ = new BehaviorSubject<Task[]>([]);
  private readonly STORAGE_KEY = 'tasks';

  constructor() {
    this.loadTasks();
  }

  getTasks(): Observable<Task[]> {
    return this.tasks$.asObservable();
  }

  addTask(title: string, description: string): void {
    const newTask: Task = {
      id: this.generateId(),
      title,
      description,
      completed: false,
      createdAt: new Date()
    };
    const currentTasks = this.tasks$.value;
    this.tasks$.next([...currentTasks, newTask]);
    this.saveTasks();
  }

  deleteTask(id: string): void {
    const currentTasks = this.tasks$.value;
    this.tasks$.next(currentTasks.filter(task => task.id !== id));
    this.saveTasks();
  }

  toggleTask(id: string): void {
    const currentTasks = this.tasks$.value;
    const updatedTasks = currentTasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    this.tasks$.next(updatedTasks);
    this.saveTasks();
  }

  private loadTasks(): void {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      const tasks = JSON.parse(stored).map((task: any) => ({
        ...task,
        createdAt: new Date(task.createdAt)
      }));
      this.tasks$.next(tasks);
    }
  }

  private saveTasks(): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.tasks$.value));
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}
