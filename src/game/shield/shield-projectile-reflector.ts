import Shield, { IShield } from '.';
import Projectile from '../entities/projectile';

export default class ShieldProjectileReflector extends Shield {
  constructor(props: IShield) {
    super(props);
    this.shieldKey = 'shield-projectile-reflector';
    this.duration = 2;
  }

  public onHit(projectile: Projectile) {
    const byPosition = projectile.by.position;

    projectile.lookAt(byPosition.x, byPosition.y);
    projectile.by = this.agent;
  }
}
