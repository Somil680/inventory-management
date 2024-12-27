'use client'
// import { useEffect, useState } from 'react'
import { Provider } from 'react-redux'
import { store } from '../redux/store'

interface Props {
//   session?: Session | null
  children: React.ReactNode
//   options: any
}

export function Providers({  children }: Props) {
  //   const [showLoader, setShowLoader] = useState(true)

  //   useEffect(() => {
  //     if (document.readyState === 'complete') return setShowLoader(false)
  //     window.addEventListener('load', () => {
  //       setShowLoader(false)
  //     })
  //   }, [])

  return (
    <Provider store={store}>
      {/* {showLoader && (
              <div
                style={{
                  display: 'flex',
                  position: 'fixed',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '100vw',
                  height: '100vh',
                  background: 'white',
                  zIndex: '1000',
                }}
              >
                <p
                  style={{
                    fontSize: '1.5rem',
                    lineHeight: '1.5rem',
                    fontWeight: 500,
                  }}
                >
                  Pioneer Public School Dewas
                </p>
              </div>
            )} */}
      {children}
    </Provider>
  )
}
