type XYZ = {
  x: number;
  y: number;
  z: number;
};

export type TransformationType = 'rotation' | 'scale' | 'translation';

export type TransformationValues = XYZ;

export type Coords = [number, number, number];

export type Surface = [Coords, Coords, Coords];

export type RGBA = [number, number, number, number];

export interface Normal {
  x: number;
  y: number;
  z: number;
  magnitude: number;
}

export type MatrixRow = [number, number, number, number];

export type MatrixValues = [MatrixRow, MatrixRow, MatrixRow, MatrixRow];
