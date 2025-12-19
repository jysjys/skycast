
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { WeatherCondition } from '../types';

interface Props {
  condition: WeatherCondition;
}

const AtmosphericEffects: React.FC<Props> = ({ condition }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const ctx = gsap.context(() => {
      const container = containerRef.current!;
      container.innerHTML = '';

      switch (condition) {
        case WeatherCondition.RAIN:
        case WeatherCondition.THUNDERSTORM:
          createNeuralRain(container);
          break;
        case WeatherCondition.CLEAR:
          createSolarFlares(container);
          break;
        case WeatherCondition.SNOW:
          createCrystalFlakes(container);
          break;
        case WeatherCondition.CLOUDS:
        case WeatherCondition.MIST:
          createVaporStreams(container);
          break;
      }
    }, containerRef);

    return () => ctx.revert();
  }, [condition]);

  const createNeuralRain = (parent: HTMLDivElement) => {
    // 增加雨丝数量，但大幅减细并降低模糊，提升清晰度
    for (let i = 0; i < 100; i++) {
      const drop = document.createElement('div');
      // 移除模糊，使用极细的半透明线段
      drop.className = 'absolute bg-gradient-to-b from-blue-400/0 via-blue-400/30 to-blue-400/0 w-[0.5px] h-[120px]';
      parent.appendChild(drop);
      gsap.set(drop, { x: Math.random() * window.innerWidth, y: -200, opacity: Math.random() * 0.5 });
      gsap.to(drop, {
        y: window.innerHeight + 200,
        duration: 0.3 + Math.random() * 0.3,
        repeat: -1,
        delay: Math.random() * 2,
        ease: 'none'
      });
    }
    if (condition === WeatherCondition.THUNDERSTORM) {
      const flash = document.createElement('div');
      flash.className = 'absolute inset-0 bg-blue-100/[0.03] opacity-0 pointer-events-none';
      parent.appendChild(flash);
      gsap.to(flash, {
        opacity: 1,
        duration: 0.1,
        repeat: -1,
        repeatDelay: () => 4 + Math.random() * 8,
        yoyo: true,
        onRepeat: () => {
          gsap.set(flash, { x: (Math.random() - 0.5) * 400 });
        }
      });
    }
  };

  const createSolarFlares = (parent: HTMLDivElement) => {
    for (let i = 0; i < 4; i++) {
      const flare = document.createElement('div');
      // 降低 blur 数值，防止边缘像素化
      flare.className = 'absolute bg-amber-500/[0.04] rounded-full blur-[80px]';
      const size = 300 + Math.random() * 500;
      gsap.set(flare, { 
        width: size, 
        height: size, 
        x: Math.random() * window.innerWidth, 
        y: Math.random() * window.innerHeight 
      });
      parent.appendChild(flare);
      gsap.to(flare, {
        scale: 1.3,
        duration: 8 + Math.random() * 10,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });
    }
  };

  const createCrystalFlakes = (parent: HTMLDivElement) => {
    for (let i = 0; i < 100; i++) {
      const flake = document.createElement('div');
      // 雪花边缘更锐利
      flake.className = 'absolute bg-white/25 rounded-full';
      const size = 2 + Math.random() * 3;
      gsap.set(flake, { 
        width: size, 
        height: size, 
        x: Math.random() * window.innerWidth, 
        y: -50 
      });
      parent.appendChild(flake);
      gsap.to(flake, {
        y: window.innerHeight + 50,
        x: `+=${Math.random() * 150 - 75}`,
        rotate: 360,
        duration: 10 + Math.random() * 15,
        repeat: -1,
        delay: Math.random() * 10,
        ease: 'none'
      });
    }
  };

  const createVaporStreams = (parent: HTMLDivElement) => {
    for (let i = 0; i < 8; i++) {
      const vapor = document.createElement('div');
      // 云雾背景使用低频移动，低模糊度
      vapor.className = 'absolute bg-white/[0.02] rounded-full blur-[60px]';
      const w = 500 + Math.random() * 700;
      const h = 150 + Math.random() * 300;
      gsap.set(vapor, { 
        width: w, 
        height: h, 
        x: -w, 
        y: Math.random() * window.innerHeight 
      });
      parent.appendChild(vapor);
      gsap.to(vapor, {
        x: window.innerWidth + w,
        duration: 50 + Math.random() * 50,
        repeat: -1,
        ease: 'none',
        delay: Math.random() * 20
      });
    }
  };

  return <div ref={containerRef} className="fixed inset-0 pointer-events-none z-0 overflow-hidden" />;
};

export default AtmosphericEffects;
