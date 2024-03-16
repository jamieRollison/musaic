import { Link } from 'react-router-dom'

function TempLoading() {
  return (
    <div className='div-center div-vert'>
      <p className='font-secondary'>(Pretend Spotify auth is here)</p> 
      <Link to={'/visualization'}>
        <div className='green-button'>
          <p className='font-primary'>Continue</p>
        </div>
      </Link>
    </div>
  )
}

export default TempLoading