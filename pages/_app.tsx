import { CssBaseline } from "@mui/material"
import { SessionProvider } from "next-auth/react"
import type { AppProps } from 'next/app'
import { QueryClient, QueryClientProvider } from "react-query"
import { TamuroThemeProvider } from "styles/theme"
import '../styles/globals.css'

const queryClient = new QueryClient()

export default function App({
  Component,
  pageProps: {
    session,
    ...pageProps
  },
}: AppProps) {
  return (
    <SessionProvider session={session}>
      <QueryClientProvider client={queryClient}>
        <TamuroThemeProvider>
          <CssBaseline />
          <Component {...pageProps} />
        </TamuroThemeProvider>
      </QueryClientProvider>
    </SessionProvider>
  )
}
