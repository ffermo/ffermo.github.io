import { useProgress } from '@react-three/drei';
import { useEffect, useState } from 'react';
import './SpaceLoader.css';

function SpaceLoader({ onLoaded }: { onLoaded: () => void }) {
  const { progress } = useProgress();
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    if (progress === 100) {
      const timer = setTimeout(() => setFadeOut(true), 400);
      return () => clearTimeout(timer);
    }
  }, [progress]);

  useEffect(() => {
    if (fadeOut) {
      const timer = setTimeout(onLoaded, 800);
      return () => clearTimeout(timer);
    }
  }, [fadeOut, onLoaded]);

  return (
    <div className={`loader-overlay${fadeOut ? ' fade-out' : ''}`}>
      <div className="loader-content">
        <div className="loader-title">EXPLORING THE COSMOS</div>
        <div className="loader-bar-track">
          <div
            className="loader-bar-fill"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="loader-percent">{Math.round(progress)}%</div>
      </div>
    </div>
  );
}

export default SpaceLoader;
