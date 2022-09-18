import TargetableEntity, { ITargetableEntity } from '../targetable-entity';

export interface IWall extends ITargetableEntity {}

export default class Wall extends TargetableEntity {
  public hp: number;

  constructor(props: IWall) {
    super(props);
    this.hp = 1;

    this.width = 64;
    this.height = 64;

    this.spriteData = {
      spriteKey: 'wall',
      wallKey: '', // Define in child
      width: this.width,
      height: this.height,
      position: this.position.clone(),
      rotation: 0,
    };
  }

  public get entityType() {
    return 'wall';
  }
}
