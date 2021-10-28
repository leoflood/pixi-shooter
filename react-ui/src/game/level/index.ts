import EnemyFactory from './enemy-factory';
import Game from '../game';
import { levelKey } from '../interfaces';
import _levels from '../levels.json';
import Vector2D from '../utils/vector-2d';
import agentsMap, { agentKey } from '../entities/agent/agents-map';
import {
  TRIGGER_ENEMY_WAVE_START,
  TRIGGER_GAME_FINISH,
} from '../game-triggers';

export interface IEnemyWave {
  enemiesNumber: number;
  enemies: (keyof typeof agentsMap)[];
  enemySpawnDelay: number;
  enemySpawnDelayToSubtractPerEnemySpawned: number;
  minEnemySpawnDelay: number;
}

export interface ILevelData {
  playerAgent: agentKey;
  winMessage: string;
  enemyWaves: IEnemyWave[];
  finalBoss: agentKey;
}

export interface ILevel {
  levelKey: levelKey;
}

interface ILevels {
  [key: string]: ILevelData;
}

const levels = _levels as ILevels;

export default class Level {
  public levelKey: keyof typeof levels;
  public levelData: ILevelData;

  private enemyFactory: EnemyFactory;
  public enemyWave: number;
  private bossHasSpawned: boolean;
  private finished: boolean;

  constructor(props: ILevel) {
    this.levelKey = props.levelKey;
    this.levelData = levels[this.levelKey];
    this.enemyWave = 0;
    this.bossHasSpawned = false;
    this.finished = false;

    this.enemyFactory = this.createEnemyFactory();
  }

  private createEnemyFactory() {
    return new EnemyFactory(this.enemyWaveData);
  }

  private get enemyWaveData() {
    return this.levelData.enemyWaves[this.enemyWave];
  }

  private get isTheLastWave() {
    return this.enemyWave === this.levelData.enemyWaves.length - 1;
  }

  public loop(game: Game) {
    const enemiesLimit = this.enemyWaveData.enemiesNumber;

    if (this.enemyFactory.enemiesSpawned < enemiesLimit) {
      this.enemyFactory.loop(game);
    } else if (!this.isTheLastWave) {
      if (game.getAgentsOfTeam(2).length === 0) {
        this.enemyWave++;
        this.enemyFactory = this.createEnemyFactory();
        game.trigger(TRIGGER_ENEMY_WAVE_START, [this.enemyWave]);
      }
    } else if (
      game.getAgentsOfTeam(2).length === 0 &&
      this.bossHasSpawned === false
    ) {
      game.addAgent(
        game.createAgentByKey(
          this.levelData.finalBoss,
          new Vector2D(game.width / 2, 0),
          2
        )
      );
      this.bossHasSpawned = true;
    } else if (game.getAgentsOfTeam(2).length === 0 && !this.finished) {
      this.finished = true;
      game.trigger(TRIGGER_GAME_FINISH, [this.levelData.winMessage]);
    }
  }
}
