import { ProjectileBullet, ProjectilePowerBall } from './projectiles';

const projectilesMap = {
  'projectile-bullet': ProjectileBullet,
  'projectile-power-ball': ProjectilePowerBall,
};

export type projectileKey = keyof typeof projectilesMap;

export default projectilesMap;
