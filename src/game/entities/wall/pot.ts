import Wall, { IWall } from '.';

export default class Pot extends Wall {
  constructor(props: IWall) {
    super(props);

    this.maxHp = 200;
    this.hp = 200;
    this.width = 56;
    this.height = 56;

    this.spriteData.wallKey = 'pot';
    this.spriteData.width = 64;
    this.spriteData.height = 64;
  }
}
