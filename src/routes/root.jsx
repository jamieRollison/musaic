import {Link} from 'react-router-dom'
import musaicLogo from '/musaic-logo.svg'
import spotifyLogo from '/spotify-logo.svg'
import './root.css'

function Root() {
    return (
      <>
        <img src={musaicLogo} style={{height: 165}}/>
        <p className='font-secondary'>Your 
          <span style={{fontWeight: 550, color: '#2D81FF'}}> story </span>
          through your 
          <span style={{fontWeight: 550, color: '#FF3D77'}}> tunes</span>.
        </p>
        <Link to={'loading'}>
          <div className='green-button'>
            <img src={spotifyLogo}/>
            <p className='font-primary'>Sign in to Start Exploring</p>
          </div>
        </Link>
      </>
    )
}

export default Root