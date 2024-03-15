import musaicLogo from '/musaic-logo.svg'
import spotifyLogo from '/spotify-logo.svg'
import './root.css'

function Root() {
    return (
      <>
        <img src={musaicLogo} style={{height: 165}}/>
        <p className='font-secondary'>Your story through your tunes.</p>
        <div className='green-button'>
          <img src={spotifyLogo}/>
          <p className='font-primary'>Sign in to Start Exploring</p>
        </div>
      </>
    )
}

export default Root