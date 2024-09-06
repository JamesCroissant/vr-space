import dynamic from 'next/dynamic'

const VRClassroom = dynamic(() => import('@/components/VRClassroom'), { ssr: false })

export default function Home() {
  return (
    <main>
      <VRClassroom />
    </main>
  )
}