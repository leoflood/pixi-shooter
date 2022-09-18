import * as PIXI from "pixi.js";

// Disables the sprite smoothing
PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

interface ITextures {
  [key: string]: PIXI.Texture;
}

const textures: ITextures = {
  // Agents
  char1: PIXI.Texture.from("/pixi-shooter/img/char1.png"),
  char2: PIXI.Texture.from("/pixi-shooter/img/char2.png"),
  char3: PIXI.Texture.from("/pixi-shooter/img/char3.png"),

  // Projectiles
  "projectile-bullet": PIXI.Texture.from(
    "/pixi-shooter/img/projectile-bullet.png"
  ),
  "projectile-power-ball": PIXI.Texture.from(
    "/pixi-shooter/img/projectile-power-ball.png"
  ),

  // Weapons
  "weapon-ak47": PIXI.Texture.from("/pixi-shooter/img/weapon-ak47.png"),
  "weapon-shotgun": PIXI.Texture.from("/pixi-shooter/img/weapon-shotgun.png"),
  "weapon-power": PIXI.Texture.from("/pixi-shooter/img/weapon-power.png"),

  // Walls
  pot: PIXI.Texture.from("/pixi-shooter/img/pot.png"),

  // Items
  "item-money": PIXI.Texture.from("/pixi-shooter/img/item-money.png"),

  // Shields
  "shield-projectile-reflector": PIXI.Texture.from(
    "/pixi-shooter/img/shield-projectile-reflector.png"
  ),

  // Others
  key: PIXI.Texture.from("/pixi-shooter/img/key.png"),
  tile: PIXI.Texture.from("/pixi-shooter/img/tile.png"),
};

export default textures;
