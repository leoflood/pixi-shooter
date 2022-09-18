import * as PIXI from 'pixi.js';

export const redFilter = (() => {
  const color = new PIXI.filters.ColorMatrixFilter();

  const tint = 0xe73b37;
  const r = (tint >> 16) & 0xff;
  const g = (tint >> 8) & 0xff;
  const b = tint & 0xff;
  color.matrix[0] = r / 255;
  color.matrix[6] = g / 255;
  color.matrix[12] = b / 255;

  return color;
})();

export const greenFilter = (() => {
  const color = new PIXI.filters.ColorMatrixFilter();

  const tint = 0x65d93b;
  const r = (tint >> 16) & 0xff;
  const g = (tint >> 8) & 0xff;
  const b = tint & 0xff;
  color.matrix[0] = r / 255;
  color.matrix[6] = g / 255;
  color.matrix[12] = b / 255;

  return color;
})();

export const createWhiteFilter = () => {
  const color = new PIXI.filters.ColorMatrixFilter();
  color.matrix = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
  return color;
};

export const createBlackFilter = () => {
  const color = new PIXI.filters.ColorMatrixFilter();
  color.matrix = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  return color;
};
