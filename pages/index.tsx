import { useSession } from "next-auth/react"
import { useRouter } from 'next/router'

export default function Home() {
  const { data: session, status } = useSession()
  const router = useRouter()

  if (session && session.user) {
    router.push('/dashboard')
  }
  return (
    <>
      <h1>welcome to Your Recipe Book</h1>
      <p>sign in to begin saving, scanning, and using your recipes</p>
    </>
  )
}