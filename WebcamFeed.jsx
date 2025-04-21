import React, { useEffect, useRef, useState } from 'react';
import { createPoseLandmarker } from '../pose/PoseDetector';
import { checkSquatPosture } from '../utils/squatRules';
import { checkPushupPosture } from '../utils/pushupRules';
import ThreeOverlay from './ThreeOverlay';

const WebcamFeed = ({ exercise }) => {
  const videoRef = useRef();
  const canvasRef = useRef();
  const landmarkerRef = useRef();
  const [issues, setIssues] = useState([]);

  useEffect(() => {
    const init = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      await videoRef.current.play();

      createPoseLandmarker((landmarker) => {
        landmarkerRef.current = landmarker;
        requestAnimationFrame(detectPose);
      });
    };

    const detectPose = async () => {
      if (landmarkerRef.current && videoRef.current.readyState === 4) {
        const results = landmarkerRef.current.detectForVideo(
          videoRef.current,
          performance.now()
        );
        if (results && results.landmarks && results.landmarks.length > 0) {
          draw(results.landmarks[0]);
        }
      }
      requestAnimationFrame(detectPose);
    };

    const draw = (landmarks) => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (!landmarks) return;

      let issues = [];

      if (exercise === 'squats') {
        issues = checkSquatPosture(landmarks);
      } else if (exercise === 'pushups') {
        issues = checkPushupPosture(landmarks);
      }

      setIssues(issues); 

      for (let i = 0; i < landmarks.length; i++) {
        const x = landmarks[i].x * canvas.width;
        const y = landmarks[i].y * canvas.height;

        const isWrong = issues.find((issue) => issue.joint === i);

        ctx.beginPath();
        ctx.arc(x, y, 6, 0, 2 * Math.PI);
        ctx.fillStyle = isWrong ? 'red' : 'green';
        ctx.fill();

        if (isWrong) {
          ctx.font = '12px Arial';
          ctx.fillText(isWrong.message, x + 8, y - 5);
        }
      }
    };

    init();
  }, [exercise]);

  return (
    <div className="relative mt-6 w-full h-full flex justify-center items-center">
      {/* Video element */}
      <div className="relative w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl">
        <video
          ref={videoRef}
          width="100%"
          height="auto"
          className="rounded-lg shadow-lg"
        />
        <canvas
          ref={canvasRef}
          width="100%"
          height="auto"
          className="absolute top-0 left-0"
        />
      </div>

      {/* Three.js overlay */}
      <ThreeOverlay width={640} height={480} issues={issues} />
    </div>
  );
};

export default WebcamFeed;

