export interface Rectangle {
  x: number;
  y: number;
  baseWidth: number;
  baseHeight: number;
  phase: number;
  speed: number;
  hueOffset: number;
  saturation: number;
  brightness: number;
  brownianX: number;
  brownianY: number;
  targetBrownianX: number;
  targetBrownianY: number;
  lastBrownianUpdate: number;
  widthPhase: number;
  heightPhase: number;
  widthFreq: number;
  heightFreq: number;
}

export interface Quote {
  id: number;
  text: string;
  category?: string;
}