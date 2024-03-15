import { Link } from 'react-router-dom'
import '../root.css'

function TempLoading() {
  return (
    <>
      <p className='font-secondary'>(Pretend Spotify auth is here)</p> 
      <Link to={'/visualization'}>
        <div className='green-button'>
          <p className='font-primary'>Continue</p>
        </div>
      </Link>
    </>
  )
}

export default TempLoading