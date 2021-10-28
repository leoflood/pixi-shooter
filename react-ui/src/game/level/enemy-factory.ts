import Game from '../game';
import { getRandomFromArray } from '../utils';
import { IEnemyWave } from '.';
import Vector2D from '../utils/vector-2d';

export default class EnemyFactory {
  protected lastCreateTime: number;
  protected enemySpawnDelay: number;
  protected enemySpawnDelayToSubtractPerEnemySpawned: number;
  protected minEnemySpawnDelay: number;
  protected enemies: any[];

  public enemiesSpawned: number;

  constructor(props: IEnemyWave) {
    this.enemySpawnDelay = props.enemySpawnDelay;
    this.enemySpawnDelayToSubtractPerEnemySpawned =
      props.enemySpawnDelayToSubtractPerEnemySpawned;
    this.minEnemySpawnDelay = props.minEnemySpawnDelay;
    this.enemies = props.enemies;
    this.lastCreateTime = Date.now();
    this.enemiesSpawned = 0;
  }

  loop(game: Game) {
    const now = Date.now();

    if (this.lastCreateTime + this.enemySpawnDelay * 1000 <= now) {
      this.create(game);

      this.enemySpawnDelay = Math.max(
        this.minEnemySpawnDelay,
        this.enemySpawnDelay - this.enemySpawnDelayToSubtractPerEnemySpawned
      );
      return true;
    }

    return false;
  }

  create(game: Game) {
    const posRand = Math.random();
    let coords;

    if (posRand < 0.25) {
      // Top
      coords = {
        x: Math.random() * game.width,
        y: 0,
      };
    } else if (posRand < 0.5) {
      // Bottom
      coords = {
        x: Math.random() * game.width,
        y: game.height,
      };
    } else if (posRand < 0.75) {
      // Left
      coords = {
        x: 0,
        y: Math.random() * game.height,
      };
    } else {
      // Right
      coords = {
        x: game.width,
        y: Math.random() * game.height,
      };
    }

    game.addAgent(
      game.createAgentByKey(
        getRandomFromArray(this.enemies),
        new Vector2D(coords.x, coords.y),
        2
      )
    );

    this.lastCreateTime = Date.now();
    this.enemySpawnDelay = Math.max(
      this.minEnemySpawnDelay,
      this.enemySpawnDelay - this.enemySpawnDelayToSubtractPerEnemySpawned
    );
    this.enemiesSpawned++;
  }
}
