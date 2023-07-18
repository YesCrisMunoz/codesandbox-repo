import { Canvas, useFrame } from "@react-three/fiber"
import { useGLTF, Float, Lightformer, Text, Html, ContactShadows, Environment, MeshTransmissionMaterial } from "@react-three/drei"
import { EffectComposer, N8AO, TiltShift2 } from "@react-three/postprocessing"
import { Route, Link, useLocation } from "wouter"
import { suspend } from "suspend-react"
import { easing } from "maath"

const inter = import("@pmndrs/assets/fonts/inter_regular.woff")
useGLTF.preload("/bomb-gp.glb")

export const App = () => (
  <>
    <Canvas eventSource={document.getElementById("root")} eventPrefix="client" shadows camera={{ position: [0, 0, 20], fov: 50 }}>
      <color attach="background" args={["#e0e0e0"]} />
      <spotLight position={[20, 20, 10]} penumbra={1} castShadow angle={0.2} />
      <Status position={[0, 1, -20]} />
      <Float floatIntensity={2}>
        <Route path="/">
          <Torus />
        </Route>
        <Route path="/knot">
          <Knot />
        </Route>
        <Route path="/bomb">
          <Bomb scale={0.7} />
        </Route>
      </Float>
      <ContactShadows scale={100} position={[0, -7.5, 0]} blur={1} far={100} opacity={0.85} />
      <Environment preset="city">
        <Lightformer intensity={8} position={[10, 5, 0]} scale={[10, 50, 1]} onUpdate={(self) => self.lookAt(0, 0, 0)} />
      </Environment>
      <EffectComposer disableNormalPass>
        <N8AO aoRadius={1} intensity={2} />
        <TiltShift2 blur={0.2} />
      </EffectComposer>
      <Rig />
    </Canvas>
    <div class="nav">
      Be the first and{" "}
      <a href="https://prismez.com.br" target="_blank">
        <b>subscribe</b>
      </a>
    </div>
    <div class="footer">
      <b>PRISMEZ</b> is a decentralized, distributed, and collective community sharing signals of futures
    </div>
  </>
)

function Rig() {
  useFrame((state, delta) => {
    easing.damp3(
      state.camera.position,
      [Math.sin(-state.pointer.x) * 5, state.pointer.y * 3.5, 15 + Math.cos(state.pointer.x) * 10],
      0.2,
      delta,
    )
    state.camera.lookAt(0, 0, 0)
  })
}

const Torus = (props) => (
  <mesh receiveShadow castShadow {...props}>
    <coneGeometry args={[5, 5, 3, 1, 0, 6]} />
    <MeshTransmissionMaterial backside backsideThickness={5} thickness={2} />
  </mesh>
)

const Knot = (props) => (
  <mesh receiveShadow castShadow {...props}>
    <coneGeometry args={[5, 5, 3, 1, 0, 6]} />
    <MeshTransmissionMaterial backside backsideThickness={5} thickness={2} />
  </mesh>
)

function Bomb(props) {
  const { nodes } = useGLTF("/bomb-gp.glb")
  return (
    <mesh receiveShadow castShadow geometry={nodes.Little_Boy_Little_Boy_Material_0.geometry} {...props}>
      <MeshTransmissionMaterial backside backsideThickness={10} thickness={5} />
    </mesh>
  )
}

function Status(props) {
  const [loc] = useLocation()
  const text = loc === "/" ? "/prismez" : loc
  return (
    <Text fontSize={8} letterSpacing={-0.025} font={suspend(inter).default} color="black" {...props}>
      {text}
      <Html style={{ color: "transparent", fontSize: "33.5em" }} transform>
        {text}
      </Html>
    </Text>
  )
}

function Sus(props) {
  return (
    <Text fontSize={2} letterSpacing={-0.025} font={suspend(inter).default} color="black" {...props}>
      Be the first and subscribe
      <Html style={{ color: "transparent", fontSize: "33.5em" }} transform></Html>
    </Text>
  )
}
