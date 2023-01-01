import * as PIXI from "pixi.js";
import { Shake } from "pixi-game-camera";

import Keyboard from "./keyboard";
import Pointer from "./pointer";
import Game from "./game";
import Entity from "./entities/entity";
import GameSpriteFactory from "./factory/game-sprite-factory";
import sounds from "./sounds";
import Skill from "./skill";
import { levelKey } from "./interfaces";
import { degreesToRadians, getRandomFromArray } from "./utils";
import textures from "./textures";
import { Joystick } from "pixi-virtual-joystick";
import {
  TRIGGER_ADD_ENTITY,
  TRIGGER_ENEMY_WAVE_START,
  TRIGGER_GAME_FINISH,
  TRIGGER_REMOVE_ENTITY,
  TRIGGER_SKILL_EXECUTED,
  TRIGGER_UPDATE_ENTITY_SPRITE,
  TRIGGER_SHIELD_EFFECT,
} from "./game-triggers";
import { getUserData, setUserData } from "../utils/local-storage";
import levels from "./levels.json";
import Agent from "./entities/agent";
import { PLAYER_ID } from "./constants";

export function startGame(
  levelKey: levelKey,
  isTouch: boolean,
  onGameEnd: () => any
) {
  const levelData = levels[levelKey];

  // Play the level music
  const music = sounds[levelData.music];
  music.play();

  const SCREEN_WIDTH = 1280;
  const SCREEN_HEIGHT = 720;

  const deviceConfigs = {
    desktop: {
      joystickScale: 1,
      joystickMargin: 64,
      skillSize: 48,
      textSize: 32,
      strokeTextSize: 4,
      hudBorderMargin: 384,
    },
    touch: {
      joystickScale: 1.5,
      joystickMargin: 128,
      skillSize: 96,
      textSize: 64,
      strokeTextSize: 8,
      hudBorderMargin: 344,
    },
  };

  const deviceConfig = deviceConfigs[isTouch ? "touch" : "desktop"];

  // ---------------------------------------------------------- //

  const app = new PIXI.Application({
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  });
  const canvasContainer = document.querySelector(".Game");
  // Adding the app to the DOM
  canvasContainer!.appendChild(app.view);
  const stage = app.stage;
  stage.sortableChildren = true;

  // ---------------------- Player Skills --------------------- //
  const skillsContainer = new PIXI.Container();
  skillsContainer.zIndex = 9999;
  stage.addChild(skillsContainer);
  let playerSkills: any[];
  function fetchPlayerSkills(pl: Agent) {
    const playerSkillsToFetch = [
      {
        keyText: "Q",
        keyCode: 81,
        sprite: (() => {
          // Q key

          const sprite = new PIXI.Sprite(textures.key);
          // change the sprite's size
          sprite.width = deviceConfig.skillSize;
          sprite.height = deviceConfig.skillSize;
          // center the sprite's anchor point
          sprite.anchor.x = 0.5;
          sprite.anchor.y = 0.5;
          sprite.interactive = true;

          const text = new PIXI.Text("Q", {
            fontFamily: "Arial",
            fontSize: 56,
            fill: 0x000000,
            align: "center",
          });
          text.anchor.x = 0.5;
          text.anchor.y = 0.5;
          sprite.addChild(text);

          return text;
        })(),
      },
      {
        keyText: "E",
        keyCode: 69,
        sprite: (() => {
          // E key

          const sprite = new PIXI.Sprite(textures.key);
          // change the sprite's size
          sprite.width = deviceConfig.skillSize;
          sprite.height = deviceConfig.skillSize;
          // center the sprite's anchor point
          sprite.anchor.x = 0.5;
          sprite.anchor.y = 0.5;
          sprite.interactive = true;

          const text = new PIXI.Text("E", {
            fontFamily: "Arial",
            fontSize: 56,
            fill: 0x000000,
            align: "center",
          });
          text.anchor.x = 0.5;
          text.anchor.y = 0.5;
          sprite.addChild(text);

          return text;
        })(),
      },
      {
        keyText: "R",
        keyCode: 82,
        sprite: (() => {
          // R key

          const sprite = new PIXI.Sprite(textures.key);
          // change the sprite's size
          sprite.width = deviceConfig.skillSize;
          sprite.height = deviceConfig.skillSize;
          // center the sprite's anchor point
          sprite.anchor.x = 0.5;
          sprite.anchor.y = 0.5;
          sprite.interactive = true;

          const text = new PIXI.Text("R", {
            fontFamily: "Arial",
            fontSize: 56,
            fill: 0x000000,
            align: "center",
          });
          text.anchor.x = 0.5;
          text.anchor.y = 0.5;
          sprite.addChild(text);

          return text;
        })(),
      },
      {
        keyText: "T",
        keyCode: 84,
        sprite: (() => {
          // R key

          const sprite = new PIXI.Sprite(textures.key);
          // change the sprite's size
          sprite.width = deviceConfig.skillSize;
          sprite.height = deviceConfig.skillSize;
          // center the sprite's anchor point
          sprite.anchor.x = 0.5;
          sprite.anchor.y = 0.5;
          sprite.interactive = true;

          const text = new PIXI.Text("T", {
            fontFamily: "Arial",
            fontSize: 56,
            fill: 0x000000,
            align: "center",
          });
          text.anchor.x = 0.5;
          text.anchor.y = 0.5;
          sprite.addChild(text);

          return text;
        })(),
      },
    ];
    playerSkills = playerSkillsToFetch; // Reset player skills ui config

    // Removes older skills if exist
    for (let i = 0; i < skillsContainer.children.length; i++) {
      const skillToDestroy = skillsContainer.children[i];
      skillToDestroy.destroy();
    }

    // Puts the player skills
    for (let i = 0; i < pl.skills.length; i++) {
      const sprite = playerSkills[i].sprite.parent;

      sprite.position.x =
        SCREEN_WIDTH -
        (deviceConfig.skillSize + 8) * (playerSkills.length - 1 - i) -
        deviceConfig.hudBorderMargin;
      sprite.position.y = SCREEN_HEIGHT - deviceConfig.skillSize / 1.5;

      skillsContainer.addChild(sprite);

      sprite.on("pointerdown", () => {
        pl.skills[i].tryToExecute(game);
      });
    }
  }
  // ---------------------------------------------------------- //

  const gameSpriteFactory = new GameSpriteFactory();

  const titleTextStyle = new PIXI.TextStyle({
    dropShadow: true,
    fill: "white",
    fontSize: deviceConfig.textSize,
    fontVariant: "small-caps",
    fontWeight: "bold",
    lineJoin: "round",
    strokeThickness: deviceConfig.strokeTextSize,
  });

  const hpTextStyle = new PIXI.TextStyle({
    dropShadow: true,
    fill: "yellow",
    fontSize: deviceConfig.textSize,
    fontVariant: "small-caps",
    fontWeight: "bold",
    lineJoin: "round",
    strokeThickness: deviceConfig.strokeTextSize,
  });

  // ---------------------------- GAME ------------------------------ //

  const game = new Game({
    width: SCREEN_WIDTH + 150,
    height: SCREEN_HEIGHT + 150,
    levelKey,
  });
  let player: Agent;

  game.on(TRIGGER_ADD_ENTITY, (entity: Entity) => {
    entity.forEach((e) => {
      // If a new player has added, we will update the player reference
      if (e.uuid === PLAYER_ID) {
        player = game.getAgentByUuid(PLAYER_ID);
        fetchPlayerSkills(player);
      }

      if (e.spriteData) {
        const gameSprite = gameSpriteFactory.create(e.spriteData, e);

        gameSprite.forEach((s) => {
          if (s.sprite) {
            background.addChild(s.sprite);
          }
        });

        e.addEntity(gameSprite);
      }

      if (e.spawnSoundsKey && Math.random() < e.spawnSoundChance) {
        sounds[getRandomFromArray(e.spawnSoundsKey)].play();
      }
    });
  });

  game.on(TRIGGER_REMOVE_ENTITY, (entity: Entity) => {
    entity.forEach((e) => {
      if (e.sprite) {
        background.removeChild(e.sprite);
      }
    });
  });

  game.on(TRIGGER_SKILL_EXECUTED, (skill: Skill) => {
    if (skill.effectKey) {
      switch (skill.effectKey) {
        case "shake": {
          const shakeEffect = new Shake(background, 20, skill.effectDuration!);
          shakeEffect.start();
          break;
        }
        default: {
          throw new Error(`Effect invalid: ${skill.effectKey}`);
        }
      }
    }

    // Skill sound
    const skillSound = sounds[skill.soundKey!];
    if (skillSound) {
      skillSound.play();
    }
  });

  game.on(TRIGGER_SHIELD_EFFECT, (props) => {
    const texture = textures[props.shieldKey];
    const sprite = new PIXI.Sprite(texture);
    // change the sprite's size
    sprite.width = 128;
    sprite.height = 128;
    sprite.scale.x = 1;
    sprite.scale.y = 1;
    // center the sprite's anchor point
    sprite.anchor.x = 0.5;
    sprite.anchor.y = 0.5;

    props.entity.forEach((e: any) => {
      if (e.sprite) {
        e.sprite.addChild(sprite);

        setTimeout(() => {
          e.sprite.removeChild(sprite);
        }, props.duration * 1000);
      }
    });
  });

  game.on(TRIGGER_ENEMY_WAVE_START, (wave: number) => {
    const text = new PIXI.Text(`Wave ${wave + 1}`, titleTextStyle);
    text.anchor.x = 0.5;
    text.anchor.y = 0.5;
    text.position.x = SCREEN_WIDTH / 2;
    text.position.y = SCREEN_HEIGHT / 2 - 128;
    text.zIndex = 9999;

    stage.addChild(text);

    setTimeout(() => {
      stage.removeChild(text);
    }, 2000);
  });

  game.on(TRIGGER_GAME_FINISH, (message: string) => {
    const text = new PIXI.Text(message, titleTextStyle);
    text.anchor.x = 0.5;
    text.anchor.y = 0.5;
    text.position.x = SCREEN_WIDTH / 2;
    text.position.y = SCREEN_HEIGHT / 2 - 128;
    text.zIndex = 9999;

    stage.addChild(text);

    setTimeout(() => {
      if (!player.isDead) {
        const userData = getUserData(); // Get the user data
        userData.lastLevelFinished =
          userData.lastLevelFinished < levelData.levelOrder
            ? // If the last level finished is less than this level order,
              //set this level order as the last finished
              levelData.levelOrder
            : // If not, change nothing
              userData.lastLevelFinished;
        setUserData(userData); // Save the user data
      }

      // End callback
      onGameEnd();
      // Stop and destroy all game
      music.stop();
      game.stop();
      app.stop();
    }, 5000);
  });
  game.on(TRIGGER_UPDATE_ENTITY_SPRITE, (entity: Entity, props: object) => {
    entity.forEach((e) => {
      if (e.sprite) {
        Object.assign(e.sprite, props);
      }
    });
  });

  // ---------------------------------------------------------- //

  const backgroundContainer = new PIXI.Graphics();
  backgroundContainer.beginFill(0x444444); //0x4b7d32
  backgroundContainer.drawRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
  backgroundContainer.endFill();
  backgroundContainer.interactive = true;
  stage.addChild(backgroundContainer);

  // ---------------------------------------------------------- //

  const background = new PIXI.Graphics();
  background.beginFill(0x777777); //0x4b7d32
  background.drawRect(0, 0, game.width, game.height);
  background.endFill();
  background.sortableChildren = true;
  backgroundContainer.addChild(background);

  // ---------------------------------------------------------- //

  const tilingSprite = new PIXI.TilingSprite(
    textures.tile,
    game.width,
    game.height
  );
  background.addChild(tilingSprite);

  // ---------------------------------------------------------- //

  game.start();
  player = game.getAgentByUuid("player");

  // ---------------------------------------------------------- //

  const hpText = new PIXI.Text(String(player.hp >> 0), hpTextStyle);
  hpText.position.x = 8 + deviceConfig.hudBorderMargin;
  hpText.position.y = SCREEN_HEIGHT - deviceConfig.textSize * 1.5;
  hpText.zIndex = 9999;
  stage.addChild(hpText);

  const keyboard = new Keyboard();
  const pointer = new Pointer(backgroundContainer);

  const joystickData = {
    x: 0,
    y: 0,
    power: 0,
  };
  const joystick = new Joystick({
    outerScale: {
      x: deviceConfig.joystickScale,
      y: deviceConfig.joystickScale,
    },
    innerScale: {
      x: deviceConfig.joystickScale,
      y: deviceConfig.joystickScale,
    },

    onChange: (data) => {
      // console.log(data.angle); // Angle from 0 to 360
      // console.log(data.direction); // 'left', 'top', 'bottom', 'right', 'top_left', 'top_right', 'bottom_left' or 'bottom_right'.
      // console.log(data.power); // Power from 0 to 1

      const radians = degreesToRadians(data.angle);

      const x = Math.cos(radians);
      const y = -Math.sin(radians);

      joystickData.x = x;
      joystickData.y = y;
      joystickData.power = data.power;
    },

    onStart: () => {},

    onEnd: () => {
      joystickData.x = 0;
      joystickData.y = 0;
    },
  });
  joystick.position.x = deviceConfig.joystickMargin;
  joystick.position.y = SCREEN_HEIGHT - deviceConfig.joystickMargin;
  if (isTouch) {
    stage.addChild(joystick);
  }

  const attackJoystickData = {
    x: 0,
    y: 0,
  };
  const attackJoystick = new Joystick({
    outerScale: {
      x: deviceConfig.joystickScale,
      y: deviceConfig.joystickScale,
    },
    innerScale: {
      x: deviceConfig.joystickScale,
      y: deviceConfig.joystickScale,
    },

    onChange: (data) => {
      const radians = degreesToRadians(data.angle);

      const x = Math.cos(radians);
      const y = -Math.sin(radians);

      attackJoystickData.x = x;
      attackJoystickData.y = y;
    },

    onStart: () => {},

    onEnd: () => {
      attackJoystickData.x = 0;
      attackJoystickData.y = 0;
    },
  });
  attackJoystick.position.x = SCREEN_WIDTH - deviceConfig.joystickMargin;
  attackJoystick.position.y = SCREEN_HEIGHT - deviceConfig.joystickMargin;
  if (isTouch) {
    stage.addChild(attackJoystick);
  }

  const camera = {
    x: 0,
    y: 0,
  };

  // Tell our application's ticker to run a new callback every frame, passing
  // in the amount of time that has passed since the last tick
  app.ticker.add((delta) => {
    camera.x = -player.position.x + SCREEN_WIDTH / 2;
    camera.y = -player.position.y + SCREEN_HEIGHT / 2;

    const pointerX = pointer.point.x;
    const pointerY = pointer.point.y;

    // Movements
    let xMovOffset = 0;
    let yMoveOffset = 0;
    if (keyboard.isPressed(83)) {
      // S key
      yMoveOffset += player.speed;
    }
    if (keyboard.isPressed(87)) {
      // W key
      yMoveOffset -= player.speed;
    }
    if (keyboard.isPressed(68)) {
      // D key
      xMovOffset += player.speed;
    }
    if (keyboard.isPressed(65)) {
      // A key
      xMovOffset -= player.speed;
    }
    if (xMovOffset !== 0 || yMoveOffset !== 0) {
      game.addToActionQueue(() => {
        game.moveAgentTo(
          player,
          player.position.x + xMovOffset,
          player.position.y + yMoveOffset
        );
        return true;
      });
    } else if (joystickData.x !== 0 || joystickData.y !== 0) {
      game.addToActionQueue(() => {
        game.moveAgentTo(
          player,
          player.position.x +
            joystickData.x * (joystickData.power * player.speed),
          player.position.y +
            joystickData.y * (joystickData.power * player.speed)
        );
        return true;
      });
    }

    if (!isTouch && pointer.isPressed()) {
      game.addToActionQueue(() => {
        // Shoots
        game.tryToShotTo(player, pointerX - camera.x, pointerY - camera.y);
        return true;
      });
    } else if (attackJoystickData.x !== 0 || attackJoystickData.y !== 0) {
      game.addToActionQueue(() => {
        // Shoots
        game.tryToShotTo(
          player,
          player.position.x + attackJoystickData.x * player.width * 10,
          player.position.y + attackJoystickData.y * player.height * 10
        );
        return true;
      });
    }

    player.skills.forEach((skill, i) => {
      const skillButtonData = playerSkills[i];

      if (keyboard.isPressed(skillButtonData.keyCode)) {
        // Q key
        game.addToActionQueue(() => {
          skill.tryToExecute(game);
          return true;
        });
      }

      skillButtonData.sprite.text = skill.secondsToNextRound
        ? String(skill.secondsToNextRound)
        : skillButtonData.keyText;
    });

    hpText.text = String(player.hp >> 0);
    background.position.x = camera.x;
    background.position.y = camera.y;
  });
}
