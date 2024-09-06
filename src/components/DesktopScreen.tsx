import React, { useRef, useEffect } from 'react'
import { useThree } from '@react-three/fiber'
import * as THREE from 'three'

interface DesktopScreenProps {
  position: [number, number, number]
  rotation?: [number, number, number]
  size?: [number, number]
  stream: MediaStream | null
}

export default function DesktopScreen({ position, rotation = [0, 0, 0], size = [2, 1.5], stream }: DesktopScreenProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const { scene } = useThree()

  useEffect(() => {
    if (stream && meshRef.current) {
      const video = document.createElement('video')
      video.srcObject = stream
      video.play()

      const texture = new THREE.VideoTexture(video)
      texture.minFilter = THREE.LinearFilter
      texture.magFilter = THREE.LinearFilter
      texture.format = THREE.RGBFormat

      const material = new THREE.MeshBasicMaterial({ map: texture })
      meshRef.current.material = material
    }
  }, [stream])

  return (
    <mesh ref={meshRef} position={position} rotation={rotation}>
      <planeGeometry args={size} />
      <meshBasicMaterial color="gray" />
    </mesh>
  )
}

// import React, { useState, useRef, useEffect } from 'react'
// import { useFrame } from '@react-three/fiber'
// import { Html } from '@react-three/drei'
// import * as THREE from 'three'

// interface DesktopScreenProps {
//   position: [number, number, number]
//   size?: [number, number]
//   stream: MediaStream | null
// }

// export default function DesktopScreen({ position, size = [1.6, 0.9], stream }: DesktopScreenProps) {
//   const [videoTexture, setVideoTexture] = useState<THREE.VideoTexture | null>(null)
//   const videoRef = useRef<HTMLVideoElement>(null)

//   useEffect(() => {
//     if (stream && videoRef.current) {
//       videoRef.current.srcObject = stream
//       videoRef.current.play()
//     }
//   }, [stream])

//   useFrame(() => {
//     if (videoRef.current && !videoTexture) {
//       const texture = new THREE.VideoTexture(videoRef.current)
//       texture.minFilter = THREE.LinearFilter
//       texture.magFilter = THREE.LinearFilter
//       texture.format = THREE.RGBFormat
//       setVideoTexture(texture)
//     }
//   })

//   return (
//     <group position={position}>
//       <mesh rotation={[0, Math.PI, 0]}>
//         <planeGeometry args={size} />
//         <meshBasicMaterial side={THREE.DoubleSide}>
//           {videoTexture && <primitive attach="map" object={videoTexture} />}
//         </meshBasicMaterial>
//       </mesh>
//       <Html transform>
//         <video
//           ref={videoRef}
//           className="hidden"
//         />
//       </Html>
//     </group>
//   )
// }