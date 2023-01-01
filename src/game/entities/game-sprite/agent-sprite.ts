import * as PIXI from 'pixi.js';
import { IAgentSprite } from '../../interfaces';
import { greenFilter, redFilter } from '../../pixi-filters';
import Entity from '../entity';
import sounds from '../../sounds';
import textures from '../../textures';
import Vector2D from '../../utils/vector-2d';
import Agent from '../agent';
import { agentsZIndex } from '../../pixi-z-index';
import { PLAYER_ID } from '../../constants';

const HP_BAR_WIDTH = 56;
const HP_BAR_HEIGHT = 10;

export default class AgentSprite extends Entity {
  public sprite: PIXI.Sprite;
  private hpBar?: PIXI.Graphics;
  private agent: Agent;

  constructor(props: IAgentSprite, agent: Agent) {
    super(props);

    // Agent Sprite
    const texture = textures[props.agent];
    const sprite = new PIXI.Sprite(texture);
    // change the sprite's size
    sprite.width = props.width;
    sprite.height = props.height;
    // center the sprite's anchor point
    sprite.anchor.x = 0.5;
    sprite.anchor.y = 0.5;
    // move the sprite to the center of the screen
    sprite.position.x = props.position.x;
    sprite.position.y = props.position.y;

    // Z Index
    sprite.zIndex = agentsZIndex;

    // Add the sprite to the state
    this.sprite = sprite;
    this.agent = agent;

    // The player has not hp bar
    if (this.agent.uuid !== PLAYER_ID) {
      this.createHpBar();
    }
  }

  private createHpBar() {
    const maxHp = new PIXI.Graphics();
    maxHp.beginFill(0x4a0707);
    maxHp.drawRect(0, 0, HP_BAR_WIDTH, HP_BAR_HEIGHT);
    maxHp.endFill();
    maxHp.position.x = -HP_BAR_WIDTH / 2;
    maxHp.position.y = -this.sprite.height / 2 - 64;
    const hp = new PIXI.Graphics();
    hp.beginFill(0xff0000);
    hp.drawRect(0, 0, HP_BAR_WIDTH, HP_BAR_HEIGHT);
    hp.endFill();
    maxHp.addChild(hp);
    this.sprite.addChild(maxHp);
    this.hpBar = hp;
    this.hpBar.parent.visible = false;
  }

  private updateHpBar() {
    if (this.hpBar) {
      this.hpBar.width = (this.agent.hp * HP_BAR_WIDTH) / this.agent.maxHp;

      // If the agent has lost hp, the hp bar will be visible
      if (this.agent.hp !== this.agent.maxHp) {
        this.hpBar.parent.visible = true;
      }
    }
  }

  public move(vector: Vector2D) {
    this.sprite.position.x += vector.x;
    this.sprite.position.y += vector.y;

    super.move(vector);
  }

  public hurt(n: number) {
    this.updateHpBar();

    this.sprite.filters = [redFilter];
    sounds.pain.play();

    setTimeout(() => {
      this.sprite.filters = [];
    }, 100);

    super.hurt(n);
  }

  public heal(n: number) {
    this.updateHpBar();

    this.sprite.filters = [greenFilter];
    sounds.heal.play();

    setTimeout(() => {
      this.sprite.filters = [];
    }, 500);

    super.heal(n);
  }
}
