import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CommandDialogComponent } from './command-dialog.component';

describe('CommandDialogComponent', () => {
  let component: CommandDialogComponent;
  let fixture: ComponentFixture<CommandDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [CommandDialogComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommandDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
