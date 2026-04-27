import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have title', () => {
    expect(component.title).toBe('Task Manager');
  });

  it('should call taskService.addTask on taskAdded event', () => {
    const taskService = (component as any).taskService;
    spyOn(taskService, 'addTask');
    component.onTaskAdded({ title: 'Test', description: 'Desc' });
    expect(taskService.addTask).toHaveBeenCalledWith('Test', 'Desc');
  });
});
