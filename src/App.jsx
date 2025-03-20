import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import { Suspense } from 'react';
import { easing } from 'maath';

const CakeModel = ({ modelPath, scale, position = [0, 0, 0] }) => {
    const { scene } = useGLTF(modelPath);
    const modelRef = useRef();
    const targetRotation = useRef({ x: 0, y: 0 });

    useFrame((state, delta) => {
        if (modelRef.current) {
            const { x, y } = state.mouse;
            targetRotation.current.y = x * Math.PI; // Set target rotation
            targetRotation.current.x = -y * Math.PI * 0.05; // Smooth vertical movement

            // Smooth interpolation for rotation (delayed effect)
            easing.damp(modelRef.current.rotation, 'y', targetRotation.current.y, 0.2, delta);
            easing.damp(modelRef.current.rotation, 'x', targetRotation.current.x, 0.2, delta);
        }
    });

    return (
        <primitive
            ref={modelRef}
            object={scene}
            scale={scale}
            position={position} // Use custom position or default [0,0,0]
        />
    );
};

const CakeCanvas = ({ modelPath, scale, position }) => {
    return (
        <div className="w-full h-80">
            <Canvas style={{ height: '350px', width: '100%' }} camera={{ position: [0, 3, 7], fov: 45 }}>
                <Suspense fallback={null}>
                    <ambientLight intensity={3} />
                    <directionalLight position={[2, 5, 3]} intensity={3} color={"#ffffff"} />
                    <spotLight position={[5, 10, 5]} angle={0.4} intensity={3} castShadow color={"#ffddaa"} />
                    <pointLight position={[-3, 3, 3]} intensity={2} color={"#ffffff"} />
                    <CakeModel modelPath={modelPath} scale={scale} position={position} />
                </Suspense>
                <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
            </Canvas>
        </div>
    );
};

const App = () => {
    // Custom scales & positions for each cake
    const cakeModels = [
        { path: '/chocolate_cake.glb', scale: 2, position: [0, 0, 0] },
        { path: '/carrot_cake.glb', scale: 20, position: [0, 0, 0] },
        { path: '/cheese_cake_with_frosting.glb', scale: 30, position: [0, 0, 0] },
        { path: '/red_velvet_cake.glb', scale: 2.6, position: [0, 0, 0] },
        { path: '/sliced_cake.glb', scale: 35, position: [0, 0, 0] },
        { path: '/strawberry_cake.glb', scale: 3.3, position: [0, 5, 0] },
        { path: '/chocolatecake.glb', scale: 1.3, position: [0, -1, 0] },
        { path: '/RedVelvet.glb', scale: 1.3, position: [0, -1, 0] },
        { path: '/SuperHeroCake.glb', scale: 4, position: [0, -1, 0] }
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4">
            {cakeModels.map((model, index) => (
                <CakeCanvas key={index} modelPath={model.path} scale={model.scale} position={model.position} />
            ))}
        </div>
    );
};

export default App;
