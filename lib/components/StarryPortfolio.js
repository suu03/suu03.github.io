"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = StarryPortfolio;
const react_1 = __importStar(require("react"));
const fiber_1 = require("@react-three/fiber");
const drei_1 = require("@react-three/drei");
const postprocessing_1 = require("@react-three/postprocessing");
const THREE = __importStar(require("three"));
const framer_motion_1 = require("framer-motion");
const GlowMaterial = (0, drei_1.shaderMaterial)({ color: new THREE.Color(1, 1, 1) }, 
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
  `);
(0, fiber_1.extend)({ GlowMaterial });
function HoverableText({ position, fontSize, color, hoverColor, anchorX, anchorY, rotation = [0, 0, 0], onClick, children, }) {
    const [hovered, setHover] = (0, react_1.useState)(false);
    return (react_1.default.createElement(drei_1.Text, { position: position, fontSize: fontSize, color: hovered ? hoverColor : color, anchorX: anchorX, anchorY: anchorY, rotation: rotation, onPointerOver: () => setHover(true), onPointerOut: () => setHover(false), onClick: onClick }, children));
}
function Box(props) {
    const meshRef = (0, react_1.useRef)(null);
    const glowRef = (0, react_1.useRef)(null);
    const [scale, setScale] = (0, react_1.useState)(1);
    (0, react_1.useEffect)(() => {
        const handleResize = () => {
            const isMobile = window.innerWidth < 768;
            setScale(isMobile ? 0.7 : 1);
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);
    (0, fiber_1.useFrame)((_, delta) => {
        meshRef.current.rotation.x += delta * 0.2;
        meshRef.current.rotation.y += delta * 0.2;
        glowRef.current.rotation.x += delta * 0.2;
        glowRef.current.rotation.y += delta * 0.2;
    });
    const colors = (0, react_1.useMemo)(() => ["#FFFFFF", "#FFFFFF", "#FFFFFF", "#FFFFFF", "#FFFFFF", "#FFFFFF"], []);
    const boxSize = 4;
    return (react_1.default.createElement("group", { scale: [scale, scale, scale] },
        react_1.default.createElement("mesh", { ...props, ref: meshRef },
            react_1.default.createElement("boxGeometry", { args: [boxSize, boxSize, boxSize] }),
            colors.map((color, index) => (react_1.default.createElement("meshStandardMaterial", { key: index, color: color, attach: `material-${index}` }))),
            react_1.default.createElement(HoverableText, { position: [0, 0, boxSize / 2 + 0.5], fontSize: 0.7, color: "#00AEE1", hoverColor: "#00AEE1", anchorX: "center", anchorY: "middle", onClick: () => props.setActiveSection("") }, "Suu portfolio"),
            react_1.default.createElement(HoverableText, { position: [0, boxSize / 2 + 0.63, 0], fontSize: 0.8, color: "black", hoverColor: "#146C8D", anchorX: "center", anchorY: "middle", rotation: [-Math.PI / 2, 0, 0], onClick: () => props.setActiveSection("Contact") }, "Contact"),
            react_1.default.createElement(HoverableText, { position: [0, 0, -boxSize / 2 - 0.62], fontSize: 0.65, color: props.meteorActive ? "gray" : "black", hoverColor: props.meteorActive ? "gray" : "#3068A8", anchorX: "center", anchorY: "middle", rotation: [0, Math.PI, 0], onClick: () => {
                    if (!props.meteorActive) {
                        props.triggerMeteor();
                        props.setActiveSection("");
                    }
                } }, "Make a Wish!"),
            react_1.default.createElement(HoverableText, { position: [boxSize / 2 + 0.6, 0, 0], fontSize: 0.85, color: "black", hoverColor: "#0056EB", anchorX: "center", anchorY: "middle", rotation: [0, Math.PI / 2, 0], onClick: () => props.setActiveSection("Github") }, "Github"),
            react_1.default.createElement(HoverableText, { position: [0, -boxSize / 2 - 0.63, 0], fontSize: 0.65, color: "black", hoverColor: "#3567BF", anchorX: "center", anchorY: "middle", rotation: [Math.PI / 2, 0, 0], onClick: () => props.setActiveSection("Donate") }, "Donate me!"),
            react_1.default.createElement(HoverableText, { position: [-boxSize / 2 - 0.6, 0, 0], fontSize: 0.9, color: "black", hoverColor: "#1F80FF", anchorX: "center", anchorY: "middle", rotation: [0, -Math.PI / 2, 0], onClick: () => props.setActiveSection("About") }, "About")),
        react_1.default.createElement("mesh", { ref: glowRef, scale: 1.2 },
            react_1.default.createElement("boxGeometry", { args: [boxSize, boxSize, boxSize] }))));
}
function Stars() {
    const starsRef = (0, react_1.useRef)(null);
    const [starPositions] = (0, react_1.useState)(() => {
        const positions = new Float32Array(15000 * 3);
        const colors = new Float32Array(15000 * 3);
        const sizes = new Float32Array(15000);
        for (let i = 0; i < 15000; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 100;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 100;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 100;
            const color = new THREE.Color();
            color.setHSL(Math.random(), 1, 0.9);
            colors[i * 3] = color.r;
            colors[i * 3 + 1] = color.g;
            colors[i * 3 + 2] = color.b;
            sizes[i] = Math.random() * 0.8 + 0.2;
        }
        return { positions, colors, sizes };
    });
    const starTexture = (0, react_1.useMemo)(() => {
        const canvas = document.createElement("canvas");
        canvas.width = 128;
        canvas.height = 128;
        const ctx = canvas.getContext("2d");
        const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
        gradient.addColorStop(0, "rgba(255,255,255,1)");
        gradient.addColorStop(0.2, "rgba(255,255,255,0.8)");
        gradient.addColorStop(0.4, "rgba(255,255,255,0.5)");
        gradient.addColorStop(0.6, "rgba(255,255,255,0.3)");
        gradient.addColorStop(1, "rgba(255,255,255,0)");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 128, 128);
        return new THREE.CanvasTexture(canvas);
    }, []);
    (0, fiber_1.useFrame)((state, delta) => {
        starsRef.current.rotation.x += delta * 0.005;
        starsRef.current.rotation.y += delta * 0.005;
        const time = state.clock.getElapsedTime();
        const sizes = starsRef.current.geometry.attributes.size.array;
        for (let i = 0; i < sizes.length; i++) {
            sizes[i] =
                (Math.sin(time + i * 100) * 0.5 + 1.5) * starPositions.sizes[i];
        }
        starsRef.current.geometry.attributes.size.needsUpdate = true;
    });
    return (react_1.default.createElement("points", { ref: starsRef },
        react_1.default.createElement("bufferGeometry", null,
            react_1.default.createElement("bufferAttribute", { attach: "attributes-position", count: starPositions.positions.length / 3, array: starPositions.positions, itemSize: 3 }),
            react_1.default.createElement("bufferAttribute", { attach: "attributes-color", count: starPositions.colors.length / 3, array: starPositions.colors, itemSize: 3 }),
            react_1.default.createElement("bufferAttribute", { attach: "attributes-size", count: starPositions.sizes.length, array: starPositions.sizes, itemSize: 1 })),
        react_1.default.createElement("pointsMaterial", { size: 0.3, vertexColors: true, transparent: true, blending: THREE.AdditiveBlending, sizeAttenuation: true, map: starTexture, alphaTest: 0.001, depthWrite: false })));
}
function Meteor({ active }) {
    const meteorRef = (0, react_1.useRef)(null);
    const [position, setPosition] = (0, react_1.useState)(() => new THREE.Vector3(50, 25, -10));
    const [trail, setTrail] = (0, react_1.useState)([]);
    const [heat, setHeat] = (0, react_1.useState)(0);
    (0, react_1.useEffect)(() => {
        if (!active) {
            setPosition(new THREE.Vector3(50, 25, -10));
            setTrail([]);
            setHeat(0);
        }
    }, [active]);
    (0, fiber_1.useFrame)((_, delta) => {
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
    return active ? (react_1.default.createElement("group", null,
        react_1.default.createElement("mesh", { ref: meteorRef, position: position },
            react_1.default.createElement("sphereGeometry", { args: [0.3, 32, 32] }),
            react_1.default.createElement("meshStandardMaterial", { color: new THREE.Color(1, 1 - heat, 1 - heat), emissive: new THREE.Color(3, 0.6, 0), emissiveIntensity: heat * 2 })),
        react_1.default.createElement("pointLight", { position: meteorRef.current ? meteorRef.current.position : [0, 0, 0], intensity: 1 * heat, distance: 10, color: "#fff719" }),
        trail
            .slice()
            .reverse()
            .map((pos, index) => (react_1.default.createElement("mesh", { key: index, position: pos },
            react_1.default.createElement("sphereGeometry", { args: [0.4 * Math.pow(1 - index / trail.length, 2), 16, 16] }),
            react_1.default.createElement("meshStandardMaterial", { color: "#f77511", transparent: true, opacity: 0.8 * (1 - index / trail.length), emissive: "#f77511", emissiveIntensity: 0.5 * (1 - index / trail.length) })))))) : null;
}
function Modal({ activeSection, setActiveSection, }) {
    const [isVisible, setIsVisible] = (0, react_1.useState)(false);
    const [language, setLanguage] = (0, react_1.useState)("en");
    (0, react_1.useEffect)(() => {
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
        window.open("https://donate.stripe.com/test_aEU7uS89m0Itb605kk", "_blank");
    };
    return (react_1.default.createElement(framer_motion_1.AnimatePresence, null, isVisible && (react_1.default.createElement(framer_motion_1.motion.div, { initial: { opacity: 0, scale: 0.8 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 0.8 }, transition: { duration: 0.3, ease: "easeInOut" }, className: "fixed inset-0 flex items-center justify-center z-10" },
        react_1.default.createElement(framer_motion_1.motion.div, { initial: { y: 50, opacity: 0 }, animate: { y: 0, opacity: 1 }, exit: { y: 50, opacity: 0 }, transition: { delay: 0.3, duration: 0.5 }, className: "bg-white bg-opacity-80 backdrop-blur-md w-full max-w-2xl p-8 rounded-lg shadow-2xl" },
            react_1.default.createElement("div", { className: "flex justify-between items-center mb-6" },
                react_1.default.createElement("h2", { className: "text-4xl font-bold text-cyan-500" }, activeSection),
                react_1.default.createElement("button", { onClick: toggleLanguage, className: "w-10 h-10 focus:outline-none" },
                    react_1.default.createElement("img", { src: language === "en"
                            ? "/japanese_icon.svg"
                            : "/english_icon.svg", alt: language === "en"
                            ? "Switch to Japanese"
                            : "Switch to English", className: "w-full h-full" }))),
            react_1.default.createElement(framer_motion_1.AnimatePresence, { mode: "wait" },
                react_1.default.createElement(framer_motion_1.motion.p, { key: language, initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -20 }, transition: { duration: 0.3 }, className: "whitespace-pre-line text-lg text-slate-700 mb-6" }, content[activeSection][language])),
            activeSection === "Contact" && (react_1.default.createElement("div", { className: "flex justify-center mb-6" },
                react_1.default.createElement("button", { onClick: handleSendEmail, className: "focus:outline-none opacity-70 hover:opacity-100 transition-opacity duration-300" },
                    react_1.default.createElement("img", { src: "/send.svg", alt: "Send Email", className: "w-12 h-12" })))),
            activeSection === "Github" && (react_1.default.createElement("div", { className: "flex justify-center mb-6" },
                react_1.default.createElement("button", { onClick: handleGithubLink, className: "focus:outline-none opacity-70 hover:opacity-100 transition-opacity duration-300" },
                    react_1.default.createElement("img", { src: "/github.svg", alt: "Visit GitHub", className: "w-12 h-12" })))),
            activeSection === "Donate" && (react_1.default.createElement("div", { className: "flex justify-center mb-6" },
                react_1.default.createElement("button", { onClick: handleDonation, className: "focus:outline-none opacity-70 hover:opacity-100 transition-opacity duration-300" },
                    react_1.default.createElement("img", { src: "/donate.svg", alt: "Donate", className: "w-12 h-12" })))),
            react_1.default.createElement("div", { className: "flex justify-end" },
                react_1.default.createElement("button", { className: "px-4 py-2 text-slate-800 hover:text-cyan-500 transition-colors duration-300", onClick: handleClose }, "Close")))))));
}
function StarryPortfolio() {
    const [activeSection, setActiveSection] = (0, react_1.useState)("");
    const [meteorActive, setMeteorActive] = (0, react_1.useState)(false);
    const triggerMeteor = () => {
        if (!meteorActive) {
            setMeteorActive(true);
            setTimeout(() => setMeteorActive(false), 5000);
        }
    };
    return (react_1.default.createElement("div", { className: "w-full h-screen" },
        react_1.default.createElement(fiber_1.Canvas, { camera: { position: [0, 0, 10] } },
            react_1.default.createElement("color", { attach: "background", args: ["black"] }),
            react_1.default.createElement("ambientLight", { intensity: 0.5 }),
            react_1.default.createElement("pointLight", { position: [10, 10, 10] }),
            react_1.default.createElement(Box, { position: [0, 0, 0], setActiveSection: setActiveSection, triggerMeteor: triggerMeteor, meteorActive: meteorActive }),
            react_1.default.createElement(Stars, null),
            react_1.default.createElement(Meteor, { active: meteorActive }),
            react_1.default.createElement(drei_1.OrbitControls, { enableZoom: false }),
            react_1.default.createElement(postprocessing_1.EffectComposer, null,
                react_1.default.createElement(postprocessing_1.Bloom, { luminanceThreshold: 0, luminanceSmoothing: 1.5, height: 300 }))),
        react_1.default.createElement(Modal, { activeSection: activeSection, setActiveSection: setActiveSection })));
}
