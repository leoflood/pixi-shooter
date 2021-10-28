import Game from '../../game';
import { IWeapon } from '../../interfaces';
import Agent from '../agent';
import Entity from '../entity';
import { projectileKey } from '../projectile/projectiles-map';

export default class Weapon extends Entity {
  protected roundsPerMinute: number;

  public isWeapon: boolean;
  public lastRoundTime: number;
  public projectileKey: projectileKey | '';

  constructor(props: IWeapon) {
    super(props);

    this.isWeapon = true;
    this.position = props.position;

    // Weapon stats
    this.roundsPerMinute = 0;

    this.lastRoundTime = 0;

    this.projectileKey = ''; // Define in child

    this.spriteData = {
      spriteKey: 'weapon',
      weaponKey: '', // Define in child
      soundKey: '', // Define in child
      width: 60,
      height: 20,
      position: this.position.clone(),
    };
  }

  public onShoot(game: Game, by: Agent, rotation: number) {}

  public get timeElapsedSinceLastRound() {
    return Date.now() - this.lastRoundTime;
  }

  public get secondsElapsedSinceLastRound() {
    return this.timeElapsedSinceLastRound / 1000;
  }

  public get secondsDelayOfRound() {
    return 60 / this.roundsPerMinute;
  }

  public shoot() {
    if (this.secondsElapsedSinceLastRound > this.secondsDelayOfRound) {
      this.lastRoundTime = Date.now();

      return true;
    }

    return false;
  }
}
