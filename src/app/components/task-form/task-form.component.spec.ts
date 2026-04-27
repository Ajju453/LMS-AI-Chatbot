import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskFormComponent } from './task-form.component';
import { ReactiveFormsModule } from '@angular/forms';

describe('TaskFormComponent', () => {
  let component: TaskFormComponent;
  let fixture: ComponentFixture<TaskFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskFormComponent, ReactiveFormsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(TaskFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit taskAdded event on valid form submission', () => {
    spyOn(component.taskAdded, 'emit');
    component.taskForm.patchValue({
      title: 'New Task',
      description: 'Task Description'
    });
    component.onSubmit();
    expect(component.taskAdded.emit).toHaveBeenCalledWith({
      title: 'New Task',
      description: 'Task Description'
    });
  });

  it('should reset form after submission', () => {
    component.taskForm.patchValue({
      title: 'New Task',
      description: 'Task Description'
    });
    component.onSubmit();
    expect(component.taskForm.get('title')?.value).toBeNull();
    expect(component.taskForm.get('description')?.value).toBeNull();
  });

  it('should not emit event on invalid form submission', () => {
    spyOn(component.taskAdded, 'emit');
    component.onSubmit();
    expect(component.taskAdded.emit).not.toHaveBeenCalled();
  });
});
