export default class Vector2D {
  private __x: number;
  private __y: number;

  constructor(x: number, y: number) {
    this.__x = x;
    this.__y = y;
  }

  public get x() {
    return this.__x;
  }

  public get y() {
    return this.__y;
  }

  public setX(x: number) {
    this.__x = x;
  }

  public setY(y: number) {
    this.__y = y;
  }

  /**
   * Suma a Point (X and Y) to direction object
   */
  public sum(direction: Vector2D) {
    this.__x += direction.x;
    this.__y += direction.y;
  }

  public scaleBy(i: number) {
    this.__x *= i;
    this.__y *= i;
  }

  public clone(offSetX: number = 0, offSetY: number = 0) {
    return new Vector2D(this.x + offSetX, this.y + offSetY);
  }

  /**
   * Gets orthogonal vector
   */
  public getOrthogonal(rightSide: boolean) {
    return new Vector2D(
      rightSide ? this.y : -this.y,
      rightSide ? -this.x : this.x
    );
  }

  public normalize() {
    const tmpX = this.x;
    const tmpY = this.y;

    if (tmpX !== 0 || tmpY !== 0) {
      const length = Math.sqrt(tmpX * tmpX + tmpY * tmpY);
      this.__x = tmpX / length;
      this.__y = tmpY / length;
    } else if (tmpY === 0 && tmpX === 0) {
      this.__x = 0;
      this.__y = 0;
    } else if (tmpX === 0) {
      this.__x = 0;
      this.__y = tmpY > 0 ? 1 : -1;
    } else if (tmpY === 0) {
      this.__x = tmpX > 0 ? 1 : -1;
      this.__y = 0;
    }
  }

  public isZero() {
    return this.x === 0 && this.y === 0;
  }

  public getDistance(to: Vector2D, sumX = 0, sumY = 0) {
    let y0 = to.x - this.x + sumX;
    let x0 = to.y - this.y + sumY;

    return Math.sqrt(x0 * x0 + y0 * y0);
  }
}
