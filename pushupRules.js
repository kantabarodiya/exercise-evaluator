import { calculateAngle } from './poseUtils';

export function checkPushupPosture(landmarks) {
  const leftElbowAngle = calculateAngle(
    landmarks[11], // Shoulder
    landmarks[13], // Elbow
    landmarks[15]  // Wrist
  );

  const rightElbowAngle = calculateAngle(
    landmarks[12],
    landmarks[14],
    landmarks[16]
  );

  let issues = [];

  if (leftElbowAngle > 160 || rightElbowAngle > 160) {
    issues.push({ joint: 13, message: 'Elbows not bending enough' });
    issues.push({ joint: 14, message: 'Elbows not bending enough' });
  }

  return issues;
}
