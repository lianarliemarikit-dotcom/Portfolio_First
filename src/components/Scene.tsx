import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, Lightformer } from '@react-three/drei';
import * as THREE from 'three';

function LiquidRing({ reduced }: { reduced: boolean }) {
  const mesh = useRef<THREE.Mesh>(null);
  const pointer = useRef({ x: 0, y: 0 });
  const time = useRef(0);
  const filmTime = useMemo(() => ({ value: 0 }), []);
  const { size, camera } = useThree();
  const mobile = size.width < 700;
  const geometry = useMemo(() => new THREE.TorusGeometry(1.5, .28, mobile ? 24 : 40, mobile ? 96 : 160), [mobile]);
  const base = useMemo(() => new Float32Array(geometry.attributes.position.array), [geometry]);
  useEffect(() => {
    camera.position.z = size.width / size.height < .8 ? 8.4 : 6.2;
    camera.updateProjectionMatrix();
  }, [size.width, size.height, camera]);
  useEffect(() => {
    const move = (e: PointerEvent) => { pointer.current = { x: e.clientX / innerWidth - .5, y: e.clientY / innerHeight - .5 }; };
    window.addEventListener('pointermove', move, { passive: true });
    return () => window.removeEventListener('pointermove', move);
  }, []);
  useEffect(() => () => geometry.dispose(), [geometry]);
  useFrame((_state, delta) => {
    if (!reduced) time.current += Math.min(delta, .05);
    const t = time.current;
    filmTime.value = t;
    const positions = geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < base.length; i += 3) {
      const x = base[i], y = base[i + 1], z = base[i + 2];
      const a = Math.atan2(y, x);
      const center = 1.5 + .08 * Math.sin(a * 3 + t * .48) + .05 * Math.cos(a * 5 - t * .23);
      const thickness = 1 + .34 * Math.sin(a * 4 - t * .56) + .18 * Math.cos(a * 5 + t * .32);
      const r = center + (Math.hypot(x, y) - 1.5) * thickness;
      positions[i] = r * Math.cos(a);
      positions[i + 1] = r * Math.sin(a);
      positions[i + 2] = z * thickness + .22 * Math.sin(a * 3 + t * .38);
    }
    geometry.attributes.position.needsUpdate = true;
    geometry.computeVertexNormals();
    if (mesh.current) mesh.current.rotation.set(.12 + Math.sin(t * .21) * .24 + pointer.current.y * .12, -.18 + Math.sin(t * .17) * .36 + pointer.current.x * .16, t * .055);
  });
  return <mesh ref={mesh} geometry={geometry}><meshPhysicalMaterial color="#f7f4ed" metalness={.98} roughness={.18} iridescence={1} iridescenceIOR={1.42} iridescenceThicknessRange={[100, 650]} clearcoat={1} clearcoatRoughness={.12} envMapIntensity={1.45} onBeforeCompile={shader=>{
    shader.uniforms.uFilmTime=filmTime;
    shader.fragmentShader='uniform float uFilmTime;\n'+shader.fragmentShader;
    shader.fragmentShader=shader.fragmentShader.replace('#include <opaque_fragment>', `
      vec3 filmNormal = normalize(normal);
      float filmAngle = dot(filmNormal, normalize(vViewPosition));
      float filmPhase = filmNormal.x * 2.8 + filmNormal.y * 2.1 + filmAngle * 3.5 + uFilmTime * .08;
      vec3 filmSpectrum = .52 + .48 * cos(6.28318 * (filmPhase * .36 + vec3(.02,.36,.68)));
      float filmBand = pow(.5 + .5 * sin(filmNormal.x * 5. + filmNormal.y * 6. + filmAngle * 4.), 4.);
      outgoingLight = mix(outgoingLight, outgoingLight * filmSpectrum * 1.65, filmBand * .88);
      #include <opaque_fragment>
    `);
  }} /></mesh>;
}
function Studio() {
  return <Environment resolution={128} frames={1}>
    <color attach="background" args={['#a8a8a8']} />
    <Lightformer form="rect" intensity={4} color="white" position={[0, 4, 3]} scale={[8, 3, 1]} rotation={[Math.PI / 2, 0, 0]} />
    <Lightformer form="rect" intensity={3} color="white" position={[-4, 0, 3]} scale={[3, 8, 1]} rotation={[0, Math.PI / 2, 0]} />
    <Lightformer form="rect" intensity={3} color="white" position={[4, -2, 2]} scale={[3, 6, 1]} rotation={[0, -Math.PI / 2, 0]} />
    <Lightformer form="rect" intensity={.12} color="#000000" position={[0, 0, 5]} scale={[3, 8, 1]} />
    <Lightformer form="rect" intensity={2} color="#9a7dff" position={[-2, 2, -3]} scale={[2, 4, 1]} />
    <Lightformer form="rect" intensity={1.5} color="#ffca85" position={[3, 1, -2]} scale={[2, 5, 1]} />
    <Lightformer form="rect" intensity={1.4} color="#b9f6ed" position={[0, -4, 0]} scale={[5, 2, 1]} rotation={[-Math.PI / 2, 0, 0]} />
  </Environment>;
}
export default function Scene({ reduced, onFailure }: { reduced: boolean; onFailure: () => void }) {
  const host = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(true);
  useEffect(() => {
    let intersecting = true;
    const update = () => setActive(intersecting && !document.hidden);
    const observer = new IntersectionObserver(([entry]) => { intersecting = entry.isIntersecting; update(); });
    if (host.current) observer.observe(host.current);
    document.addEventListener('visibilitychange', update);
    return () => { observer.disconnect(); document.removeEventListener('visibilitychange', update); };
  }, []);
  return <div ref={host} className="scene-canvas"><Canvas dpr={[1, 1.5]} camera={{ position: [0, 0, 6.2], fov: 43 }} frameloop={reduced || !active ? 'demand' : 'always'} gl={{ alpha: true, antialias: true, powerPreference: 'low-power' }} onCreated={({ gl }) => gl.domElement.addEventListener('webglcontextlost', onFailure, { once: true })} fallback={<div className="fallback-ring" />}><Suspense fallback={null}><Studio /><LiquidRing reduced={reduced} /></Suspense></Canvas></div>;
}
