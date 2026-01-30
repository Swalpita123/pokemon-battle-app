import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PokemonComponent } from './pokemons.component';

describe('PokemonsComponent', () => {
  let component: PokemonComponent;
  let fixture: ComponentFixture<PokemonComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PokemonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PokemonComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
