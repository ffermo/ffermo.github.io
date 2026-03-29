import { useCallback, useEffect, useState } from 'react';
import './App.css';
import MenuBar from './menu-bar/MenuBar';
import SpaceCanvas from './space-canvas/SpaceCanvas';
import SpaceLoader from './space-loader/SpaceLoader';

function App() {  // Dynamically canvas size with resizing of window.
  console.log("App Rendered");
  const [loaded, setLoaded] = useState(false);
  const onLoaded = useCallback(() => setLoaded(true), []);

  useEffect(() => {
    function updateCanvas() {
      document.getElementById("canvas")?.style.setProperty("width", window.innerWidth + "px");
      document.getElementById("canvas")?.style.setProperty("height", window.innerHeight + "px");
    }

    window.addEventListener('resize', updateCanvas);
    return () => window.removeEventListener('resize', updateCanvas);
  }, []);

  return (
    <div
      id="canvas"
      style={{ width: window.innerWidth, height: window.innerHeight}}
      onContextMenu={(ev) => { ev.preventDefault() }} >
      <SpaceCanvas />
      {loaded && <MenuBar />}
      {!loaded && <SpaceLoader onLoaded={onLoaded} />}
    </div>
  );
}

export default App;
