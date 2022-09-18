import Game from '../../game';
import Shield from '../../shield';
import Skill from '../../skill';
import Vector2D from '../../utils/vector-2d';
import TargetableEntity, { ITargetableEntity } from '../targetable-entity';
import Weapon from '../weapon';
import { agentKey } from './agents-map';

export interface IAgent extends ITargetableEntity {
  agent: agentKey;
}

export type IAgentChild = Omit<IAgent, 'agent'>;

export default class Agent extends TargetableEntity {
  public hp: number;
  protected __speed: number;
  protected __minSpeed: number;
  public skills: Skill[];
  public shields: Shield[];
  public agent: string;

  public spawnSoundsKey?: string[];
  public spawnSoundChance: number;

  private __damageDone: number;

  constructor(props: IAgent) {
    super(props);

    this.maxHp = 100;
    this.hp = 100;
    this.__speed = 1;
    this.__minSpeed = 0;
    this.__damageDone = 0;

    this.width = 64;
    this.height = 64;

    this.agent = props.agent;

    this.spawnSoundChance = 1; // 100%

    this.spriteData = {
      spriteKey: 'agent',
      agent: this.agent,
      width: 128,
      height: 128,
      position: this.position.clone(),
    };

    this.skills = [];
    this.shields = [];
  }

  public get entityType() {
    return 'agent';
  }

  public get damageDone() {
    return this.__damageDone;
  }
  public sumToDamageDone(n: number) {
    this.__damageDone += n;
  }

  public get speed() {
    const speedModifiers = this.__modifiers
      .filter((m) => m.type === 'speed')
      .reduce((accumulator, a) => accumulator + a.value, 0); // with initial value to avoid when the array is empty

    const speedMultiplierModifiers = this.__modifiers
      .filter((m) => m.type === 'speed-multiplier')
      .reduce((accumulator, a) => accumulator * a.value, 1); // with initial value to avoid when the array is empty

    const speed = (this.__speed + speedModifiers) * speedMultiplierModifiers;

    return speed > this.__minSpeed ? speed : this.__minSpeed;
  }

  public getMovementTo(x: number, y: number, speed = this.speed) {
    const rotation = this.getRotationTo(x, y);
    return new Vector2D(Math.cos(rotation) * speed, Math.sin(rotation) * speed);
  }

  public think(game: Game) {
    // If the agent is outside, it will go to the center of the map
    if (
      game.isOutside(
        this.position.x,
        this.position.y,
        this.width / 2,
        this.height / 2
      )
    ) {
      // TODO: this is not the best solution, but works
      this.move(this.getMovementTo(game.width / 2, game.height / 2));
    }
  }

  public getWeapons() {
    const weapons: Weapon[] = [];

    this.forEach((e) => {
      if (e.isWeapon) {
        weapons.push(e);
      }
    });

    return weapons;
  }

  public addSkill(skill: Skill) {
    this.skills.push(skill);
  }

  public addShield(shield: Shield) {
    this.shields.push(shield);
  }

  public removeShield(shield: Shield) {
    const index = this.shields.indexOf(shield);
    if (index > -1) {
      this.shields.splice(index, 1);
    } else {
      throw new Error('Shield not found');
    }
  }
}
