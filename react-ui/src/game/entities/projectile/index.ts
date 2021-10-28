import Game from '../../game';
import { IEntity } from '../../interfaces';
import Vector2D from '../../utils/vector-2d';
import Agent from '../agent';
import Entity from '../entity';
import TargetableEntity from '../targetable-entity';

export interface IProjectile extends IEntity {
  rotation: number;
  by: Agent;
}

export default class Projectile extends Entity {
  public rotation: number;
  public position: Vector2D;
  public speed: number;
  public by: Agent;
  public damage: number;

  constructor(props: IProjectile) {
    super(props);

    this.rotation = props.rotation;
    this.position = props.position;
    this.speed = 5;
    this.by = props.by;
    this.damage = 0; // Define in child

    this.spriteData = {
      spriteKey: 'projectile',
      projectileKey: '', // Define in child
      width: this.width,
      height: this.height,
      position: this.position.clone(),
      rotation: props.rotation,
    };
  }

  get team() {
    return this.by.team;
  }

  public continueTrajectory(game: Game) {
    const moveX = Math.cos(this.rotation) * this.speed;
    const moveY = Math.sin(this.rotation) * this.speed;
    super.move(new Vector2D(moveX, moveY));
  }

  public onImpact(game: Game, entity: TargetableEntity): boolean {
    if (this.team === entity.team) {
      return false;
    }

    game.hurtTargetableEntity(entity, this.damage, this.by);
    game.removeProjectile(this); // Remove the projectile
    return true;
  }

  public lookAt(x: number, y: number) {
    const rotation = this.getRotationTo(x, y);
    this.rotation = rotation;
    super.lookAt(x, y);
  }
}
