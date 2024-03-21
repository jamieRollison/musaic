import { Link } from "react-router-dom"

function Navbar() {
  return (
    <>
      <header>
        <div className='nav-container'>
          <nav className='navbar'>
            <img src='/musaic-logo.svg' style={{height: '2em'}}/>
            <ul>
              <li className='font-username'>BLC5</li>
              <li>
                {/* TODO: Sign out! */}
                <Link to={'/'}>
                  <button className="green-button" onClick={() => {
                    window.localStorage.removeItem('token')
                  }}>
                    <h3 className="font-primary">Sign Out</h3>
                  </button>
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>
    </>
  )
}

export default Navbar