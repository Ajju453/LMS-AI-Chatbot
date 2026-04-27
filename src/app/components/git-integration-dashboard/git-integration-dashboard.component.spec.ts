import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GitIntegrationDashboardComponent } from './git-integration-dashboard.component';

describe('GitIntegrationDashboardComponent', () => {
  let component: GitIntegrationDashboardComponent;
  let fixture: ComponentFixture<GitIntegrationDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GitIntegrationDashboardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GitIntegrationDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
