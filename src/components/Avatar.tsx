import React, { useRef, useEffect } from 'react'
import { useGLTF, useAnimations } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

export function Avatar({ url }: { url: string }) {
  const group = useRef<THREE.Group>()
  const { scene, animations } = useGLTF(url)
  const { actions } = useAnimations(animations, group)
  const { camera } = useThree()

  useEffect(() => {
    if (actions.idle) {
      actions.idle.play()
    }
  }, [actions])

  useFrame(() => {
    if (group.current) {
      // アバターをカメラの前方に配置
      const offset = new THREE.Vector3(0, -1, -2)
      offset.applyQuaternion(camera.quaternion)
      group.current.position.copy(camera.position).add(offset)

      // アバターの回転をカメラの水平回転に合わせる
      const euler = new THREE.Euler(0, camera.rotation.y, 0)
      group.current.setRotationFromEuler(euler)
    }
  })

  return <primitive object={scene} ref={group} />
}

useGLTF.preload('https://models.readyplayer.me/66daa9f4ae68a8c9729a6615.glb')