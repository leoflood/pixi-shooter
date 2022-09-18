import { IAgentChild } from '.';
import Vector2D from '../../utils/vector-2d';
import Shotgun from '../weapon/shotgun';
import NPC from './npc';

export default class Char2 extends NPC {
  constructor(props: IAgentChild) {
    super({
      ...props,
      agent: 'char2',
    });

    this.maxHp = 100;
    this.hp = 100;

    this.spawnSoundsKey = ['haha'];
    this.spawnSoundChance = 0.1;

    this.addEntity(
      new Shotgun({
        position: new Vector2D(this.position.x + 16, this.position.y + 24),
      })
    );
  }
}
