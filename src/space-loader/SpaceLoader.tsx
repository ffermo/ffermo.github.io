import { useProgress } from '@react-three/drei';
import { useEffect } from 'react';

function SpaceLoader() {
  const { progress } = useProgress();
  useEffect(() => {
    let interval

    interval = setInterval(() => {
      console.log(`Progress: ${progress}%`)
    })

    return () => {
      clearInterval(interval)
    }
  }, [progress])
  return (
    <div style={{backgroundColor: "#00B1E1"}}>LOADING</div>
  )
}

export default SpaceLoader