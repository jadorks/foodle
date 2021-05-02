import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { OtherUserPage } from './other-user.page';

describe('OtherUserPage', () => {
  let component: OtherUserPage;
  let fixture: ComponentFixture<OtherUserPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OtherUserPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(OtherUserPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
