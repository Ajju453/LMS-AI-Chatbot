import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SshKeyGeneratorComponent } from './ssh-key-generator.component';

describe('SshKeyGeneratorComponent', () => {
  let component: SshKeyGeneratorComponent;
  let fixture: ComponentFixture<SshKeyGeneratorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SshKeyGeneratorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SshKeyGeneratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
