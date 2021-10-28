import Skill from '.';
import { agentKey } from '../entities/agent/agents-map';
import Game from '../game';
import { ISkill } from '../interfaces';
import { getRandomIntInRange } from '../utils';
import Vector2D from '../utils/vector-2d';

export default class SkillClone extends Skill {
  constructor(props: ISkill) {
    super(props);
    this.delay = 80;

    // Initial delay:
    this.lastTimeExecuted = Date.now() - 60000;
  }

  execute(game: Game) {
    const offSet = 128;

    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        game.addAgent(
          game.createAgentByKey(
            `${this.agent.agent}-clone` as agentKey,
            new Vector2D(
              getRandomIntInRange(
                this.agent.position.x - offSet,
                this.agent.position.x + offSet
              ),
              getRandomIntInRange(
                this.agent.position.y - offSet,
                this.agent.position.y + offSet
              )
            ),
            this.agent.team
          )
        );
      }, 500 * i);
    }
  }
}
