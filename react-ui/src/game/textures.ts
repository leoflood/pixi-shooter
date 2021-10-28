import * as PIXI from 'pixi.js';

// Disables the sprite smoothing
PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

interface ITextures {
  [key: string]: PIXI.Texture;
}

const textures: ITextures = {
  // Agents
  char1: PIXI.Texture.from('/img/char1.png'),
  char2: PIXI.Texture.from('/img/char2.png'),
  char3: PIXI.Texture.from('/img/char3.png'),

  // Projectiles
  'projectile-bullet': PIXI.Texture.from('/img/projectile-bullet.png'),
  'projectile-power-ball': PIXI.Texture.from('/img/projectile-power-ball.png'),

  // Weapons
  'weapon-ak47': PIXI.Texture.from('/img/weapon-ak47.png'),
  'weapon-shotgun': PIXI.Texture.from('/img/weapon-shotgun.png'),
  'weapon-power': PIXI.Texture.from('/img/weapon-power.png'),

  // Walls
  pot: PIXI.Texture.from('/img/pot.png'),

  // Items
  'item-money': PIXI.Texture.from('/img/item-money.png'),

  // Shields
  'shield-projectile-reflector': PIXI.Texture.from(
    '/img/shield-projectile-reflector.png'
  ),

  // Others
  key: PIXI.Texture.from('/img/key.png'),
  tile: PIXI.Texture.from('/img/tile.png'),
};

export default textures;
