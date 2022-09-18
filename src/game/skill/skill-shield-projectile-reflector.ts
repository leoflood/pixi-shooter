import Skill from '.';
import Game from '../game';
import { ISkill } from '../interfaces';
import ShieldProjectileReflector from '../shield/shield-projectile-reflector';

export default class SkillShieldProjectileReflector extends Skill {
  constructor(props: ISkill) {
    super(props);
    this.delay = 12;

    this.soundKey = 'haha';
  }

  execute(game: Game) {
    game.addShieldToAgent(
      this.agent,
      new ShieldProjectileReflector({ agent: this.agent })
    );
  }
}
