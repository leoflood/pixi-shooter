import Game from '../../game';
import { IEntity } from '../../interfaces';
import Agent from '../agent';
import Entity from '../entity';

export default class MeleeWeapon extends Entity {
  protected roundsPerMinute: number;

  public isMeleeWeapon: boolean;
  public lastRoundTime: number;

  constructor(props: IEntity) {
    super(props);

    this.isMeleeWeapon = true;
    this.position = props.position;

    // Weapon stats
    this.roundsPerMinute = 0;

    this.lastRoundTime = 0;

    this.spriteData = {
      spriteKey: 'weapon',
      weaponKey: '', // Define in child
      soundKey: '', // Define in child
      width: 60,
      height: 20,
      position: this.position.clone(),
    };
  }

  public onMeleeAttack(game: Game, by: Agent, rotation: number) {}

  public get timeElapsedSinceLastRound() {
    return Date.now() - this.lastRoundTime;
  }

  public get secondsElapsedSinceLastRound() {
    return this.timeElapsedSinceLastRound / 1000;
  }

  public get secondsDelayOfRound() {
    return 60 / this.roundsPerMinute;
  }

  public meleeAttack() {
    if (this.secondsElapsedSinceLastRound > this.secondsDelayOfRound) {
      this.lastRoundTime = Date.now();

      return true;
    }

    return false;
  }
}
