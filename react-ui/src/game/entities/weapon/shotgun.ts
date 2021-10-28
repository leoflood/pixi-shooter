import { IWeapon } from '../../interfaces';
import Weapon from '.';

export default class Shotgun extends Weapon {
  constructor(props: IWeapon) {
    super(props);

    this.roundsPerMinute = 65;

    this.spriteData.weaponKey = 'weapon-shotgun';
    this.spriteData.soundKey = 'shotgun';

    this.projectileKey = 'projectile-bullet';
  }
}
