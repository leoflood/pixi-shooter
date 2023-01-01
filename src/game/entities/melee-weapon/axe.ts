import MeleeWeapon from '.';
import { IEntity } from '../../interfaces';

export default class Axe extends MeleeWeapon {
  constructor(props: IEntity) {
    super(props);

    this.roundsPerMinute = 200;

    this.spriteData.weaponKey = 'weapon-axe';
    this.spriteData.soundKey = 'ak47';
  }
}
