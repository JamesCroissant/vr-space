'use client'

import React, { useState, useRef, useEffect, Suspense } from 'react'
import { Canvas, useFrame, useThree, useLoader } from '@react-three/fiber'
import { PointerLockControls } from '@react-three/drei'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import * as THREE from 'three'
import DesktopScreen from './DesktopScreen'
import { Avatar } from './Avatar'

function Model() {
  const gltf = useLoader(GLTFLoader, '/scene.gltf')
  return <primitive object={gltf.scene} />
}

function MovingScreens({ streams, isVisible }: { streams: (MediaStream | null)[], isVisible: boolean }) {
  const { camera } = useThree()
  const screensRef = useRef<THREE.Group>(null)

  useFrame(() => {
    if (screensRef.current) {
      screensRef.current.position.copy(camera.position)
      screensRef.current.rotation.y = camera.rotation.y
    }
  })

  if (!isVisible) return null

  return (
    <group ref={screensRef}>
      <DesktopScreen position={[0, 0, -3]} stream={streams[0]} />
      <DesktopScreen position={[-2.6, 0, -1.5]} rotation={[0, Math.PI / 4, 0]} stream={streams[1]} />
      <DesktopScreen position={[2.6, 0, -1.5]} rotation={[0, -Math.PI / 4, 0]} stream={streams[2]} />
      <DesktopScreen position={[-3, 0, 1.5]} rotation={[0, Math.PI / 2, 0]} stream={streams[3]} />
      <DesktopScreen position={[3, 0, 1.5]} rotation={[0, -Math.PI / 2, 0]} stream={streams[4]} />
    </group>
  )
}

function MovementControls({ onToggleScreens }: { onToggleScreens: () => void }) {
  const { camera } = useThree()
  const keys = useRef<{ [key: string]: boolean }>({})

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      keys.current[event.key.toLowerCase()] = true
      if (event.key.toLowerCase() === 'e') {
        onToggleScreens()
      }
    }
    const handleKeyUp = (event: KeyboardEvent) => {
      keys.current[event.key.toLowerCase()] = false
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [onToggleScreens])

  useFrame(() => {
    const speed = 0.1
    const direction = new THREE.Vector3()

    if (keys.current['w']) direction.z -= 1
    if (keys.current['s']) direction.z += 1
    if (keys.current['a']) direction.x -= 1
    if (keys.current['d']) direction.x += 1

    direction.applyEuler(camera.rotation)
    direction.normalize().multiplyScalar(speed)

    camera.position.add(direction)
  })

  return null
}

export default function VRClassroom() {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [screenStreams, setScreenStreams] = useState<(MediaStream | null)[]>(Array(5).fill(null))
  const [isScreensVisible, setIsScreensVisible] = useState(false)

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  const startScreenShare = async (index: number) => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({ video: true })
      setScreenStreams(prev => {
        const newStreams = [...prev]
        newStreams[index] = stream
        return newStreams
      })
    } catch (err) {
      console.error("Error starting screen share:", err)
    }
  }

  const toggleScreens = () => {
    setIsScreensVisible(prev => !prev)
  }

  return (
    <div className="relative w-screen h-screen">
      <Canvas camera={{ position: [0, 1.6, 0], fov: 75 }}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          
          <Model />
          <MovingScreens streams={screenStreams} isVisible={isScreensVisible} />
          <Avatar url="https://models.readyplayer.me/66daa9f4ae68a8c9729a6615.glb" />
          
          <PointerLockControls />
          <MovementControls onToggleScreens={toggleScreens} />
        </Suspense>
      </Canvas>
      <button
        onClick={toggleFullscreen}
        className="absolute bottom-5 right-5 px-4 py-2 bg-black bg-opacity-50 text-white rounded cursor-pointer"
      >
        {isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
      </button>
      <div className="absolute bottom-5 left-5 flex space-x-2">
        {screenStreams.map((stream, index) => (
          <button
            key={index}
            onClick={() => startScreenShare(index)}
            className="px-4 py-2 bg-black bg-opacity-50 text-white rounded cursor-pointer"
          >
            {stream ? `Change Screen ${index + 1}` : `Share Screen ${index + 1}`}
          </button>
        ))}
      </div>
      <div className="absolute bottom-16 left-5 px-4 py-2 bg-black bg-opacity-50 text-white rounded">
        Use WASD keys to move, mouse to look around, and E to toggle screens
      </div>
    </div>
  )
}