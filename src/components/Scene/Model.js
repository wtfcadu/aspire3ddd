import React, { useRef, useState, useEffect, useMemo } from 'react'
import { MeshTransmissionMaterial, useGLTF, Text, shaderMaterial } from "@react-three/drei";
import { useFrame, useThree, extend } from '@react-three/fiber'
import * as THREE from 'three'

// Create a custom shader material for the radial green gradient
const RadialGradientMaterial = shaderMaterial(
  {
    centerColor: new THREE.Color('#439a43'),  // Darker green in center
    edgeColor: new THREE.Color('#73d846'),    // Brighter green at edges
    aspectRatio: 1.0,                         // Will be set based on screen size
    gradientScale: 11                         // Fixed gradient scale (higher = smaller gradient)
  },
  // Vertex shader
  `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // Fragment shader
  `
    uniform vec3 centerColor;
    uniform vec3 edgeColor;
    uniform float aspectRatio;
    uniform float gradientScale;
    varying vec2 vUv;
    
    void main() {
      // Create normalized coordinates (-1 to 1) with aspect ratio correction
      vec2 centeredUv = vec2(vUv.x - 0.5, (vUv.y - 0.5) * aspectRatio);
      float dist = length(centeredUv) * gradientScale; // Higher value = smaller gradient
      
      // Create a smooth radial gradient from center to edge
      vec3 color = mix(centerColor, edgeColor, smoothstep(0.0, 1.0, dist));
      
      gl_FragColor = vec4(color, 1.0);
    }
  `
)

// Extend Three.js with our custom material
extend({ RadialGradientMaterial })

export default function Model() {
    const { nodes } = useGLTF("/medias/torrus.glb");
    const { viewport, size, mouse } = useThree();
    const torus = useRef(null);
    const backgroundRef = useRef(null);
    const objectGroup = useRef(null);
    
    // Initial rotation values - exactly as requested
    const initialRotation = useRef({
        x: 4.8,
        y: 0.2,
        z: 0
    });
    
    // Text settings
    const [lineSpacing, setLineSpacing] = useState(0.8); // Adjust this value to change spacing
    
    // Calculate aspect ratio for the gradient
    const aspectRatio = useMemo(() => {
        return size.height / size.width;
    }, [size.width, size.height]);
    
    // Fixed gradient scale value
    const gradientScale = 11;
    
    // Mouse interaction states
    const [hovered, setHovered] = useState(false);
    const [clicked, setClicked] = useState(false);
    
    // Initialize rotation to match set values
    useEffect(() => {
        if (objectGroup.current) {
            objectGroup.current.rotation.x = initialRotation.current.x;
            objectGroup.current.rotation.y = initialRotation.current.y;
            objectGroup.current.rotation.z = initialRotation.current.z;
        }
        
        if (torus.current) {
            // Reset the mesh rotation to the identity since we'll handle rotation at the group level
            torus.current.rotation.set(0, 0, 0);
        }
    }, []);
    
    // Handle cursor appearance
    useEffect(() => {
        document.body.style.cursor = hovered ? 'pointer' : 'auto';
        return () => {
            document.body.style.cursor = 'auto';
        };
    }, [hovered]);
    
    // Listen for key presses to adjust line spacing only
    useEffect(() => {
        const handleKeyDown = (e) => {
            // Press 'ArrowUp' to increase line spacing
            if (e.key === 'ArrowUp') {
                setLineSpacing(prev => Math.min(prev + 0.1, 2));
            }
            // Press 'ArrowDown' to decrease line spacing
            else if (e.key === 'ArrowDown') {
                setLineSpacing(prev => Math.max(prev - 0.1, 0.5));
            }
        };
        
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);
    
    // Track previous mouse position for z-axis rotation
    const prevMouse = useRef({ x: 0, y: 0 });
    const mouseOffset = useRef({ x: 0, y: 0 });
    
    useFrame((state, delta) => {
        // Automatic rotation (slower when interacted with)
        if (torus.current) {
            torus.current.rotation.z += clicked ? 0.005 : 0.02;
        }
        
        // Mouse interaction for the 3D object only (x, y, and z axes)
        if (objectGroup.current) {
            // Calculate mouse movement delta for z rotation
            const deltaX = mouse.x - prevMouse.current.x;
            const deltaY = mouse.y - prevMouse.current.y;
            
            // Update mouse offset
            mouseOffset.current.x = THREE.MathUtils.lerp(
                mouseOffset.current.x, 
                mouse.x * Math.PI / 10, 
                0.05
            );
            
            mouseOffset.current.y = THREE.MathUtils.lerp(
                mouseOffset.current.y, 
                mouse.y * Math.PI / 10, 
                0.05
            );
            
            // Apply rotation while preserving initial values
            objectGroup.current.rotation.x = initialRotation.current.x + mouseOffset.current.y;
            objectGroup.current.rotation.y = initialRotation.current.y + mouseOffset.current.x;
            
            // Add subtle z-axis rotation based on mouse movement
            const zRotationFactor = 0.1; // Adjust this value to control z-rotation intensity
            const combinedDelta = Math.sqrt(deltaX * deltaX + deltaY * deltaY) * Math.sign(deltaX + deltaY);
            
            if (!clicked) {
                objectGroup.current.rotation.z = initialRotation.current.z + THREE.MathUtils.lerp(
                    objectGroup.current.rotation.z - initialRotation.current.z,
                    (objectGroup.current.rotation.z - initialRotation.current.z) + (combinedDelta * zRotationFactor),
                    0.1
                );
            }
            
            // Store current mouse position for next frame
            prevMouse.current.x = mouse.x;
            prevMouse.current.y = mouse.y;
        }
        
        // Keep background at correct scale to fill viewport
        if (backgroundRef.current) {
            const aspectRatio = size.width / size.height;
            const scale = Math.max(viewport.width, viewport.height * aspectRatio) * 100.2;
            backgroundRef.current.scale.set(scale, scale / aspectRatio, 8);
        }
    });
    
    return (
        <group scale={viewport.width / 300} >
            {/* Background plane with radial gradient */}
            <mesh 
                ref={backgroundRef} 
                position={[0, 0, -3]}
                scale={[viewport.width * 2, viewport.height * 2, 1]}
            >
                <planeGeometry />
                <radialGradientMaterial 
                    centerColor="#23870E" 
                    edgeColor="#5BBA57" 
                    aspectRatio={aspectRatio}
                    gradientScale={gradientScale}
                />
            </mesh>
            
            {/* Text is not interactive */}
            <Text 
                font={'/fonts/NotoSerifDisplay-ExtraCondensedMedium.ttf'} 
                position={[0, 0, -1]} 
                fontSize={20} 
                color="black" 
                anchorX="center" 
                anchorY="middle"
                textAlign="center"
                lineHeight={lineSpacing}
            >
                {"EMPOWER\nGLOBAL\nINNOVATION"}
            </Text>
            
            {/* Only the 3D object is interactive - with the exact rotation requested */}
            <group ref={objectGroup} position={[0, 0, 20]} rotation={[4.8, 0.2, 0]}>
                <mesh 
                    ref={torus} 
                    {...nodes.Cone001} 
                    onPointerOver={() => setHovered(true)}
                    onPointerOut={() => setHovered(false)}
                    onPointerDown={() => setClicked(true)}
                    onPointerUp={() => setClicked(false)}
                    onClick={(e) => {
                        e.stopPropagation();
                        // Add a slight "push" effect on click
                        if (torus.current) {
                            torus.current.position.z += 0.5;
                            setTimeout(() => {
                                torus.current.position.z -= 0.5;
                            }, 150);
                        }
                    }}
                >
                    <MeshTransmissionMaterial 
                        thickness={3.0}
                        roughness={0.1}
                        transmission={1.0}
                        ior={2.0}
                        chromaticAberration={1.0}
                        backside={true}
                        distort={1.0}
                        temporalDistortion={0.1}
                    />
                </mesh>
            </group>
        </group>
    )
}
