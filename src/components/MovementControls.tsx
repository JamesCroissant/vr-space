import { useRef, useEffect } from 'react'
import { useThree, useFrame } from '@react-three/fiber'

export default function MovementControls() {
  const { camera } = useThree()
  const keys = useRef<{ [key: string]: boolean }>({})

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      keys.current[event.code] = true
    }
    const handleKeyUp = (event: KeyboardEvent) => {
      keys.current[event.code] = false
    }
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

  useFrame(() => {
    const speed = 0.1
    if (keys.current['KeyW']) camera.translateZ(-speed)
    if (keys.current['KeyS']) camera.translateZ(speed)
    if (keys.current['KeyA']) camera.translateX(-speed)
    if (keys.current['KeyD']) camera.translateX(speed)
  })

  return null
}