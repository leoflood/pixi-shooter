import Item, { IItem } from '.';
import Game from '../../game';
import Agent from '../agent';

export class ItemMoney extends Item {
  constructor(props: IItem) {
    super(props);

    this.team = props.team;

    this.width = 48;
    this.height = 48;

    this.spriteData = {
      spriteKey: 'item',
      itemKey: 'item-money',
      width: 64,
      height: 64,
      position: this.position.clone(),
      rotation: 0,
    };
  }

  public canCollect(agent: Agent) {
    // Agent must be injured to collect
    return agent.hp < agent.maxHp && super.canCollect(agent);
  }

  public onCollect(game: Game, agent: Agent) {
    game.healAgent(agent, 150);
  }
}
