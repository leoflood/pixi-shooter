import Projectile, { IProjectile } from '.';
import Game from '../../game';
import TargetableEntity from '../targetable-entity';

export class ProjectileBullet extends Projectile {
  constructor(props: IProjectile) {
    super(props);

    this.damage = 10;
    this.speed = 20;

    this.width = 6;
    this.height = 6;

    this.spriteData.projectileKey = 'projectile-bullet';
    this.spriteData.width = 24;
    this.spriteData.height = 6;
  }
}

export class ProjectilePowerBall extends Projectile {
  constructor(props: IProjectile) {
    super(props);

    this.damage = 80;
    this.speed = 24;

    this.width = 24;
    this.height = 24;

    this.spriteData.projectileKey = 'projectile-power-ball';
    this.spriteData.width = 24;
    this.spriteData.height = 24;
  }

  public onImpact(game: Game, entity: TargetableEntity) {
    if (!super.onImpact(game, entity)) {
      return false;
    }

    // Slows down agents
    const modifier = {
      type: 'speed',
      value: -2,
    };

    entity.addModifier(modifier);

    setTimeout(() => {
      entity.removeModifier(modifier);
    }, 2000);

    return true;
  }
}
