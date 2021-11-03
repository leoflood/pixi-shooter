import Agent from './entities/agent';
import { levelKey } from './interfaces';
import Weapon from './entities/weapon';
import Eventable from './eventable';
import Level from './level';
import Projectile from './entities/projectile';
import projectilesMap from './entities/projectile/projectiles-map';
import Wall from './entities/wall';
import Vector2D from './utils/vector-2d';
import {
  TRIGGER_ADD_ENTITY,
  TRIGGER_ENEMY_WAVE_START,
  TRIGGER_GAME_FINISH,
  TRIGGER_REMOVE_ENTITY,
  TRIGGER_SHIELD_EFFECT,
} from './game-triggers';
import Item from './entities/item';
import agentsMap, { agentKey } from './entities/agent/agents-map';
import TargetableEntity from './entities/targetable-entity';
import Shield from './shield';

export interface IGame {
  width: number;
  height: number;
  levelKey: levelKey;
}

export default class Game extends Eventable {
  private agents: Map<string, Agent>;
  private projectiles: Projectile[];
  private walls: Wall[];
  public items: Item[];

  private actionQueue: any[];
  private tickerList: any[];

  // Map
  private __width: number;
  private __height: number;
  private __isStopped: boolean;

  // Tick props
  private tickLengthMs: number;
  private previousTickTime: number;
  private actualTicks: number;
  private tickBinded: () => any;

  // Level
  public levelKey: levelKey;
  private level: Level;

  constructor(props: IGame) {
    super();

    this.__width = props.width;
    this.__height = props.height;
    this.__isStopped = false;

    // Length of a tick in milliseconds. The denominator is your desired framerate.
    // e.g. 1000 / 20 = 20 fps,  1000 / 60 = 60 fps
    this.tickLengthMs = 1000 / 60;
    this.previousTickTime = Date.now();
    // Number of times this.tick gets called
    this.actualTicks = 0;
    this.tickBinded = this.tick.bind(this);

    // Entities
    this.agents = new Map();
    this.projectiles = [];
    this.walls = [];
    this.items = [];

    this.actionQueue = [];
    this.tickerList = [];

    // Level
    this.levelKey = props.levelKey;
    this.level = new Level({ levelKey: this.levelKey });
  }

  public get width() {
    return this.__width;
  }

  public get height() {
    return this.__height;
  }

  public start() {
    this.previousTickTime = Date.now();
    this.actualTicks = 0;

    const playerAgent = this.createAgentByKey(
      this.level.levelData.playerAgent,
      new Vector2D(this.width / 2, this.height / 2),
      1,
      'player'
    );

    // Adding the player
    this.addAgent(playerAgent);

    this.trigger(TRIGGER_ENEMY_WAVE_START, [this.level.enemyWave]);

    this.tick();
  }

  public stop() {
    this.__isStopped = true;
  }

  public getAgentByUuid(uuid: string) {
    return this.agents.get(uuid)!;
  }

  public tick() {
    this.update(0);

    const player = this.getAgentByUuid('player');

    if (!this.__isStopped && player && !player.isDead) {
      setTimeout(() => {
        this.tick();
      }, this.tickLengthMs);
    } else {
      this.trigger(TRIGGER_GAME_FINISH, ['You have been defeated']);
    }
  }

  public isOutside(
    x: number,
    y: number,
    marginX: number = 0,
    marginY: number = 0
  ) {
    return (
      x > this.width - marginX ||
      x < marginX ||
      y > this.height - marginY ||
      y < marginY
    );
  }

  public isVectorOutside(vector: Vector2D) {
    return this.isOutside(vector.x, vector.y);
  }

  public getAnyItemTheAgentCanCollect(agent: Agent) {
    return this.items.find((item) => item.canCollect(agent));
  }

  public collectItem(agent: Agent, item: Item) {
    item.onCollect(this, agent);
    this.removeItem(item);
  }

  private update(delta: number) {
    this.projectilesUpdate();

    this.executeActionQueue();
    this.executeTickerList();

    this.agents.forEach((a) => {
      if (!a.isDead) {
        a.think(this);

        this.items.forEach((item) => {
          if (item.checkIfIsCollecting(a)) {
            this.collectItem(a, item);
          }
        });
      }
    });

    // Level loop
    this.level.loop(this);
  }

  private projectilesUpdate() {
    for (let p of this.projectiles) {
      let removed = false;
      p.continueTrajectory(this);

      if (
        // Projectile is outside of the screen
        this.isOutside(p.position.x, p.position.y)
      ) {
        this.removeProjectile(p); // Remove the projectile
        continue;
      }

      for (let agent of this.agents.values()) {
        if (p.team === agent.team) {
          continue;
        }

        if (p.isCollidingWith(agent)) {
          agent.shields.forEach((shield) => {
            shield.onHit(p);
          });

          if (p.onImpact(this, agent)) {
            removed = true;
            break;
          }
        }
      }

      // Bug fix: if the projectile hit an agent and also a wall
      if (removed) {
        continue;
      }

      for (let wall of this.walls) {
        if (p.team === wall.team) {
          continue;
        }

        if (p.isCollidingWith(wall)) {
          if (p.onImpact(this, wall)) {
            removed = true;
            break;
          }
        }
      }
    }
  }

  public addToActionQueue(fn: () => boolean) {
    this.actionQueue.push(fn);
  }

  public indexFromActionQueue(fn: () => boolean) {
    return this.actionQueue.indexOf(fn);
  }

  public removeFromActionQueue(index: number) {
    this.actionQueue.slice(index, 0);
  }

  /**
   * Adds to ticker list a function that will be executed in every tick until returns true
   */
  public addToTickerList(fn: () => boolean) {
    this.tickerList.push(fn);
  }

  private executeActionQueue() {
    if (this.actionQueue.length) {
      while (this.actionQueue.length && this.actionQueue[0]()) {
        this.actionQueue.shift();
      }
    }
  }

  private executeTickerList() {
    const toDelete: any[] = [];
    this.tickerList.forEach((t, i) => {
      if (t()) {
        toDelete.push(i);
      }
    });
    toDelete.forEach((i) => {
      this.tickerList.splice(i, 0);
    });
  }

  public addProjectile(p: Projectile) {
    this.projectiles.push(p);
    this.trigger(TRIGGER_ADD_ENTITY, [p]);
  }

  public removeProjectile(p: Projectile) {
    const index = this.projectiles.indexOf(p);
    if (index > -1) {
      this.projectiles.splice(index, 1);
      this.trigger(TRIGGER_REMOVE_ENTITY, [p]);
    } else {
      throw new Error('Projectile not found');
    }
  }

  public moveAgentTo(agent: Agent, x: number, y: number, speed?: number) {
    let speedToUse = speed ? speed : agent.speed;

    const movement = agent.getMovementTo(x, y, speedToUse);

    const isXOutside = this.isOutside(
      agent.position.x + movement.x,
      agent.position.y,
      agent.width / 2,
      0
    );
    const isYOutside = this.isOutside(
      agent.position.x,
      agent.position.y + movement.y,
      0,
      agent.height / 2
    );

    if (isXOutside) {
      movement.setX(0);
    }
    if (isYOutside) {
      movement.setY(0);
    }
    if (movement.isZero()) {
      return;
    }

    for (let otherAgent of this.agents.values()) {
      if (agent === otherAgent) {
        continue;
      }

      // The player will not collide with his allies
      if (agent.uuid === 'player' && agent.team === otherAgent.team) {
        continue;
      }

      const isXColliding = agent.isCollidingWith(
        otherAgent,
        agent.position.x + movement.x,
        agent.position.y
      );
      const isYColliding = agent.isCollidingWith(
        otherAgent,
        agent.position.x,
        agent.position.y + movement.y
      );

      if (isXColliding) {
        const distanceToAgent1 = agent.getDistance(
          otherAgent.position.x,
          otherAgent.position.y
        );
        const distanceToAgent2 = agent.getDistance(
          otherAgent.position.x,
          otherAgent.position.y,
          movement.x,
          0
        );

        if (distanceToAgent1 < distanceToAgent2) {
          movement.setX(0);
        }
      }
      if (isYColliding) {
        const distanceToAgent1 = agent.getDistance(
          otherAgent.position.x,
          otherAgent.position.y
        );
        const distanceToAgent2 = agent.getDistance(
          otherAgent.position.x,
          otherAgent.position.y,
          0,
          movement.y
        );

        if (distanceToAgent1 < distanceToAgent2) {
          movement.setY(0);
        }
      }
      if (movement.isZero()) {
        return;
      }
    }

    for (let i = 0; i < this.walls.length; i++) {
      const wall = this.walls[i];

      const isXColliding = agent.isCollidingWith(
        wall,
        agent.position.x + movement.x,
        agent.position.y
      );
      const isYColliding = agent.isCollidingWith(
        wall,
        agent.position.x,
        agent.position.y + movement.y
      );

      if (isXColliding) {
        movement.setX(0);
      }
      if (isYColliding) {
        movement.setY(0);
      }
      if (movement.isZero()) {
        return;
      }
    }

    agent.move(movement);
  }

  public addAgent(a: Agent) {
    this.agents.set(a.uuid, a);
    this.trigger(TRIGGER_ADD_ENTITY, [a]);
  }

  public removeAgent(uuid: string) {
    const agent = this.agents.get(uuid);
    this.agents.delete(uuid);
    this.trigger(TRIGGER_REMOVE_ENTITY, [agent!]);
  }

  public addWall(w: Wall) {
    this.walls.push(w);
    this.trigger(TRIGGER_ADD_ENTITY, [w]);
  }

  public removeWall(w: Wall) {
    const index = this.walls.indexOf(w);
    if (index > -1) {
      this.walls.splice(index, 1);
      this.trigger(TRIGGER_REMOVE_ENTITY, [w]);
    } else {
      throw new Error('Wall not found');
    }
  }

  public addItem(i: Item) {
    this.items.push(i);
    this.trigger(TRIGGER_ADD_ENTITY, [i]);
  }

  public removeItem(i: Item) {
    const index = this.items.indexOf(i);
    if (index > -1) {
      this.items.splice(index, 1);
      this.trigger(TRIGGER_REMOVE_ENTITY, [i]);
    } else {
      throw new Error('Item not found');
    }
  }

  public tryToShotTo(agent: Agent, x: number, y: number) {
    // let bulletsInARound = 0;
    // let bulletImprecision = 0;
    // const recoil =
    //  ((Math.random() - 0.5) * Math.min(15, bulletImprecision)) / 5;

    agent.lookAt(x, y);
    agent.getWeapons().forEach((w) => {
      if (w.shoot()) {
        const wRotation = w.getRotationTo(x, y);
        this.shoot(agent, w, wRotation);

        // bulletsInARound++;
        // bulletImprecision++;
      } else if (w.secondsElapsedSinceLastRound > w.secondsDelayOfRound) {
        // bulletsInARound = 0;
        // bulletImprecision = Math.max(0, bulletImprecision / 1.2);
      }
    });
  }

  private shoot(by: Agent, weapon: Weapon, rotation: number) {
    const projectile = this.createProjectileFromWeapon(by, weapon, rotation);
    this.addProjectile(projectile);
    weapon.attack();
    weapon.onShoot(this, by, rotation);
  }

  public hurtAgent(agent: Agent, damage: number, by?: Agent) {
    // Agents cannot get less than 0 hp
    damage = damage > agent.hp ? agent.hp : damage;

    agent.hurt(damage);
    by?.sumToDamageDone(damage);

    if (agent.isDead) {
      agent.onDead(this);
      this.removeAgent(agent.uuid);
    }
  }

  public healAgent(agent: Agent, healing: number) {
    // Agents cannot get more hp than his max hp
    healing =
      agent.hp + healing > agent.maxHp ? agent.maxHp - agent.hp : healing;

    agent.heal(healing);
  }

  public hurtWall(wall: Wall, damage: number) {
    wall.hurt(damage);
    if (wall.isDead) {
      wall.onDead(this);
      this.removeWall(wall);
    }
  }

  public hurtTargetableEntity(
    entity: TargetableEntity,
    damage: number,
    by?: Agent
  ) {
    const hurtFunctionMap: { [x: string]: any } = {
      agent: this.hurtAgent.bind(this),
      wall: this.hurtWall.bind(this),
    };

    hurtFunctionMap[entity.entityType](entity, damage, by);
  }

  public createProjectileFromWeapon(
    by: Agent,
    weapon: Weapon,
    rotation: number
  ) {
    return this.createProjectile(
      by,
      weapon.projectileKey as keyof typeof projectilesMap,
      rotation,
      new Vector2D(weapon.position.x, weapon.position.y)
    );
  }

  public createProjectile(
    by: Agent,
    projectileKey: keyof typeof projectilesMap,
    rotation: number,
    position: Vector2D
  ) {
    return new projectilesMap[projectileKey]({
      by,
      rotation,
      position,
    });
  }

  public getTheCloserEnemyOf(position: Vector2D, team: number) {
    let distance = Number.POSITIVE_INFINITY;
    let closerEnemy: Agent | null = null;

    this.agents.forEach((a) => {
      if (a.team === team || a.isDead) {
        return;
      }

      const distanceToAgent = position.getDistance(a.position);

      if (distanceToAgent < distance) {
        closerEnemy = a;
        distance = distanceToAgent;
      }
    });

    return closerEnemy!;
  }

  public getTheCloserEnemyOfAgent(agent: Agent) {
    return this.getTheCloserEnemyOf(agent.position, agent.team);
  }

  public getAgentsOfTeam(team: number) {
    const agents: Agent[] = [];

    this.agents.forEach((a) => {
      if (a.team === team) {
        agents.push(a);
      }
    });

    return agents;
  }

  public getEnemyAgentsOfTeam(team: number) {
    const agents: Agent[] = [];

    this.agents.forEach((a) => {
      if (a.team !== team) {
        agents.push(a);
      }
    });

    return agents;
  }

  public createAgentByKey(
    agentKey: agentKey,
    position: Vector2D,
    team: number,
    uuid?: string
  ) {
    return new agentsMap[agentKey]({
      team,
      position,
      uuid,
    });
  }

  public addShieldToAgent(agent: Agent, shield: Shield) {
    agent.addShield(shield);
    this.trigger(TRIGGER_SHIELD_EFFECT, [
      {
        shieldKey: shield.shieldKey,
        duration: shield.duration,
        entity: agent,
      },
    ]);

    setTimeout(() => {
      agent.removeShield(shield);
    }, shield.duration * 1000);
  }
}
