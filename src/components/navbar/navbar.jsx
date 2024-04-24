import PropTypes from "prop-types";

function Navbar({ setData }) {
  return (
    <>
      <header>
        <div className="nav-container">
          <nav className="navbar">
            <img src="/musaic-logo.svg" style={{ height: "2em" }} />
            <ul>
              <select
                defaultValue={0}
                className="green-button"
                onChange={(event) => setData(event.target.value)}
              >
                <option className="font-primary" value={0}>
                  Jamie
                </option>
                <option className="font-primary" value={1}>
                  Melanie
                </option>
              </select>
            </ul>
          </nav>
        </div>
      </header>
    </>
  );
}

Navbar.propTypes = {
  setData: PropTypes.func,
};

export default Navbar;
