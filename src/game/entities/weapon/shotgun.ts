import Weapon from '.';
import { IEntity } from '../../interfaces';

export default class Shotgun extends Weapon {
  constructor(props: IEntity) {
    super(props);

    this.roundsPerMinute = 65;

    this.spriteData.weaponKey = 'weapon-shotgun';
    this.spriteData.soundKey = 'shotgun';

    this.projectileKey = 'projectile-bullet';
  }
}
