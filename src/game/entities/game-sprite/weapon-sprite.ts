import * as PIXI from 'pixi.js';
import { IWeaponSprite } from '../../interfaces';
import { greenFilter, redFilter } from '../../pixi-filters';
import Entity from '../entity';
import sounds, { soundKey } from '../../sounds';
import Vector2D from '../../utils/vector-2d';
import textures from '../../textures';
import { weaponsZIndex } from '../../pixi-z-index';

export default class WeaponSprite extends Entity {
  public sprite: PIXI.Sprite;
  private soundKey: soundKey;

  constructor(props: IWeaponSprite) {
    super(props);

    const texture = textures[props.weaponKey];
    const sprite = new PIXI.Sprite(texture);
    // change the sprite's position
    sprite.position.x = props.position.x;
    sprite.position.y = props.position.y;
    // change the sprite's size
    sprite.width = props.width;
    sprite.height = props.height;
    // center the sprite's anchor point
    sprite.anchor.x = 0.5;
    sprite.anchor.y = 0.5;

    // Z Index
    sprite.zIndex = weaponsZIndex;

    // Add the sprite to the state
    this.sprite = sprite;

    this.soundKey = props.soundKey;
  }

  public move(vector: Vector2D) {
    this.sprite.position.x += vector.x;
    this.sprite.position.y += vector.y;

    super.move(vector);
  }

  public lookAt(x: number, y: number) {
    // Rotates the weapon to (x,y) position
    const rotation = this.getRotationTo(x, y);
    this.sprite.rotation = rotation;

    if (x < this.position.x) {
      if (Math.sign(this.sprite.scale.y) === 1) {
        this.sprite.scale.y *= -1;
      }
    } else {
      if (Math.sign(this.sprite.scale.y) === -1) {
        this.sprite.scale.y *= -1;
      }
    }

    super.lookAt(x, y);
  }

  public hurt(n: number) {
    this.sprite.filters = [redFilter];

    setTimeout(() => {
      this.sprite.filters = [];
    }, 100);

    super.hurt(n);
  }

  public heal(n: number) {
    this.sprite.filters = [greenFilter];
    // sounds.pain.play();

    setTimeout(() => {
      this.sprite.filters = [];
    }, 500);

    super.heal(n);
  }

  public attack() {
    sounds[this.soundKey].play();
    super.attack();
  }
}
