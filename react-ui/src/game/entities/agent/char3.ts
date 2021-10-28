import { IAgentChild } from '.';
import SkillShieldProjectileReflector from '../../skill/skill-shield-projectile-reflector';
import Vector2D from '../../utils/vector-2d';
import Shotgun from '../weapon/shotgun';
import NPC from './npc';

export default class Char3 extends NPC {
  constructor(props: IAgentChild) {
    super({
      ...props,
      agent: 'char3',
    });

    this.maxHp = 250;
    this.hp = 250;

    this.spawnSoundsKey = ['haha'];
    this.spawnSoundChance = 0.1;

    this.addEntity(
      new Shotgun({
        position: new Vector2D(this.position.x + 16, this.position.y + 24),
      })
    );

    this.addSkill(new SkillShieldProjectileReflector({ agent: this }));
  }
}
