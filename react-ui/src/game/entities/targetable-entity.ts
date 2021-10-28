import Game from '../game';
import { IEntity } from '../interfaces';
import Entity from './entity';

interface IModifier {
  type: string;
  value: number;
}

export interface ITargetableEntity extends IEntity {
  team: number;
}

export default class TargetableEntity extends Entity {
  public maxHp: number;
  public hp: number;
  public team: number;
  protected __modifiers: IModifier[];

  constructor(props: ITargetableEntity) {
    super(props);

    this.maxHp = 100;
    this.hp = 100;
    this.team = props.team;

    this.__modifiers = [];
  }

  public get entityType() {
    return 'targetable-entity';
  }

  public heal(healing: number) {
    this.hp += healing;
    super.heal(healing);
  }

  public hurt(damage: number) {
    this.hp -= damage;
    super.hurt(damage);
  }

  public get isDead() {
    return this.hp <= 0;
  }

  public onDead(game: Game) {}

  public addModifier(modifier: IModifier) {
    this.__modifiers.push(modifier);
  }

  public removeModifier(modifier: IModifier) {
    const index = this.__modifiers.indexOf(modifier);
    if (index > -1) {
      this.__modifiers.splice(index, 1);
    } else {
      throw new Error('Modifier not found');
    }
  }
}
