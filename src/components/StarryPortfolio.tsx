import { useRef, useState, useMemo, useEffect } from "react";
import { Canvas, useFrame, ThreeElements, extend } from "@react-three/fiber";
import { OrbitControls, Text, shaderMaterial } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";
import { motion, AnimatePresence } from "framer-motion";

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
      anchorX={anchorX as "left" | "center" | "right"}
      anchorY={
        anchorY as
          | "top"
          | "bottom"
          | "top-baseline"
          | "middle"
          | "bottom-baseline"
          | number
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
  props: ThreeElements["mesh"] & {
    setActiveSection: (section: string) => void;
    triggerMeteor: () => void;
    meteorActive: boolean;
  }
) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const glowRef = useRef<THREE.Mesh>(null!);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < 768;
      setScale(isMobile ? 0.7 : 1);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

  const boxSize = 4;

  return (
    <group scale={[scale, scale, scale]}>
      <mesh {...props} ref={meshRef}>
        <boxGeometry args={[boxSize, boxSize, boxSize]} />
        {colors.map((color, index) => (
          <meshStandardMaterial
            key={index}
            color={color}
            attach={`material-${index}`}
          />
        ))}
        <HoverableText
          position={[0, 0, boxSize / 2.05 + 0.5]}
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
          position={[boxSize / 2.05 + 0.5, 0, 0]}
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
          position={[0, boxSize / 2.05 + 0.5, 0]}
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
          position={[0, 0, -boxSize / 2.05 - 0.5]}
          fontSize={0.7}
          color={props.meteorActive ? "gray" : "black"}
          hoverColor={props.meteorActive ? "gray" : "#3068A8"}
          anchorX="center"
          anchorY="middle"
          rotation={[0, Math.PI, 0]}
          onClick={() => {
            if (!props.meteorActive) {
              props.triggerMeteor();
              props.setActiveSection("");
            }
          }}
        >
          Make a Wish!
        </HoverableText>
        <HoverableText
          position={[boxSize / 2.05 + 0.5, 0, 0]}
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
          position={[0, -boxSize / 2.05 - 0.5, 0]}
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
          position={[-boxSize / 2.05 - 0.5, 0, 0]}
          fontSize={0.9}
          color="black"
          hoverColor="#1F80FF"
          anchorX="center"
          anchorY="middle"
          rotation={[0, -Math.PI / 2, 0]}
          onClick={() => props.setActiveSection("About")}
        >
          About
        </HoverableText>
      </mesh>
      <mesh ref={glowRef} scale={1.2}>
        <boxGeometry args={[boxSize, boxSize, boxSize]} />
      </mesh>
    </group>
  );
}

function Stars() {
  const starsRef = useRef<THREE.Points>(null!);
  const [starPositions] = useState(() => {
    const positions = new Float32Array(10000 * 3);
    const colors = new Float32Array(10000 * 3);
    const sizes = new Float32Array(10000);
    for (let i = 0; i < 10000; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 100;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 100;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 100;

      const color = new THREE.Color();
      color.setHSL(Math.random(), 0.7, 0.9);
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;

      sizes[i] = Math.random() * 0.5 + 0.1;
    }
    return { positions, colors, sizes };
  });

  useFrame((state, delta) => {
    starsRef.current.rotation.x += delta * 0.01;
    starsRef.current.rotation.y += delta * 0.01;

    const time = state.clock.getElapsedTime();
    const sizes = starsRef.current.geometry.attributes.size.array;
    for (let i = 0; i < sizes.length; i++) {
      sizes[i] = Math.sin(time + i * 100) * 0.2 + 0.3;
    }
    starsRef.current.geometry.attributes.size.needsUpdate = true;
  });

  return (
    <points ref={starsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={starPositions.positions.length / 3}
          array={starPositions.positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={starPositions.colors.length / 3}
          array={starPositions.colors}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={starPositions.sizes.length}
          array={starPositions.sizes}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.1}
        vertexColors
        transparent
        blending={THREE.AdditiveBlending}
        sizeAttenuation
      />
    </points>
  );
}
function Meteor({ active }: { active: boolean }) {
  const meteorRef = useRef<THREE.Mesh>(null!);
  const [position, setPosition] = useState(
    () => new THREE.Vector3(50, 25, -10)
  );
  const [trail, setTrail] = useState<THREE.Vector3[]>([]);
  const [heat, setHeat] = useState(0);

  useEffect(() => {
    if (!active) {
      setPosition(new THREE.Vector3(50, 25, -10));
      setTrail([]);
      setHeat(0);
    }
  }, [active]);

  useFrame((_, delta) => {
    if (active && meteorRef.current) {
      meteorRef.current.position.x -= delta * 30;
      meteorRef.current.position.y -= delta * 15;

      // Simulate heating up
      setHeat(Math.min(1, heat + delta * 20));

      setTrail((prevTrail) => {
        const newTrail = [...prevTrail, meteorRef.current.position.clone()];
        if (newTrail.length > 30) {
          newTrail.shift();
        }
        return newTrail;
      });
    }
  });

  return active ? (
    <group>
      <mesh ref={meteorRef} position={position}>
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshStandardMaterial
          color={new THREE.Color(1, 1 - heat, 1 - heat)}
          emissive={new THREE.Color(1, 0.6, 0)}
          emissiveIntensity={heat * 2}
        />
      </mesh>
      <pointLight
        position={meteorRef.current ? meteorRef.current.position : [0, 0, 0]}
        intensity={2 * heat}
        distance={10}
        color="#FFA500"
      />
      {trail
        .slice()
        .reverse()
        .map((pos, index) => (
          <mesh key={index} position={pos}>
            <sphereGeometry
              args={[0.4 * Math.pow(1 - index / trail.length, 2), 16, 16]}
            />
            <meshStandardMaterial
              color="#FFFFFF"
              transparent
              opacity={0.8 * (1 - index / trail.length)}
              emissive="#CF0808"
              emissiveIntensity={0.5 * (1 - index / trail.length)}
            />
          </mesh>
        ))}
    </group>
  ) : null;
}

function Modal({
  activeSection,
  setActiveSection,
}: {
  activeSection: string;
  setActiveSection: (section: string) => void;
}) {
  const [isVisible, setIsVisible] = useState(false);
  const [language, setLanguage] = useState<"en" | "jp">("en");

  useEffect(() => {
    if (activeSection) {
      setIsVisible(true);
    }
  }, [activeSection]);

  const content = {
    About: {
      en: "Hello! I'm Suu.\nI come from a small island country.\nBy chance, I started living in Japan and began working as a front-end engineer in 2019.\nOther details are hidden in my portfolio.\nI hope you like it!",
      jp: "こんにちは！私はSuuです。\n小さな島国から来ました。\n縁あって日本で生活し、2019年からフロントエンドエンジニアとして働き始めました。\n他の詳細は私のポートフォリオに隠されています。\n気に入っていただけると嬉しいです！",
    },
    Github: {
      en: "Check out my latest projects,\nincluding this 3D portfolio!",
      jp: "この3Dポートフォリオを含む\n最新のプロジェクトをチェックしてください！",
    },
    Contact: {
      en: "Get in touch with me at\nsuu0205p@gmail.com",
      jp: "suu0205p@gmail.com\nでご連絡ください",
    },
    Donate: {
      en: "Your support helps me continue creating and improving projects like this one.\nThank you for your generosity!",
      jp: "あなたのサポートは、このようなプロジェクトの作成と改善を続けるのに役立ちます。\nご支援ありがとうございます！",
    },
  };

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => setActiveSection(""), 300);
  };

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "en" ? "jp" : "en"));
  };

  const handleSendEmail = () => {
    window.location.href = "mailto:suu0205p@gmail.com";
  };

  const handleGithubLink = () => {
    window.open("https://github.com/suu03", "_blank");
  };

  const handleDonation = () => {
    window.open("https://example.com/donate", "_blank");
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="fixed inset-0 flex items-center justify-center z-10"
        >
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 3 }}
            exit={{ y: 50, opacity: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="bg-white bg-opacity-80 backdrop-blur-md w-full max-w-2xl p-8 rounded-lg shadow-2xl"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-4xl font-bold text-cyan-500">
                {activeSection}
              </h2>
              <button
                onClick={toggleLanguage}
                className="w-10 h-10 focus:outline-none"
              >
                <img
                  src={
                    language === "en"
                      ? "/japanese_icon.svg"
                      : "/english_icon.svg"
                  }
                  alt={
                    language === "en"
                      ? "Switch to Japanese"
                      : "Switch to English"
                  }
                  className="w-full h-full"
                />
              </button>
            </div>
            <p className="whitespace-pre-line text-lg text-slate-700 mb-6">
              {content[activeSection as keyof typeof content][language]}
            </p>
            {activeSection === "Contact" && (
              <div className="flex justify-center mb-6">
                <button
                  onClick={handleSendEmail}
                  className="focus:outline-none opacity-70 hover:opacity-100 transition-opacity duration-300"
                >
                  <img src="/send.svg" alt="Send Email" className="w-12 h-12" />
                </button>
              </div>
            )}
            {activeSection === "Github" && (
              <div className="flex justify-center mb-6">
                <button
                  onClick={handleGithubLink}
                  className="focus:outline-none opacity-70 hover:opacity-100 transition-opacity duration-300"
                >
                  <img
                    src="/github.svg"
                    alt="Visit GitHub"
                    className="w-12 h-12"
                  />
                </button>
              </div>
            )}
            {activeSection === "Donate" && (
              <div className="flex justify-center mb-6">
                <button
                  onClick={handleDonation}
                  className="focus:outline-none opacity-70 hover:opacity-100 transition-opacity duration-300"
                >
                  <img src="/donate.svg" alt="Donate" className="w-12 h-12" />
                </button>
              </div>
            )}
            <div className="flex justify-end">
              <button
                className="px-4 py-2 text-slate-800 hover:text-cyan-500 transition-colors duration-300"
                onClick={handleClose}
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function StarryPortfolio() {
  const [activeSection, setActiveSection] = useState("");
  const [meteorActive, setMeteorActive] = useState(false);

  const triggerMeteor = () => {
    if (!meteorActive) {
      setMeteorActive(true);
      setTimeout(() => setMeteorActive(false), 5000);
    }
  };

  return (
    <div className="w-full h-screen">
      <Canvas camera={{ position: [0, 0, 10] }}>
        <color attach="background" args={["black"]} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <Box
          position={[0, 0, 0]}
          setActiveSection={setActiveSection}
          triggerMeteor={triggerMeteor}
          meteorActive={meteorActive}
        />
        <Stars />
        <Meteor active={meteorActive} />
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
