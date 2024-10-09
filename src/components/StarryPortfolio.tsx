import { useRef, useState, useMemo } from "react";
import { Canvas, useFrame, ThreeElements, extend } from "@react-three/fiber";
import { OrbitControls, Text, shaderMaterial } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";

const GlowMaterial = shaderMaterial(
  { color: new THREE.Color(1, 1, 1) },
  // vertex shader
  `
    varying vec3 vNormal;
    void main() {
      vNormal = normalize(normalMatrix * normal);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // fragment shader
  `
    uniform vec3 color;
    varying vec3 vNormal;
    void main() {
      float intensity = pow(0.7 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
      gl_FragColor = vec4(color, 1.0) * intensity;
    }
  `
);

extend({ GlowMaterial });

// New HoverableText component
function HoverableText({
  position,
  fontSize,
  color,
  hoverColor,
  anchorX,
  anchorY,
  rotation = [0, 0, 0],
  onClick,
  children,
}: {
  position: [number, number, number];
  fontSize: number;
  color: string;
  hoverColor: string;
  anchorX: string;
  anchorY: string;
  rotation?: [number, number, number];
  onClick: () => void;
  children: React.ReactNode;
}) {
  const [hovered, setHover] = useState(false);

  return (
    <Text
      position={position}
      fontSize={fontSize}
      color={hovered ? hoverColor : color}
      anchorX={
        typeof anchorX === "string"
          ? (anchorX as "left" | "center" | "right")
          : anchorX
      }
      anchorY={
        typeof anchorY === "string"
          ? (anchorY as "left" | "center" | "right")
          : anchorY
      }
      rotation={rotation}
      onPointerOver={() => setHover(true)}
      onPointerOut={() => setHover(false)}
      onClick={onClick}
    >
      {children}
    </Text>
  );
}

function Box(
  props: ThreeElements["mesh"] & { setActiveSection: (section: string) => void }
) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const glowRef = useRef<THREE.Mesh>(null!);

  useFrame((_, delta) => {
    meshRef.current.rotation.x += delta * 0.2;
    meshRef.current.rotation.y += delta * 0.2;
    glowRef.current.rotation.x += delta * 0.2;
    glowRef.current.rotation.y += delta * 0.2;
  });

  const colors = useMemo(
    () => ["#FFFFFF", "#FFFFFF", "#FFFFFF", "#FFFFFF", "#FFFFFF", "#FFFFFF"],
    []
  );

  return (
    <group>
      <mesh {...props} ref={meshRef}>
        <boxGeometry args={[4, 4, 4]} />
        {colors.map((color, index) => (
          <meshStandardMaterial
            key={index}
            color={color}
            attach={`material-${index}`}
          />
        ))}
        <HoverableText
          position={[0, 0, 3]} // Front Face
          fontSize={0.7}
          color="#00BDCE"
          hoverColor="#00BDCE"
          anchorX="center"
          anchorY="middle"
          onClick={() => props.setActiveSection("")}
        >
          Suu portfolio
        </HoverableText>
        <HoverableText
          position={[3, 0, 0]} // Right Face
          fontSize={0.9}
          color="black"
          hoverColor="#0056EB"
          anchorX="center"
          anchorY="middle"
          rotation={[0, Math.PI / 2, 0]}
          onClick={() => props.setActiveSection("Github")}
        >
          Github
        </HoverableText>
        <HoverableText
          position={[0, 3, 0]} // Top Face
          fontSize={0.9}
          color="black"
          hoverColor="#146C8D"
          anchorX="center"
          anchorY="middle"
          rotation={[-Math.PI / 2, 0, 0]}
          onClick={() => props.setActiveSection("Contact")}
        >
          Contact
        </HoverableText>
        <HoverableText
          position={[-3, 0, 0]} // Left Face
          fontSize={0.7}
          color="black"
          hoverColor="#3068A8"
          anchorX="center"
          anchorY="middle"
          rotation={[0, -Math.PI / 2, 0]}
          onClick={() => props.setActiveSection("")}
        >
          Make a Wish!
        </HoverableText>
        <HoverableText
          position={[0, -3, 0]}
          fontSize={0.7}
          color="black"
          hoverColor="#3567BF"
          anchorX="center"
          anchorY="middle"
          rotation={[Math.PI / 2, 0, 0]}
          onClick={() => props.setActiveSection("Donate")}
        >
          Donate me!
        </HoverableText>
        <HoverableText
          position={[0, 0, -3]} // Back Face
          fontSize={0.9} // Changed from 0 to 0.8
          color="black"
          hoverColor="#1F80FF"
          anchorX="center"
          anchorY="middle"
          rotation={[0, Math.PI, 0]} // Adjusted rotation for better visibility
          onClick={() => props.setActiveSection("About")}
        >
          About
        </HoverableText>
      </mesh>
      <mesh ref={glowRef} scale={1.2}>
        <boxGeometry args={[4, 4, 4]} />
      </mesh>
    </group>
  );
}

function Stars() {
  const starsRef = useRef<THREE.Points>(null!);
  const [starPositions] = useState(() => {
    const positions = new Float32Array(5000 * 3);
    for (let i = 0; i < 5000; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 100;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 100;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 100;
    }
    return positions;
  });

  useFrame((_, delta) => {
    starsRef.current.rotation.x += delta * 0.01;
    starsRef.current.rotation.y += delta * 0.01;
  });

  return (
    <points ref={starsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={starPositions.length / 3}
          array={starPositions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.1} color="white" sizeAttenuation />
    </points>
  );
}

function Modal({
  activeSection,
  setActiveSection,
}: {
  activeSection: string;
  setActiveSection: (section: string) => void;
}) {
  if (!activeSection) return null;

  const content = {
    About:
      "こんにちは！私はSuuです。\n小さな島国から来ました。\n縁あって日本で生活し、2019年からフロントエンドエンジニアとして働き始めました。\n他の詳細は私のポートフォリオに隠されています。\n気に入っていただけると嬉しいです！",
    Github: "Check out my latest projects,\nincluding this 3D portfolio!",
    Contact: "Get in touch with me at\nexample@email.com",
    Donate: "Donate me!",
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-10">
      <div className="bg-white bg-opacity-80 h-80 w-full p-8 text-slate-800 rounded-lg max-w-2xl flex flex-col justify-between">
        <h2 className="text-4xl font-bold mb-4 text-cyan-500">
          {activeSection}
        </h2>
        <p className="whitespace-pre-line">
          {content[activeSection as keyof typeof content]}
        </p>
        <div className="flex justify-center mt-6">
          <button
            className="text-slate-300 hover:text-slate-500 hover:transition-all hover:duration-500"
            onClick={() => setActiveSection("")}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default function StarryPortfolio() {
  const [activeSection, setActiveSection] = useState("");

  return (
    <div className="w-full h-screen">
      <Canvas camera={{ position: [0, 0, 10] }}>
        <color attach="background" args={["black"]} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <Box position={[0, 0, 0]} setActiveSection={setActiveSection} />
        <Stars />
        <OrbitControls enableZoom={false} />
        <EffectComposer>
          <Bloom luminanceThreshold={0} luminanceSmoothing={0.9} height={300} />
        </EffectComposer>
      </Canvas>
      <Modal
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />
    </div>
  );
}
