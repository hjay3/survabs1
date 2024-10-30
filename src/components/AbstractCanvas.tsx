import React, { useEffect, useRef } from 'react';
import { Rectangle } from '../types/types';

interface AbstractCanvasProps {
  onAnimationChange: () => void;
}

const ANIMATION_INTERVAL = 15000;

class RectangleClass implements Rectangle {
  constructor(width: number, height: number) {
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    this.baseWidth = Math.random() * 300 + 200; // Increased size
    this.baseHeight = Math.random() * 300 + 200;
    this.phase = Math.random() * Math.PI * 2;
    this.speed = 0.001 + Math.random() * 0.002;
    this.hueOffset = Math.random() * 360;
    this.saturation = 80 + Math.random() * 20; // Increased saturation
    this.brightness = 50 + Math.random() * 30; // Increased brightness
    this.brownianX = 0;
    this.brownianY = 0;
    this.targetBrownianX = 0;
    this.targetBrownianY = 0;
    this.lastBrownianUpdate = 0;
    this.widthPhase = Math.random() * Math.PI * 2;
    this.heightPhase = Math.random() * Math.PI * 2;
    this.widthFreq = 0.0005 + Math.random() * 0.001;
    this.heightFreq = 0.0007 + Math.random() * 0.001;
  }

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

  reset(width: number, height: number): void {
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    this.baseWidth = Math.random() * 300 + 200;
    this.baseHeight = Math.random() * 300 + 200;
    this.phase = Math.random() * Math.PI * 2;
  }

  updateBrownian(time: number): void {
    if (time - this.lastBrownianUpdate > 1000) {
      this.targetBrownianX = (Math.random() - 0.5) * 150; // Increased movement
      this.targetBrownianY = (Math.random() - 0.5) * 150;
      this.lastBrownianUpdate = time;
    }

    this.brownianX += (this.targetBrownianX - this.brownianX) * 0.02; // Faster movement
    this.brownianY += (this.targetBrownianY - this.brownianY) * 0.02;
  }

  draw(ctx: CanvasRenderingContext2D, time: number): void {
    this.updateBrownian(time);

    const widthScale = Math.sin(time * this.widthFreq + this.widthPhase) * 0.4 + 0.6;
    const heightScale = Math.sin(time * this.heightFreq + this.heightPhase) * 0.4 + 0.6;
    const baseScale = Math.sin(time * this.speed + this.phase) * 0.2 + 0.8;
    
    const currentWidth = this.baseWidth * widthScale * baseScale;
    const currentHeight = this.baseHeight * heightScale * baseScale;

    const hue = (time * 0.05 + this.hueOffset) % 360; // Faster color changes
    
    // Main glow
    const gradient = ctx.createRadialGradient(
      this.x + this.brownianX, this.y + this.brownianY, 0,
      this.x + this.brownianX, this.y + this.brownianY, currentWidth
    );
    
    gradient.addColorStop(0, `hsla(${hue}, ${this.saturation}%, ${this.brightness + 30}%, 0.7)`);
    gradient.addColorStop(0.5, `hsla(${(hue + 30) % 360}, ${this.saturation}%, ${this.brightness + 20}%, 0.5)`);
    gradient.addColorStop(1, `hsla(${(hue + 60) % 360}, ${this.saturation}%, ${this.brightness}%, 0.2)`);

    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    
    // Draw main shape
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.ellipse(
      this.x + this.brownianX,
      this.y + this.brownianY,
      currentWidth / 2,
      currentHeight / 2,
      time * 0.0002, // Faster rotation
      0, Math.PI * 2
    );
    ctx.fill();

    // Light streaks
    const streakGradient = ctx.createLinearGradient(
      this.x - currentWidth, this.y - currentHeight,
      this.x + currentWidth, this.y + currentHeight
    );
    streakGradient.addColorStop(0, `hsla(${hue}, 100%, 80%, 0)`);
    streakGradient.addColorStop(0.5, `hsla(${hue}, 100%, 80%, 0.4)`);
    streakGradient.addColorStop(1, `hsla(${hue}, 100%, 80%, 0)`);

    ctx.fillStyle = streakGradient;
    ctx.rotate(Math.sin(time * 0.001) * Math.PI / 3);
    ctx.fillRect(
      this.x - currentWidth * 1.5,
      this.y - currentHeight / 6,
      currentWidth * 3,
      currentHeight / 3
    );

    // Additional crossing light streak
    ctx.rotate(Math.PI / 2);
    ctx.fillRect(
      this.x - currentWidth * 1.5,
      this.y - currentHeight / 8,
      currentWidth * 3,
      currentHeight / 4
    );
    
    ctx.restore();
  }
}

export const AbstractCanvas: React.FC<AbstractCanvasProps> = ({ onAnimationChange }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rectanglesRef = useRef<RectangleClass[]>([]);
  const animationFrameRef = useRef<number>();
  const lastAnimationChangeRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const initializeRectangles = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      rectanglesRef.current = Array.from(
        { length: 10 }, // Increased number of rectangles
        () => new RectangleClass(canvas.width, canvas.height)
      );
    };

    const draw = (timestamp: number) => {
      if (timestamp - lastAnimationChangeRef.current > ANIMATION_INTERVAL) {
        lastAnimationChangeRef.current = timestamp;
        onAnimationChange();
        rectanglesRef.current.forEach(rect => 
          rect.reset(canvas.width, canvas.height)
        );
      }

      // Darker fade for better visibility
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      rectanglesRef.current.forEach(rect => rect.draw(ctx, timestamp));
      animationFrameRef.current = requestAnimationFrame(draw);
    };

    const handleResize = () => {
      initializeRectangles();
    };

    initializeRectangles();
    window.addEventListener('resize', handleResize);
    animationFrameRef.current = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [onAnimationChange]);

  return <canvas ref={canvasRef} className="fixed inset-0 -z-10" />;
};