import { calculateAngle } from './poseUtils';

export function checkSquatPosture(landmarks) {
  const leftKneeAngle = calculateAngle(
    landmarks[23], // Hip
    landmarks[25], // Knee
    landmarks[27]  // Ankle
  );

  const rightKneeAngle = calculateAngle(
    landmarks[24],
    landmarks[26],
    landmarks[28]
  );

  const leftBackAngle = calculateAngle(
    landmarks[11], // Shoulder
    landmarks[23], // Hip
    landmarks[25]  // Knee
  );

  let issues = [];

  if (leftKneeAngle > 120 || rightKneeAngle > 120) {
    issues.push({ joint: 25, message: 'Knee not bent enough' });
    issues.push({ joint: 26, message: 'Knee not bent enough' });
  }

  if (leftBackAngle < 60) {
    issues.push({ joint: 23, message: 'Back too far forward' });
  }

  return issues;
}
