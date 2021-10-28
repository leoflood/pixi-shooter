import AgentSprite from '../entities/game-sprite/agent-sprite';
import WeaponSprite from '../entities/game-sprite/weapon-sprite';
import { IEntity } from '../interfaces';
import { soundKey } from '../sounds';
import ProjectileSprite from '../entities/game-sprite/projectile-sprite';
import WallSprite from '../entities/game-sprite/wall-sprite';
import Entity from '../entities/entity';
import Agent from '../entities/agent';
import ItemSprite from '../entities/game-sprite/item-sprite';

interface IGameSpriteCreate extends IEntity {
  spriteKey: string;
  soundKey: soundKey;
  projectileKey: string;
  weaponKey: string;
  wallKey: string;
  itemKey: string;

  width: number;
  height: number;
  rotation: number;
  agent: string;
}

export default class GameSpriteFactory {
  create(props: IGameSpriteCreate, entity: Entity) {
    switch (props.spriteKey) {
      case 'agent':
        return new AgentSprite(props, entity as Agent);
      case 'weapon':
        return new WeaponSprite(props);
      case 'projectile':
        return new ProjectileSprite(props);
      case 'wall':
        return new WallSprite(props);
      case 'item':
        return new ItemSprite(props);
      default:
        throw new Error(`Undefined sprite: ${props.spriteKey}`);
    }
  }
}
