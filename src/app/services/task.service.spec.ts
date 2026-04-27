import { TestBed } from '@angular/core/testing';
import { TaskService } from './task.service';

describe('TaskService', () => {
  let service: TaskService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TaskService);
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add a task', (done) => {
    service.addTask('Test Task', 'Test Description');
    service.getTasks().subscribe(tasks => {
      expect(tasks.length).toBe(1);
      expect(tasks[0].title).toBe('Test Task');
      done();
    });
  });

  it('should delete a task', (done) => {
    service.addTask('Task 1', 'Description 1');
    service.getTasks().subscribe(tasks => {
      if (tasks.length === 1) {
        service.deleteTask(tasks[0].id);
      }
    });

    setTimeout(() => {
      service.getTasks().subscribe(tasks => {
        expect(tasks.length).toBe(0);
        done();
      });
    }, 100);
  });

  it('should toggle task completion status', (done) => {
    service.addTask('Task 1', 'Description 1');
    service.getTasks().subscribe(tasks => {
      if (tasks.length === 1 && !tasks[0].completed) {
        service.toggleTask(tasks[0].id);
      }
    });

    setTimeout(() => {
      service.getTasks().subscribe(tasks => {
        expect(tasks[0].completed).toBe(true);
        done();
      });
    }, 100);
  });

  it('should persist tasks to localStorage', (done) => {
    service.addTask('Persistent Task', 'Description');
    setTimeout(() => {
      const stored = localStorage.getItem('tasks');
      expect(stored).toBeTruthy();
      const parsed = JSON.parse(stored!);
      expect(parsed.length).toBe(1);
      done();
    }, 100);
  });
});
