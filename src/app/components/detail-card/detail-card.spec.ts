import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailCard } from './detail-card';

describe('DetailCard', () => {
  let component: DetailCard;
  let fixture: ComponentFixture<DetailCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
