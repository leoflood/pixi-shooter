import Agent, { IAgentChild } from '.';
import SkillBoost from '../../skill/skill-boost';
import SkillClone from '../../skill/skill-clone';
import SkillShaking from '../../skill/skill-shaking';
import SkillShieldProjectileReflector from '../../skill/skill-shield-projectile-reflector';
import Vector2D from '../../utils/vector-2d';
import Axe from '../melee-weapon/axe';
import Ak47 from '../weapon/ak47';

export default class Char1 extends Agent {
  constructor(props: IAgentChild) {
    super({
      ...props,
      agent: 'char1',
    });

    this.maxHp = 1000;
    this.hp = 999999;
    this.__speed = 5;
    this.__minSpeed = 1;

    this.addEntity(
      new Axe({
        position: new Vector2D(this.position.x + 16, this.position.y + 24),
      })
    );

    this.addSkill(new SkillClone({ agent: this }));
    this.addSkill(new SkillBoost({ agent: this }));
    this.addSkill(new SkillShaking({ agent: this }));
    this.addSkill(new SkillShieldProjectileReflector({ agent: this }));
  }
}
