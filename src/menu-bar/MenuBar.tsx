import { useDispatch } from 'react-redux';
import './MenuBar.css';
import { AppDispatch } from '../space-store/space.store';
import { SetCameraTargetAction } from '../space-store/space.actions';
import { SpaceObjectName } from '../util/scene.util';

function MenuBar() {
  const dispatch = useDispatch<AppDispatch>();

  // TODO: Refactor methods from Angular webpage.
  // function viewHomeOnMap() {
  //   console.log("HOME");
  // }

  // function viewCollegeOnMap() {
  //   console.log("COLLEGE");
  // }

  // function viewBirthplaceOnMap() {
  //   console.log("BIRTH");
  // }

  function focusSun() {
    dispatch(SetCameraTargetAction(SpaceObjectName.SUN_SPHERE));
  }

  function focusEarth() {
    dispatch(SetCameraTargetAction(SpaceObjectName.EARTH_SPHERE));
  }

  return (
    <div className="menu-container">
      {/* TODO */}
      {/* <div className="menu-item" onClick={viewHomeOnMap}>HOME</div> */}
      {/* <div className="menu-item" onClick= {viewCollegeOnMap}>EDUCATION</div> */}
      {/* <div className="menu-item" onClick={viewBirthplaceOnMap}>BORN</div> */}
      <div className="menu-item" onClick={focusSun}>SUN</div>
      <div className="menu-item" onClick={focusEarth}>EARTH</div>
    </div>
  )

  
}

export default MenuBar;