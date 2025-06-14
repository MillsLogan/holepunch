import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Paper from './services/models/Paper.js'
import Fold from './services/models/Fold.js'
import PaperRepresentation from './components/PaperRepresentation.jsx'
import Playground from './pages/Playground.jsx'
import Navbar from './components/Navbar.jsx'
import Home from './pages/Home.jsx'
import Game from './pages/Game.jsx'

function App() {
  const [activePage, setActivePage] = useState("home");

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#playground') {
        setActivePage('playground');
      } else if (hash === '#game') {
        setActivePage('game');
      } else {
        setActivePage('home');
      }
    };

    // Initial check
    handleHashChange();

    // Add event listener for hash changes
    window.addEventListener('hashchange', handleHashChange);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }
  , []);

  const pages = {
    "home": <Home />,
    "playground": <Playground />,
    "game": <Game />
  }

  return (
    <>
      <Navbar activePage={activePage} />
      {pages[activePage] || <h1>Page Not Found</h1>}
    </>
  )
}



export default App
