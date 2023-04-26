import * as PIXI from "pixi.js";
import { getUrl } from "../utils/utils";

// Disables the sprite smoothing
PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

interface ITextures {
  [key: string]: PIXI.Texture;
}

const textures: ITextures = {
  // Agents
  char1: PIXI.Texture.from(getUrl("/img/char1.png")),
  char2: PIXI.Texture.from(getUrl("/img/char2.png")),
  char3: PIXI.Texture.from(getUrl("/img/char3.png")),

  // Projectiles
  "projectile-bullet": PIXI.Texture.from(getUrl("/img/projectile-bullet.png")),
  "projectile-power-ball": PIXI.Texture.from(
    getUrl("/img/projectile-power-ball.png")
  ),

  // Weapons
  "weapon-ak47": PIXI.Texture.from(getUrl("/img/weapon-ak47.png")),
  "weapon-shotgun": PIXI.Texture.from(getUrl("/img/weapon-shotgun.png")),
  "weapon-power": PIXI.Texture.from(getUrl("/img/weapon-power.png")),
  "weapon-axe": PIXI.Texture.from(getUrl("/img/weapon-axe.png")),

  // Walls
  pot: PIXI.Texture.from(getUrl("/img/pot.png")),

  // Items
  "item-money": PIXI.Texture.from(getUrl("/img/item-money.png")),

  // Shields
  "shield-projectile-reflector": PIXI.Texture.from(
    getUrl("/img/shield-projectile-reflector.png")
  ),

  // Others
  key: PIXI.Texture.from(getUrl("/img/key.png")),
  tile: PIXI.Texture.from(getUrl("/img/tile.png")),
};

export default textures;
