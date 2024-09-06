import './App.css';
import MenuBar from './menu-bar/MenuBar';
import SpaceCanvas from './space-canvas/SpaceCanvas';
// import { useDispatch } from 'react-redux';
// import { AppDispatch } from './space-store/space.store';
// import { CanvasState } from './space-store/space.state';

function App() {  // Dynamically canvas size with resizing of window.
  console.log("App Rendered");
  
  function updateCanvas() {
    document.getElementById("canvas")?.style.setProperty("width", window.innerWidth + "px");
    document.getElementById("canvas")?.style.setProperty("height", window.innerHeight + "px");
    // const payload: CanvasState = {
    //   width: window.innerWidth,
    //   height: window.innerHeight
    // }

    // Dispatch action to state.
    // dispatch(UpdateSpaceCanvasAction(payload)); 
  }

  window.addEventListener('resize', updateCanvas)

  return (
    <div
      id="canvas"
      style={{ width: window.innerWidth, height: window.innerHeight}}
      onContextMenu={(ev) => { ev.preventDefault() }} >
      <SpaceCanvas />
      <MenuBar />
    </div>
  );
}

export default App;
