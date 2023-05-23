import Layout from '@/components/Layout'
import Nav from '@/components/Nav'

import '@/styles/globals.css'
import { SessionProvider } from "next-auth/react"
import { AppProps } from 'next/app'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider
      session={pageProps.session}>
    <Layout>
      <Component {...pageProps} />
    </Layout>
    </SessionProvider>
  )
  
  
}
