import * as PIXI from 'pixi.js';
import { IEntity } from '../../interfaces';
import { redFilter } from '../../pixi-filters';
import Entity from '../entity';
import sounds from '../../sounds';
import textures from '../../textures';
import { wallsZIndex } from '../../pixi-z-index';

export interface IWallSprite extends IEntity {
  wallKey: string;
  width: number;
  height: number;
}

export default class WallSprite extends Entity {
  public sprite: PIXI.Sprite;

  constructor(props: IWallSprite) {
    super(props);

    // Agent Sprite
    const texture = textures[props.wallKey];
    const sprite = new PIXI.Sprite(texture);
    // change the sprite's size
    sprite.width = props.width;
    sprite.height = props.height;
    // center the sprite's anchor point
    sprite.anchor.x = 0.5;
    sprite.anchor.y = 0.5;
    // move the sprite to the center of the screen
    sprite.position.x = props.position.x;
    sprite.position.y = props.position.y;

    // Z Index
    sprite.zIndex = wallsZIndex;

    // Add the sprite to the state
    this.sprite = sprite;
  }

  public hurt(n: number) {
    this.sprite.filters = [redFilter];
    sounds['wall-hit'].play();

    setTimeout(() => {
      this.sprite.filters = [];
    }, 100);

    super.hurt(n);
  }
}
