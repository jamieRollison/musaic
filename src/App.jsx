import React from 'react';

function App() {
  const handleLogin = () => {
    // Redirect user to login route
    window.location.href = 'http://localhost:8888/login';
  };

  return (
    <div>
      <h1>Log in to Spotify</h1>
      <button onClick={handleLogin}>Log in with Spotify</button>
    </div>
  );
}

export default App;
