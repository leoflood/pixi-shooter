import Agent from '.';
import Game from '../../game';

const minDistanceToMove = 200;

export default class NPC extends Agent {
  public think(game: Game) {
    super.think(game);

    if (game.isOutside(this.position.x, this.position.y)) {
      return;
    }

    const closerEnemy = game.getTheCloserEnemyOfAgent(this);
    const itemToCollect = game.getAnyItemTheAgentCanCollect(this);

    // Movement
    if (itemToCollect) {
      game.moveAgentTo(
        this,
        itemToCollect.position.x,
        itemToCollect.position.y
      );
    } else if (
      closerEnemy &&
      !closerEnemy.isDead &&
      this.getDistance(closerEnemy.position.x, closerEnemy.position.y) >
        minDistanceToMove
    ) {
      game.moveAgentTo(this, closerEnemy.position.x, closerEnemy.position.y);
    }

    // Attack
    if (closerEnemy && !closerEnemy.isDead) {
      game.tryToShotTo(this, closerEnemy.position.x, closerEnemy.position.y);
      this.skills.forEach((s) => s.tryToExecute(game));
    }
  }
}
