import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AboutDetailComponent } from './about-detail.component';
import { TranslateModule } from '@ngx-translate/core';

import { RouterTestingModule } from '@angular/router/testing';

describe('AboutDetailComponent', () => {
  let component: AboutDetailComponent;
  let fixture: ComponentFixture<AboutDetailComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AboutDetailComponent],
      imports: [TranslateModule.forRoot(), RouterTestingModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AboutDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render title in a h1 tag', waitForAsync(() => {
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain(
      'PAGES.DETAIL.TITLE'
    );
  }));
});
