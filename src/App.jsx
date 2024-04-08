import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import LG from './tools/logic-design/LG'
import Controls from './tools/logic-design/controls'
function App() {
  const [elements,setElements] = useState([])
  return (
    <>
      <Controls elements={elements} setElements={setElements}/>
      <LG elements={elements}/>
    </>
  )
}

export default App
