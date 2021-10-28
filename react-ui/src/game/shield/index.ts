import Agent from '../entities/agent';
import Projectile from '../entities/projectile';
import { shieldKey } from './shields-map';

export interface IShield {
  agent: Agent;
}

export default class Shield {
  public shieldKey?: shieldKey;
  public duration: number;
  protected agent: Agent;

  constructor(props: IShield) {
    this.agent = props.agent;
    this.duration = 0;
  }

  public onHit(projectile: Projectile) {
    throw new Error('Define in child');
  }
}
