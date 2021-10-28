import Skill from '.';
import Game from '../game';
import { ISkill } from '../interfaces';

export default class Shaking extends Skill {
  constructor(props: ISkill) {
    super(props);
    this.delay = 16;

    this.effectKey = 'shake';
    this.effectDuration = 2500;
    this.soundKey = 'haha';
  }

  execute(game: Game) {
    game.getEnemyAgentsOfTeam(this.agent.team).forEach((a) => {
      game.hurtAgent(a, 35, this.agent);

      const modifier = {
        type: 'speed-multiplier',
        value: 0,
      };
      a.addModifier(modifier);
      setTimeout(() => {
        a.removeModifier(modifier);
      }, this.effectDuration);
    });
  }
}
