import Skill from '.';
import Game from '../game';
import { ISkill } from '../interfaces';

export default class SkillBoost extends Skill {
  constructor(props: ISkill) {
    super(props);
    this.delay = 16;

    this.soundKey = 'haha';
  }

  execute(game: Game) {
    game.healAgent(this.agent, 100);

    const modifier = {
      type: 'speed',
      value: 15,
    };
    this.agent.addModifier(modifier);
    setTimeout(() => {
      this.agent.removeModifier(modifier);
    }, 3000);
  }
}
