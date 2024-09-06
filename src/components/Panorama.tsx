import React, { useRef, useEffect } from 'react'
import { useThree, useLoader, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const Panorama: React.FC = () => {
  const meshRef = useRef<THREE.Mesh>(null)
  const { scene, gl } = useThree()
  const texture = useLoader(THREE.TextureLoader, '/image-panorama2.jpg')

  // <iframe src="https://skybox.blockadelabs.com/e/99cb9142b96b5c639145db1123195da9" width=700 height=700 style="border:0;" allow="fullscreen"></iframe>

  useEffect(() => {
    if (texture) {
      texture.mapping = THREE.EquirectangularReflectionMapping
      texture.colorSpace = THREE.SRGBColorSpace
      texture.minFilter = THREE.LinearFilter
      texture.magFilter = THREE.LinearFilter
      texture.needsUpdate = true

      scene.background = texture
      gl.outputColorSpace = THREE.SRGBColorSpace
    }
  }, [texture, scene, gl])

  useFrame(({ camera }) => {
    if (meshRef.current) {
      meshRef.current.position.copy(camera.position)
    }
  })

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[500, 60, 40]} />
      <meshBasicMaterial map={texture} side={THREE.BackSide} />
    </mesh>
  )
}

export default Panorama