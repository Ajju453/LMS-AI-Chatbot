import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskItemComponent } from './task-item.component';
import { Task } from '../../models/task.model';

describe('TaskItemComponent', () => {
  let component: TaskItemComponent;
  let fixture: ComponentFixture<TaskItemComponent>;

  const mockTask: Task = {
    id: '1',
    title: 'Test Task',
    description: 'Test Description',
    completed: false,
    createdAt: new Date()
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskItemComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TaskItemComponent);
    component = fixture.componentInstance;
    component.task = mockTask;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit taskToggled event when toggleTask is called', () => {
    spyOn(component.taskToggled, 'emit');
    component.toggleTask();
    expect(component.taskToggled.emit).toHaveBeenCalledWith('1');
  });

  it('should emit taskDeleted event when deleteTask is called', () => {
    spyOn(component.taskDeleted, 'emit');
    component.deleteTask();
    expect(component.taskDeleted.emit).toHaveBeenCalledWith('1');
  });

  it('should display task title', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Test Task');
  });
});
