
import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { 
  Stars, Float, Sparkles, PerspectiveCamera, 
  Environment, ContactShadows, MeshTransmissionMaterial,
  Cloud, Clouds, Float as FloatDrei
} from '@react-three/drei';
import { WeatherCondition } from '../types';
import * as THREE from 'three';
import gsap from 'gsap';

interface WeatherSceneProps {
  condition: WeatherCondition;
}

const ParticleWeather: React.FC<{ condition: WeatherCondition }> = ({ condition }) => {
  const points = useRef<THREE.Points>(null);
  
  const particleConfig = useMemo(() => {
    switch (condition) {
      case WeatherCondition.RAIN:
        return { count: 1000, size: 0.1, color: '#4488ff', speed: 1.5 };
      case WeatherCondition.SNOW:
        return { count: 1500, size: 0.15, color: '#ffffff', speed: 0.3 };
      case WeatherCondition.THUNDERSTORM:
        return { count: 800, size: 0.1, color: '#8844ff', speed: 2.0 };
      default:
        return { count: 0, size: 0, color: '#ffffff', speed: 0 };
    }
  }, [condition]);

  useFrame((state) => {
    if (!points.current) return;
    const t = state.clock.getElapsedTime();
    if (condition === WeatherCondition.RAIN || condition === WeatherCondition.SNOW) {
      points.current.position.y -= particleConfig.speed * 0.1;
      if (points.current.position.y < -10) points.current.position.y = 10;
    }
    points.current.rotation.y = t * 0.05;
  });

  if (particleConfig.count === 0) return null;

  return (
    <points ref={points}>
      <sphereGeometry args={[15, 32, 32]} />
      <pointsMaterial 
        size={particleConfig.size} 
        color={particleConfig.color} 
        transparent 
        opacity={0.6} 
        sizeAttenuation 
      />
    </points>
  );
};

const WeatherCore: React.FC<{ condition: WeatherCondition }> = ({ condition }) => {
  const group = useRef<THREE.Group>(null);
  const { mouse } = useThree();

  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.getElapsedTime();
    
    // 磁性旋转效果
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, mouse.y * 0.5, 0.1);
    group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, mouse.x * 0.5, 0.1);
  });

  return (
    <group ref={group}>
      <FloatDrei speed={2} rotationIntensity={0.5} floatIntensity={1}>
        {/* 核心折射玻璃球 */}
        <mesh castShadow receiveShadow>
          <sphereGeometry args={[3.2, 64, 64]} />
          <MeshTransmissionMaterial
            backside
            samples={16}
            thickness={1.5}
            chromaticAberration={0.05}
            anisotropy={0.1}
            distortion={0.3}
            distortionScale={0.3}
            temporalDistortion={0.1}
            color={condition === WeatherCondition.CLEAR ? '#ffcc00' : '#ffffff'}
            attenuationDistance={0.5}
            attenuationColor="#ffffff"
            roughness={0.1}
          />
        </mesh>

        {/* 内部大气装饰 */}
        {condition === WeatherCondition.CLOUDS || condition === WeatherCondition.RAIN ? (
          <Clouds material={THREE.MeshBasicMaterial}>
            <Cloud 
              segments={40} 
              bounds={[2, 2, 2]} 
              volume={5} 
              color={condition === WeatherCondition.RAIN ? "#444" : "#ccc"} 
              opacity={0.5}
              fade={10}
            />
          </Clouds>
        ) : null}

        {/* 环绕光环 */}
        <mesh rotation-x={Math.PI / 2}>
          <torusGeometry args={[4.5, 0.01, 16, 100]} />
          <meshBasicMaterial color="#4488ff" transparent opacity={0.2} />
        </mesh>
      </FloatDrei>
    </group>
  );
};

const WeatherScene: React.FC<WeatherSceneProps> = ({ condition }) => {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none opacity-80">
      <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 0, 15], fov: 35 }}>
        <color attach="background" args={['#010206']} />
        
        <fog attach="fog" args={['#010206', 5, 30]} />
        
        <Environment preset="city" />
        
        <WeatherCore condition={condition} />
        <ParticleWeather condition={condition} />
        
        {condition === WeatherCondition.CLEAR && (
          <Stars radius={100} depth={50} count={3000} factor={4} saturation={1} fade speed={1} />
        )}
        
        <Sparkles 
          count={100} 
          scale={15} 
          size={2} 
          speed={0.4} 
          color={condition === WeatherCondition.CLEAR ? "#ffcc00" : "#ffffff"} 
        />

        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={2} color={condition === WeatherCondition.CLEAR ? '#ffaa00' : '#4488ff'} />
        <spotLight position={[-10, 20, 10]} angle={0.12} penumbra={1} intensity={10} castShadow />
        
        <ContactShadows 
          position={[0, -5, 0]} 
          opacity={0.4} 
          scale={20} 
          blur={2.5} 
          far={10} 
          color="#000000"
        />
      </Canvas>
    </div>
  );
};

export default WeatherScene;
