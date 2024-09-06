import { useTexture } from '@react-three/drei'
import * as THREE from 'three'

interface DetailedDeskProps {
  position: [number, number, number]
}

export default function DetailedDesk({ position }: DetailedDeskProps) {
  const woodTexture = useTexture('/placeholder.svg?height=512&width=512')
  woodTexture.wrapS = woodTexture.wrapT = THREE.RepeatWrapping
  woodTexture.repeat.set(2, 2)

  return (
    <group position={position}>
      {/* Table top */}
      <mesh position={[0, 0.375, 0]}>
        <boxGeometry args={[1.5, 0.05, 0.8]} />
        <meshStandardMaterial map={woodTexture} />
      </mesh>
      {/* Legs */}
      {[[-0.7, 0, 0.35], [0.7, 0, 0.35], [-0.7, 0, -0.35], [0.7, 0, -0.35]].map((pos, index) => (
        <mesh key={index} position={pos as [number, number, number]}>
          <cylinderGeometry args={[0.03, 0.03, 0.75, 8]} />
          <meshStandardMaterial color="#4A4A4A" />
        </mesh>
      ))}
      {/* Drawer */}
      <mesh position={[0, 0.25, 0.35]}>
        <boxGeometry args={[1.4, 0.2, 0.05]} />
        <meshStandardMaterial color="#3A3A3A" />
      </mesh>
      {/* Drawer handle */}
      <mesh position={[0, 0.25, 0.38]}>
        <boxGeometry args={[0.2, 0.03, 0.03]} />
        <meshStandardMaterial color="#808080" />
      </mesh>
    </group>
  )
}