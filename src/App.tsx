import { useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import Sample from "./Sample"
import WalletContextProvider from './WalletContextProvider'

function App() {
  const [count, setCount] = useState(0)

  return (
   <>
   <WalletContextProvider>
    <h1>Hi</h1>
    <Sample/>
   </WalletContextProvider>
   </>
  )
}

export default App
