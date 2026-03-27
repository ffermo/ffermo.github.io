import { useDispatch, useSelector } from 'react-redux';
import './MenuBar.css';
import { AppDispatch } from '../space-store/space.store';
import { SetCameraTargetAction, UpdateEarthTargetAction, } from '../space-store/space.actions';
import { SpaceTarget } from '../util/scene.util';
import { GeoCoordinates, isNearTarget, LONGMONT_CO_LOC, ORLANDO_FL_LOC, QUEZON_PH_LOC } from '../util/location.util';
import { selectCurrentEarthTarget, selectSpaceTarget } from '../space-store/space.hooks';



function MenuBar() {
  const dispatch = useDispatch<AppDispatch>();
  const spaceTarget: SpaceTarget = useSelector(selectSpaceTarget);
  const earthTarget: GeoCoordinates = useSelector(selectCurrentEarthTarget) as GeoCoordinates;

  function viewHomeOnMap() {
    if (!isNearTarget(earthTarget, LONGMONT_CO_LOC)) {
      dispatch(UpdateEarthTargetAction(LONGMONT_CO_LOC));
    }
  }

  function viewBirthplaceOnMap() {
    if (!isNearTarget(earthTarget, QUEZON_PH_LOC)) {
      dispatch(UpdateEarthTargetAction(QUEZON_PH_LOC));
    }
  }

  function viewEducationOnMap() {
    if (!isNearTarget(earthTarget, ORLANDO_FL_LOC)) {
      dispatch(UpdateEarthTargetAction(ORLANDO_FL_LOC));
    }
  }

  function focusSun() {
    if (spaceTarget !== SpaceTarget.SUN_SPHERE) {
      dispatch(SetCameraTargetAction(SpaceTarget.SUN_SPHERE));
    }
  }

  function focusEarth() {
    if (spaceTarget !== SpaceTarget.EARTH_SPHERE) {
      dispatch(SetCameraTargetAction(SpaceTarget.EARTH_SPHERE));
    }
  }

  switch (spaceTarget) {
    case SpaceTarget.SUN_SPHERE:
      return (
        <div className="menu-container">
          <div className="menu-item" onClick={focusEarth}>EARTH</div>
          <div className="menu-item" onClick={focusSun}>SUN</div>
        </div>
      )
    case SpaceTarget.EARTH_ELLIPSE:
    default:
      return (
        <div className="menu-container">
          <div className="menu-item" onClick={viewHomeOnMap}>HOME</div>
          <div className="menu-item" onClick= {viewEducationOnMap}>EDUCATION</div>
          <div className="menu-item" onClick={viewBirthplaceOnMap}>BORN</div>
          <div className="menu-item" onClick={focusSun}>SUN</div>
        </div>
      ) 
  }
}

export default MenuBar;