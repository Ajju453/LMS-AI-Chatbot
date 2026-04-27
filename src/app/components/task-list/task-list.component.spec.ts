import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskListComponent } from './task-list.component';
import { TaskService } from '../../services/task.service';
import { of } from 'rxjs';

describe('TaskListComponent', () => {
  let component: TaskListComponent;
  let fixture: ComponentFixture<TaskListComponent>;
  let taskService: TaskService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskListComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TaskListComponent);
    component = fixture.componentInstance;
    taskService = TestBed.inject(TaskService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should filter tasks by active status', () => {
    const tasks = [
      { id: '1', title: 'Task 1', description: '', completed: false, createdAt: new Date() },
      { id: '2', title: 'Task 2', description: '', completed: true, createdAt: new Date() }
    ];
    component.filter = 'active';
    const filtered = component.getFilteredTasks(tasks);
    expect(filtered.length).toBe(1);
    expect(filtered[0].completed).toBe(false);
  });

  it('should filter tasks by completed status', () => {
    const tasks = [
      { id: '1', title: 'Task 1', description: '', completed: false, createdAt: new Date() },
      { id: '2', title: 'Task 2', description: '', completed: true, createdAt: new Date() }
    ];
    component.filter = 'completed';
    const filtered = component.getFilteredTasks(tasks);
    expect(filtered.length).toBe(1);
    expect(filtered[0].completed).toBe(true);
  });

  it('should return all tasks when filter is all', () => {
    const tasks = [
      { id: '1', title: 'Task 1', description: '', completed: false, createdAt: new Date() },
      { id: '2', title: 'Task 2', description: '', completed: true, createdAt: new Date() }
    ];
    component.filter = 'all';
    const filtered = component.getFilteredTasks(tasks);
    expect(filtered.length).toBe(2);
  });

  it('should set filter when setFilter is called', () => {
    component.setFilter('completed');
    expect(component.filter).toBe('completed');
  });
});
