import Agent from '../entities/agent';
import { ISkill } from '../interfaces';
import Game from '../game';
import { TRIGGER_SKILL_EXECUTED } from '../game-triggers';
import { soundKey } from '../sounds';

export default class Skill {
  agent: Agent;
  protected delay: number;
  protected lastTimeExecuted: number;
  public soundKey?: soundKey;
  public effectKey?: string;
  public effectDuration?: number;

  constructor(props: ISkill) {
    this.agent = props.agent;
    this.delay = 9999;
    this.lastTimeExecuted = 0;
    this.soundKey = '';
  }

  public tryToExecute(game: Game) {
    const now = Date.now();
    if (this.lastTimeExecuted + this.delay * 1000 <= now) {
      this.execute(game);
      game.trigger(TRIGGER_SKILL_EXECUTED, [this]);
      this.lastTimeExecuted = now;
    }
  }

  protected execute(game: Game) {}

  public get secondsToNextRound() {
    const timeToNextRound =
      this.lastTimeExecuted + this.delay * 1000 - Date.now();

    if (timeToNextRound < 0) {
      return 0;
    }

    return Math.round(timeToNextRound / 1000);
  }
}
