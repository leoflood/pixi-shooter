import { IAgentChild } from '.';
import SkillBoost from '../../skill/skill-boost';
import SkillShaking from '../../skill/skill-shaking';
import SkillShieldProjectileReflector from '../../skill/skill-shield-projectile-reflector';
import Vector2D from '../../utils/vector-2d';
import Ak47 from '../weapon/ak47';
import NPC from './npc';

export default class Char1Clone extends NPC {
  constructor(props: IAgentChild) {
    super({
      ...props,
      agent: 'char1',
    });

    this.maxHp = 1;
    this.hp = 1;
    this.__speed = 5;
    this.__minSpeed = 1;

    this.spawnSoundsKey = ['clone'];

    this.addEntity(
      new Ak47({
        position: new Vector2D(this.position.x + 16, this.position.y + 24),
      })
    );

    this.addSkill(new SkillBoost({ agent: this }));
    this.addSkill(new SkillShaking({ agent: this }));
    this.addSkill(new SkillShieldProjectileReflector({ agent: this }));
  }
}
