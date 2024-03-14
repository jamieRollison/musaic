import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './starterpage.css'

function StarterPage() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <h1>Log in to Spotify</h1>
      <button onClick={handleLogin}>Log in with Spotify</button>
    </div>
  );
}

export default StarterPage
