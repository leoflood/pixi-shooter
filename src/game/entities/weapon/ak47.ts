import { IWeapon } from '../../interfaces';
import Weapon from '../weapon';

export default class Ak47 extends Weapon {
  constructor(props: IWeapon) {
    super(props);

    this.roundsPerMinute = 600;

    this.spriteData.weaponKey = 'weapon-ak47';
    this.spriteData.soundKey = 'ak47';

    this.projectileKey = 'projectile-bullet';
  }
}
