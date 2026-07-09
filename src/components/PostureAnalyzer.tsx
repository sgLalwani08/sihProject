import { useRef, useEffect, useState } from 'react';
import { Play, Pause, Target, Zap, Brain, CheckCircle } from 'lucide-react';

interface Exercise {
  id: string;
  name: string;
  keyPoints: string[];
}

interface YogaPose {
  id: string;
  name: string;
  sanskritName: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  targetMuscles: string[];
  description: string;
  keyPoints: string[];
  benefits: string[];
  breathing: string;
}

interface PostureAnalyzerProps {
  selectedExercise?: Exercise;
  selectedPose?: YogaPose;
}

interface PositionValidation {
  isValidPosition: boolean;
  isCameraPositioned: boolean;
  requiredLandmarks: number[];
  positionMessage: string;
  cameraMessage: string;
}

interface PoseData {
  score: number;
  deviations: string[];
  feedback: string;
  landmarks: any[];
}

export default function PostureAnalyzer({ selectedExercise, selectedPose }: PostureAnalyzerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [poseData, setPoseData] = useState<PoseData>({
    score: 0,
    deviations: [],
    feedback: 'Ready for analysis',
    landmarks: []
  });
  
  // Exercise calculation state
  const [exerciseMode, setExerciseMode] = useState(false);
  const [exerciseType, setExerciseType] = useState<string>('');
  const [exerciseStartTime, setExerciseStartTime] = useState<number | null>(null);
  const [exerciseMetrics, setExerciseMetrics] = useState<{
    reps: number;
    sets: number;
    duration: number;
    calories: number;
    accuracy: number;
  }>({
    reps: 0,
    sets: 0,
    duration: 0,
    calories: 0,
    accuracy: 0
  });

  // Exercise-specific tracking state
  const [isPerformingExercise, setIsPerformingExercise] = useState(false);
  const [exercisePhase, setExercisePhase] = useState<'up' | 'down' | 'rest' | 'ready'>('ready');
  const [exerciseFormScore, setExerciseFormScore] = useState(0);
  const [exerciseDuration, setExerciseDuration] = useState(0);
  const [exerciseCalories, setExerciseCalories] = useState(0);
  
  // Video upload state
  const [uploadedVideo, setUploadedVideo] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [videoAnalysisProgress, setVideoAnalysisProgress] = useState(0);
  const [analysisMode, setAnalysisMode] = useState<'fast' | 'detailed'>('fast');
  
  // Landmark smoothing state
  const [smoothedLandmarks, setSmoothedLandmarks] = useState<any[]>([]);
  const [lastLandmarkUpdate, setLastLandmarkUpdate] = useState<number>(0);
  
  // State for position validation
  const [positionValidation, setPositionValidation] = useState<PositionValidation>({
    isValidPosition: false,
    isCameraPositioned: false,
    requiredLandmarks: [],
    positionMessage: '',
    cameraMessage: ''
  });

  // Backend connection state
  const [isConnected, setIsConnected] = useState(false);
  const [analysisInterval, setAnalysisInterval] = useState<NodeJS.Timeout | null>(null);
  const [backendUrl] = useState('http://localhost:5001');

  // Initialize exercise mode if selected exercise or pose is provided
  useEffect(() => {
    if (selectedExercise) {
      setExerciseMode(true);
      setExerciseType(selectedExercise.id);
      
      // Initialize position validation for the selected exercise
      setPositionValidation({
        isValidPosition: false,
        isCameraPositioned: false,
        requiredLandmarks: getExerciseKeyLandmarks(selectedExercise.id),
        positionMessage: `Get ready for ${selectedExercise.name}`,
        cameraMessage: 'Position yourself in front of the camera'
      });
    } else if (selectedPose) {
      setExerciseMode(true);
      setExerciseType(selectedPose.id);
      
      // Initialize position validation for the selected yoga pose
      setPositionValidation({
        isValidPosition: false,
        isCameraPositioned: false,
        requiredLandmarks: getExerciseKeyLandmarks(selectedPose.id),
        positionMessage: `Get ready for ${selectedPose.name} (${selectedPose.sanskritName})`,
        cameraMessage: 'Position yourself in front of the camera'
      });
    }
  }, [selectedExercise, selectedPose]);

  // Get comprehensive key landmarks for different exercises
  // Calculate angle between three points
  const calculateAngle = (point1: any, point2: any, point3: any) => {
    const a = Math.sqrt(Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2));
    const b = Math.sqrt(Math.pow(point2.x - point3.x, 2) + Math.pow(point2.y - point3.y, 2));
    const c = Math.sqrt(Math.pow(point3.x - point1.x, 2) + Math.pow(point3.y - point1.y, 2));
    
    const angle = Math.acos((a * a + b * b - c * c) / (2 * a * b));
    return angle * (180 / Math.PI);
  };

  // Smooth landmark positions to prevent blinking
  const smoothLandmarks = (newLandmarks: any[]) => {
    if (!newLandmarks || newLandmarks.length === 0) {
      return smoothedLandmarks;
    }

    const currentTime = Date.now();
    const timeDiff = currentTime - lastLandmarkUpdate;
    
    // Only update if enough time has passed (prevent rapid updates)
    if (timeDiff < 200) {
      return smoothedLandmarks;
    }

    setLastLandmarkUpdate(currentTime);

    if (smoothedLandmarks.length === 0) {
      setSmoothedLandmarks(newLandmarks);
      return newLandmarks;
    }

    const smoothingFactor = 0.3; // Lower = more smoothing
    const smoothed = newLandmarks.map((landmark, index) => {
      if (!landmark || !smoothedLandmarks[index]) {
        return landmark;
      }

      const prevLandmark = smoothedLandmarks[index];
      return {
        ...landmark,
        x: prevLandmark.x + (landmark.x - prevLandmark.x) * smoothingFactor,
        y: prevLandmark.y + (landmark.y - prevLandmark.y) * smoothingFactor,
        z: prevLandmark.z + (landmark.z - prevLandmark.z) * smoothingFactor,
        visibility: Math.max(landmark.visibility, prevLandmark.visibility * 0.8) // Maintain visibility
      };
    });

    setSmoothedLandmarks(smoothed);
    return smoothed;
  };

  const getExerciseKeyLandmarks = (exerciseType: string) => {
    switch (exerciseType) {
      // Upper Body Exercises
      case 'push-up':
        return [11, 12, 13, 14, 15, 16, 23, 24, 25, 26]; // Shoulders, elbows, wrists, hips, knees
      case 'pull-up':
        return [11, 12, 13, 14, 15, 16, 23, 24]; // Shoulders, elbows, wrists, hips
      case 'dips':
        return [11, 12, 13, 14, 15, 16, 23, 24]; // Shoulders, elbows, wrists, hips
      case 'burpees':
        return [11, 12, 13, 14, 15, 16, 23, 24, 25, 26, 27, 28]; // Full body landmarks
      
      // Lower Body Exercises
      case 'squat':
        return [23, 24, 25, 26, 27, 28, 11, 12]; // Hips, knees, ankles, shoulders
      case 'lunge':
        return [23, 24, 25, 26, 27, 28, 11, 12, 13, 14]; // Hips, knees, ankles, shoulders, elbows
      case 'jump-squat':
        return [23, 24, 25, 26, 27, 28, 11, 12]; // Hips, knees, ankles, shoulders
      case 'wall-sit':
        return [23, 24, 25, 26, 11, 12]; // Hips, knees, shoulders
      
      // Core Exercises
      case 'plank':
        return [11, 12, 13, 14, 23, 24, 25, 26]; // Shoulders, elbows, hips, knees
      case 'crunch':
        return [11, 12, 23, 24, 25, 26]; // Shoulders, hips, knees
      case 'mountain-climber':
        return [11, 12, 13, 14, 15, 16, 23, 24, 25, 26]; // Full body
      case 'russian-twist':
        return [11, 12, 23, 24]; // Shoulders, hips
      
      // Posture Exercises
      case 'proper-sitting':
      case 'standing-posture':
        return [11, 12, 23, 24, 7, 8]; // Shoulders, hips, ears
      
      // Yoga Poses (from yoga dashboard)
      case 'mountain-pose':
        return [11, 12, 23, 24, 25, 26, 27, 28]; // Full body alignment
      case 'downward-dog':
        return [11, 12, 13, 14, 15, 16, 23, 24, 25, 26]; // Full body
      case 'warrior-1':
      case 'warrior-2':
        return [11, 12, 23, 24, 25, 26, 27, 28]; // Full body
      case 'tree-pose':
        return [11, 12, 23, 24, 25, 26, 27, 28]; // Full body balance
      case 'child-pose':
        return [11, 12, 23, 24, 25, 26]; // Upper body
      case 'cobra-pose':
        return [11, 12, 23, 24, 7, 8]; // Upper body and head
      case 'bridge-pose':
        return [11, 12, 23, 24, 25, 26]; // Full body
      case 'triangle-pose':
        return [11, 12, 23, 24, 25, 26, 27, 28]; // Full body
      case 'pigeon-pose':
        return [11, 12, 23, 24, 25, 26]; // Hips and upper body
      case 'cat-cow-pose':
        return [11, 12, 23, 24, 25, 26]; // Spine and core
      case 'corpse-pose':
        return [11, 12, 23, 24]; // Basic alignment
      
      default:
        return [];
    }
  };

  // Exercise-specific camera positioning and validation logic
  const validateExercisePosition = (landmarks: any[], exerciseType: string) => {
    if (!landmarks || landmarks.length === 0) {
      return {
        isValidPosition: false,
        isCameraPositioned: false,
        requiredLandmarks: [],
        positionMessage: 'No body detected',
        cameraMessage: 'Position yourself in front of the camera'
      };
    }

    // Exercise-specific camera positioning requirements
    let requiredLandmarks: number[] = [];
    let cameraRequirements = '';
    
    switch (exerciseType) {
      case 'push-up':
        requiredLandmarks = [11, 12, 13, 14, 15, 16, 23, 24]; // shoulders, elbows, wrists, hips
        cameraRequirements = 'Position camera to see your full body from the side';
        break;
      case 'squat':
        requiredLandmarks = [23, 24, 25, 26, 27, 28, 11, 12]; // hips, knees, ankles, shoulders
        cameraRequirements = 'Position camera to see your full body from the front';
        break;
      case 'plank':
        requiredLandmarks = [11, 12, 13, 14, 23, 24, 25, 26]; // shoulders, elbows, hips, knees
        cameraRequirements = 'Position camera to see your side profile';
        break;
      case 'lunge':
        requiredLandmarks = [23, 24, 25, 26, 27, 28, 11, 12]; // hips, knees, ankles, shoulders
        cameraRequirements = 'Position camera to see your full body from the front';
        break;
      case 'sitting':
        requiredLandmarks = [11, 12, 23, 24, 25, 26]; // shoulders, hips, knees
        cameraRequirements = 'Position camera to see your upper body and posture';
        break;
      default:
        requiredLandmarks = [11, 12, 23, 24]; // basic landmarks
        cameraRequirements = 'Position camera to see your body';
    }

    // Check landmark visibility
    const visibleLandmarks = landmarks.filter((landmark, index) => 
      landmark && landmark.visibility > 0.4 && requiredLandmarks.includes(index)
    );

    // Exercise-specific visibility requirements
    let minVisibleLandmarks = 0;
    switch (exerciseType) {
      case 'push-up':
        minVisibleLandmarks = 6; // Need most upper body landmarks
        break;
      case 'squat':
        minVisibleLandmarks = 5; // Need most lower body landmarks
        break;
      case 'plank':
        minVisibleLandmarks = 6; // Need core landmarks
        break;
      case 'lunge':
        minVisibleLandmarks = 5; // Need lower body landmarks
        break;
      default:
        minVisibleLandmarks = 4;
    }

    const isCameraPositioned = visibleLandmarks.length >= minVisibleLandmarks;
    
    let isValidPosition = false;
    let positionMessage = '';

    // Exercise-specific position validation
    if (exerciseType === 'push-up') {
      const upperBodyLandmarks = [11, 12, 13, 14, 15, 16]; // shoulders, elbows, wrists
      const upperBodyVisible = upperBodyLandmarks.filter(index => 
        landmarks[index] && landmarks[index].visibility > 0.4
      ).length;
      
      if (upperBodyVisible >= 4) {
        const leftShoulder = landmarks[11];
        const rightShoulder = landmarks[12];
        const leftHip = landmarks[23];
        const rightHip = landmarks[24];
        
        if (leftShoulder && rightShoulder && leftHip && rightHip) {
          const shoulderHeight = (leftShoulder.y + rightShoulder.y) / 2;
          const hipHeight = (leftHip.y + rightHip.y) / 2;
          const heightDiff = Math.abs(shoulderHeight - hipHeight);
          
          if (heightDiff < 0.15) { // Body is horizontal
            isValidPosition = true;
            positionMessage = 'Ready for push-ups!';
    } else {
            positionMessage = 'Get into push-up position (horizontal)';
          }
        }
      } else {
        positionMessage = 'Get into push-up position';
      }
    } else if (exerciseType === 'squat') {
      const lowerBodyLandmarks = [23, 24, 25, 26, 27, 28]; // hips, knees, ankles
      const lowerBodyVisible = lowerBodyLandmarks.filter(index => 
        landmarks[index] && landmarks[index].visibility > 0.4
      ).length;
      
      if (lowerBodyVisible >= 4) {
        const leftHip = landmarks[23];
        const rightHip = landmarks[24];
        const leftKnee = landmarks[25];
        const rightKnee = landmarks[26];
        
        if (leftHip && rightHip && leftKnee && rightKnee) {
          const hipHeight = (leftHip.y + rightHip.y) / 2;
          const kneeHeight = (leftKnee.y + rightKnee.y) / 2;
          
          if (hipHeight < kneeHeight + 0.1) { // Hips above knees (standing)
            isValidPosition = true;
            positionMessage = 'Ready for squats!';
          } else {
            positionMessage = 'Stand up straight';
          }
        }
      } else {
        positionMessage = 'Stand up straight';
      }
    } else if (exerciseType === 'plank') {
      const coreLandmarks = [11, 12, 23, 24]; // shoulders, hips
      const coreVisible = coreLandmarks.filter(index => 
        landmarks[index] && landmarks[index].visibility > 0.4
      ).length;
      
      if (coreVisible >= 3) {
        const leftShoulder = landmarks[11];
        const rightShoulder = landmarks[12];
        const leftHip = landmarks[23];
        const rightHip = landmarks[24];
        
        if (leftShoulder && rightShoulder && leftHip && rightHip) {
          const shoulderHeight = (leftShoulder.y + rightShoulder.y) / 2;
          const hipHeight = (leftHip.y + rightHip.y) / 2;
          const heightDiff = Math.abs(shoulderHeight - hipHeight);
          
          if (heightDiff < 0.15) { // Body is horizontal
            isValidPosition = true;
            positionMessage = 'Ready for planks!';
          } else {
            positionMessage = 'Get into plank position (horizontal)';
          }
        }
      } else {
        positionMessage = 'Get into plank position';
      }
    } else if (exerciseType === 'lunge') {
      const lowerBodyLandmarks = [23, 24, 25, 26, 27, 28]; // hips, knees, ankles
      const lowerBodyVisible = lowerBodyLandmarks.filter(index => 
        landmarks[index] && landmarks[index].visibility > 0.4
      ).length;
      
      if (lowerBodyVisible >= 4) {
        isValidPosition = true;
        positionMessage = 'Ready for lunges!';
      } else {
        positionMessage = 'Stand up straight';
      }
    } else if (exerciseType === 'sitting') {
      const upperBodyLandmarks = [11, 12, 23, 24]; // shoulders, hips
      const upperBodyVisible = upperBodyLandmarks.filter(index => 
        landmarks[index] && landmarks[index].visibility > 0.4
      ).length;
      
      if (upperBodyVisible >= 3) {
        isValidPosition = true;
        positionMessage = 'Ready for posture analysis!';
      } else {
        positionMessage = 'Sit up straight and face the camera';
      }
    }

    return {
      isValidPosition,
      isCameraPositioned,
      requiredLandmarks,
      positionMessage,
      cameraMessage: isCameraPositioned ? 'Camera positioned correctly' : cameraRequirements
    };
  };

  // Expert-level push-up analysis with precise position detection
  const analyzePushUpMovement = (landmarks: any[]) => {
    const leftShoulder = landmarks[11];
    const rightShoulder = landmarks[12];
    const leftElbow = landmarks[13];
    const rightElbow = landmarks[14];
    const leftWrist = landmarks[15];
    const rightWrist = landmarks[16];
    const leftHip = landmarks[23];
    const rightHip = landmarks[24];
    const leftKnee = landmarks[25];
    const rightKnee = landmarks[26];

    if (!leftShoulder || !rightShoulder || !leftElbow || !rightElbow || !leftHip || !rightHip) {
      return { phase: 'ready', formScore: 0, isPerforming: false };
    }

    const shoulderHeight = (leftShoulder.y + rightShoulder.y) / 2;
    const hipHeight = (leftHip.y + rightHip.y) / 2;
    const kneeHeight = leftKnee && rightKnee ? (leftKnee.y + rightKnee.y) / 2 : hipHeight;

    // Expert criteria: Body should be in straight line (hips, back, legs aligned)
    const bodyAlignment = Math.abs(shoulderHeight - hipHeight) + Math.abs(hipHeight - kneeHeight);
    const isStraightLine = bodyAlignment < 0.1;
    
    if (!isStraightLine) {
      return { phase: 'ready', formScore: 0, isPerforming: false };
    }

    // Expert posture scoring with deviation penalties
    let formScore = 100; // Start with perfect score
    let phase: 'up' | 'down' | 'rest' = 'rest';
    let isPerforming = true;

    // Calculate elbow angle for precise position detection
    const leftElbowAngle = calculateAngle(leftShoulder, leftElbow, leftWrist);
    const rightElbowAngle = calculateAngle(rightShoulder, rightElbow, rightWrist);
    const avgElbowAngle = (leftElbowAngle + rightElbowAngle) / 2;

    // Expert position detection based on elbow angles
    if (avgElbowAngle < 90) {
      phase = 'down'; // Elbows bent (down position)
    } else if (avgElbowAngle > 160) {
      phase = 'up'; // Arms extended (up position)
    } else {
      phase = 'rest'; // Transition phase
    }

    // Posture deviation penalties (expert criteria)
    // Body alignment penalty
    if (bodyAlignment > 0.05) {
      formScore -= Math.min(30, bodyAlignment * 200);
    }

    // Shoulder stability penalty
    const shoulderStability = Math.abs(leftShoulder.y - rightShoulder.y);
    if (shoulderStability > 0.05) {
      formScore -= Math.min(20, shoulderStability * 200);
    }

    // Core engagement penalty
    const coreEngagement = Math.abs(hipHeight - shoulderHeight);
    if (coreEngagement > 0.05) {
      formScore -= Math.min(20, coreEngagement * 200);
    }

    // Elbow symmetry penalty
    const elbowSymmetry = Math.abs(leftElbow.y - rightElbow.y);
    if (elbowSymmetry > 0.03) {
      formScore -= Math.min(15, elbowSymmetry * 300);
    }

    // Hip symmetry penalty
    const hipSymmetry = Math.abs(leftHip.y - rightHip.y);
    if (hipSymmetry > 0.02) {
      formScore -= Math.min(15, hipSymmetry * 400);
    }

    return { phase, formScore: Math.max(formScore, 0), isPerforming };
  };

  // Expert-level squat analysis with precise position detection
  const analyzeSquatMovement = (landmarks: any[]) => {
    const leftHip = landmarks[23];
    const rightHip = landmarks[24];
    const leftKnee = landmarks[25];
    const rightKnee = landmarks[26];
    const leftAnkle = landmarks[27];
    const rightAnkle = landmarks[28];
    const leftShoulder = landmarks[11];
    const rightShoulder = landmarks[12];

    if (!leftHip || !rightHip || !leftKnee || !rightKnee || !leftShoulder || !rightShoulder) {
      return { phase: 'ready', formScore: 0, isPerforming: false };
    }

    const hipHeight = (leftHip.y + rightHip.y) / 2;
    const kneeHeight = (leftKnee.y + rightKnee.y) / 2;
    const shoulderHeight = (leftShoulder.y + rightShoulder.y) / 2;

    // Check if standing (hips above knees)
    const isStanding = hipHeight < kneeHeight + 0.05;
    
    if (!isStanding) {
      return { phase: 'ready', formScore: 0, isPerforming: false };
    }

    // Expert posture scoring with deviation penalties
    let formScore = 100; // Start with perfect score
    let phase: 'up' | 'down' | 'rest' = 'rest';
    let isPerforming = true;

    // Calculate knee angles for precise position detection
    const leftKneeAngle = leftAnkle && rightAnkle ? calculateAngle(leftHip, leftKnee, leftAnkle) : 0;
    const rightKneeAngle = leftAnkle && rightAnkle ? calculateAngle(rightHip, rightKnee, rightAnkle) : 0;
    const avgKneeAngle = (leftKneeAngle + rightKneeAngle) / 2;

    // Expert position detection based on knee angles
    if (avgKneeAngle < 90) {
      phase = 'down'; // Knees bent (squat position)
    } else if (avgKneeAngle > 160) {
      phase = 'up'; // Knees extended (standing position)
    } else {
      phase = 'rest'; // Transition phase
    }

    // Posture deviation penalties (expert criteria)
    // Back straightness penalty
    const backAngle = Math.abs(shoulderHeight - hipHeight);
    if (backAngle > 0.1) {
      formScore -= Math.min(30, backAngle * 200);
    }

    // Knee alignment penalty
    const kneeAlignment = Math.abs(leftKnee.y - rightKnee.y);
    if (kneeAlignment > 0.05) {
      formScore -= Math.min(20, kneeAlignment * 300);
    }

    // Hip stability penalty
    const hipStability = Math.abs(leftHip.y - rightHip.y);
    if (hipStability > 0.05) {
      formScore -= Math.min(20, hipStability * 300);
    }

    // Shoulder alignment penalty
    const shoulderAlignment = Math.abs(leftShoulder.y - rightShoulder.y);
    if (shoulderAlignment > 0.05) {
      formScore -= Math.min(15, shoulderAlignment * 200);
    }

    // Knee tracking penalty (knees should track over toes)
    const kneeTracking = Math.abs(leftKnee.x - rightKnee.x);
    if (kneeTracking > 0.1) {
      formScore -= Math.min(15, kneeTracking * 150);
    }

    return { phase, formScore: Math.max(formScore, 0), isPerforming };
  };

  const analyzePlankMovement = (landmarks: any[]) => {
    const leftShoulder = landmarks[11];
    const rightShoulder = landmarks[12];
    const leftHip = landmarks[23];
    const rightHip = landmarks[24];
    const leftKnee = landmarks[25];
    const rightKnee = landmarks[26];

    if (!leftShoulder || !rightShoulder || !leftHip || !rightHip) {
      return { phase: 'ready', formScore: 0, isPerforming: false };
    }

    const shoulderHeight = (leftShoulder.y + rightShoulder.y) / 2;
    const hipHeight = (leftHip.y + rightHip.y) / 2;
    const kneeHeight = leftKnee && rightKnee ? (leftKnee.y + rightKnee.y) / 2 : hipHeight;

    // Expert criteria: Body should be in straight line (shoulders, hips, knees aligned)
    const bodyAlignment = Math.abs(shoulderHeight - hipHeight) + Math.abs(hipHeight - kneeHeight);
    const isStraightLine = bodyAlignment < 0.1;
    
    if (!isStraightLine) {
      return { phase: 'ready', formScore: 0, isPerforming: false };
    }

    // Expert posture scoring criteria for plank
    let formScore = 0;
    let phase: 'up' | 'down' | 'rest' = 'rest';
    let isPerforming = true;

    // Base score for maintaining straight line
    formScore += 40;

    // Shoulder stability (shoulders should not collapse)
    const shoulderStability = Math.abs(leftShoulder.y - rightShoulder.y);
    if (shoulderStability < 0.05) {
      formScore += 20; // Stable shoulders
    } else {
      formScore += 10; // Slightly uneven
    }

    // Core engagement (hips should not sag or pike)
    const coreEngagement = Math.abs(hipHeight - shoulderHeight);
    if (coreEngagement < 0.05) {
      phase = 'up'; // Perfect plank
      formScore += 40; // Excellent core engagement
    } else if (coreEngagement < 0.1) {
      phase = 'down'; // Slightly sagging
      formScore += 20; // Good core engagement
    } else {
      phase = 'rest';
      formScore += 10; // Poor core engagement
    }

    return { phase, formScore: Math.min(formScore, 100), isPerforming };
  };

  const analyzeLungeMovement = (landmarks: any[]) => {
    const leftHip = landmarks[23];
    const rightHip = landmarks[24];
    const leftKnee = landmarks[25];
    const rightKnee = landmarks[26];
    const leftShoulder = landmarks[11];
    const rightShoulder = landmarks[12];

    if (!leftHip || !rightHip || !leftKnee || !rightKnee || !leftShoulder || !rightShoulder) {
      return { phase: 'ready', formScore: 0, isPerforming: false };
    }

    const leftHipHeight = leftHip.y;
    const rightHipHeight = rightHip.y;
    const leftKneeHeight = leftKnee.y;
    const rightKneeHeight = rightKnee.y;
    const shoulderHeight = (leftShoulder.y + rightShoulder.y) / 2;

    // Check if standing (hips above knees)
    const isStanding = (leftHipHeight < leftKneeHeight) && (rightHipHeight < rightKneeHeight);
    
    if (!isStanding) {
      return { phase: 'ready', formScore: 0, isPerforming: false };
    }

    // Expert criteria: Torso should be upright, knees should track over toes
    const hipHeight = (leftHipHeight + rightHipHeight) / 2;
    const backAngle = Math.abs(shoulderHeight - hipHeight);
    const isTorsoUpright = backAngle < 0.2;

    // Expert posture scoring criteria
    let formScore = 0;
    let phase: 'up' | 'down' | 'rest' = 'rest';
    let isPerforming = true;

    // Base score for standing position
    formScore += 30;

    // Torso uprightness (expert criteria)
    if (isTorsoUpright) {
      formScore += 30; // Good torso posture
    } else {
      formScore += 10; // Poor torso posture
    }

    // Knee alignment (knees should track over toes)
    const kneeAlignment = Math.abs(leftKneeHeight - rightKneeHeight);
    if (kneeAlignment < 0.1) {
      formScore += 20; // Good knee alignment
    } else {
      formScore += 10; // Poor knee alignment
    }

    // Hip stability
    const hipStability = Math.abs(leftHipHeight - rightHipHeight);
    if (hipStability < 0.05) {
      formScore += 20; // Stable hips
    } else {
      formScore += 10; // Unstable hips
    }

    // Movement phase detection
    const hipHeightDiff = Math.abs(leftHipHeight - rightHipHeight);
    if (hipHeightDiff > 0.1) {
      phase = 'down'; // One hip lower (lunge position)
      formScore += 20; // Bonus for proper depth
    } else if (hipHeightDiff < 0.05) {
      phase = 'up'; // Hips level (standing)
      formScore += 20; // Bonus for full extension
    } else {
      phase = 'rest';
      formScore += 10; // Neutral position
    }

    return { phase, formScore: Math.min(formScore, 100), isPerforming };
  };

  // Analyze sitting posture for posture analysis
  const analyzeSittingPosture = (landmarks: any[]) => {
    const leftShoulder = landmarks[11];
    const rightShoulder = landmarks[12];
    const leftHip = landmarks[23];
    const rightHip = landmarks[24];
    const leftEar = landmarks[7];
    const rightEar = landmarks[8];

    if (!leftShoulder || !rightShoulder || !leftHip || !rightHip || !leftEar || !rightEar) {
      return { phase: 'ready', formScore: 0, isPerforming: false };
    }

    // Calculate posture metrics
    const shoulderHeight = (leftShoulder.y + rightShoulder.y) / 2;
    const earHeight = (leftEar.y + rightEar.y) / 2;
    
    // Check for slouching (head forward, shoulders rounded)
    const headForward = earHeight > shoulderHeight + 0.05;
    const shouldersRounded = Math.abs(leftShoulder.x - rightShoulder.x) < 0.1;
    
    let phase: 'up' | 'down' | 'rest' | 'ready' = 'ready';
    let formScore = 0;
    let isPerforming = true; // Always performing for posture analysis

    if (headForward || shouldersRounded) {
      phase = 'down'; // Poor posture
      formScore = 60;
    } else {
      phase = 'up'; // Good posture
      formScore = 90;
    }

    return { phase, formScore, isPerforming };
  };

  // Yoga pose analysis functions
  const analyzeYogaPose = (landmarks: any[], poseType: string) => {
    const leftShoulder = landmarks[11];
    const rightShoulder = landmarks[12];
    const leftHip = landmarks[23];
    const rightHip = landmarks[24];
    const leftKnee = landmarks[25];
    const rightKnee = landmarks[26];

    if (!leftShoulder || !rightShoulder || !leftHip || !rightHip) {
      return { phase: 'ready', formScore: 0, isPerforming: false };
    }

    let formScore = 100;
    let phase: 'up' | 'down' | 'rest' | 'ready' = 'ready';
    let isPerforming = true;

    // Check basic alignment for all yoga poses
    const shoulderAlignment = Math.abs(leftShoulder.y - rightShoulder.y);
    const hipAlignment = Math.abs(leftHip.y - rightHip.y);
    
    if (shoulderAlignment > 0.05) {
      formScore -= 15;
    }
    if (hipAlignment > 0.05) {
      formScore -= 15;
    }

    // Pose-specific analysis
    switch (poseType) {
      case 'mountain-pose':
        // Standing straight alignment
        const spineAlignment = Math.abs((leftShoulder.y + rightShoulder.y) / 2 - (leftHip.y + rightHip.y) / 2);
        if (spineAlignment < 0.1) {
          phase = 'up'; // Good alignment
        } else {
          phase = 'down'; // Poor alignment
          formScore -= 20;
        }
        break;

      case 'downward-dog':
        // Inverted V position
        const shoulderHeight = (leftShoulder.y + rightShoulder.y) / 2;
        const hipHeight = (leftHip.y + rightHip.y) / 2;
        if (hipHeight < shoulderHeight) {
          phase = 'up'; // Good downward dog
        } else {
          phase = 'down'; // Poor position
          formScore -= 30;
        }
        break;

      case 'warrior-1':
      case 'warrior-2':
        // Warrior poses - check knee alignment
        if (leftKnee && rightKnee) {
          const leftKneeAngle = calculateAngle(leftHip, leftKnee, landmarks[27] || leftKnee);
          const rightKneeAngle = calculateAngle(rightHip, rightKnee, landmarks[28] || rightKnee);
          if (leftKneeAngle < 90 || rightKneeAngle < 90) {
            phase = 'up'; // Good warrior position
          } else {
            phase = 'down'; // Poor position
            formScore -= 25;
          }
        }
        break;

      case 'tree-pose':
        // Balance pose - check if one foot is lifted
        const leftAnkle = landmarks[27];
        const rightAnkle = landmarks[28];
        const leftFootLifted = leftAnkle && leftAnkle.y > leftKnee.y + 0.1;
        const rightFootLifted = rightAnkle && rightAnkle.y > rightKnee.y + 0.1;
        if (leftFootLifted || rightFootLifted) {
          phase = 'up'; // Good tree pose
        } else {
          phase = 'down'; // Not in tree pose
          formScore -= 40;
        }
        break;

      default:
        // Default yoga pose analysis
        phase = 'up';
        break;
    }

    return { phase, formScore: Math.max(formScore, 0), isPerforming };
  };

  const getExerciseCalorieRate = (exerciseType: string) => {
    switch (exerciseType) {
      // Upper Body Exercises
      case 'push-up': return 0.15;
      case 'pull-up': return 0.18;
      case 'dips': return 0.16;
      case 'burpees': return 0.25;
      
      // Lower Body Exercises
      case 'squat': return 0.12;
      case 'lunge': return 0.14;
      case 'jump-squat': return 0.20;
      case 'wall-sit': return 0.08;
      
      // Core Exercises
      case 'plank': return 0.08;
      case 'crunch': return 0.10;
      case 'mountain-climber': return 0.22;
      case 'russian-twist': return 0.12;
      
      // Posture Exercises
      case 'proper-sitting':
      case 'standing-posture': return 0.05;
      
      // Yoga Poses (from yoga dashboard)
      case 'mountain-pose': return 0.06;
      case 'downward-dog': return 0.10;
      case 'warrior-1': return 0.12;
      case 'warrior-2': return 0.12;
      case 'tree-pose': return 0.08;
      case 'child-pose': return 0.04;
      case 'cobra-pose': return 0.08;
      case 'bridge-pose': return 0.10;
      case 'triangle-pose': return 0.10;
      case 'pigeon-pose': return 0.08;
      case 'cat-cow-pose': return 0.06;
      case 'corpse-pose': return 0.02;
      
      default: return 0.1;
    }
  };

  // Exercise-specific rep counting and form analysis with improved stability
  const analyzeExerciseMovement = (landmarks: any[], exerciseType: string) => {
    if (!exerciseMode || !landmarks.length) return;

    const currentTime = Date.now();
    if (!exerciseStartTime) {
      setExerciseStartTime(currentTime);
    }

    const duration = Math.floor((currentTime - (exerciseStartTime || currentTime)) / 1000);
    setExerciseDuration(duration);

    // Analyze exercise-specific movement patterns
    let newPhase: 'up' | 'down' | 'rest' | 'ready' = 'ready';
    let formScore = 0;
    let isPerforming = false;

    // Exercise-specific analysis with improved accuracy
    // Upper Body Exercises
    if (exerciseType === 'push-up') {
      const analysis = analyzePushUpMovement(landmarks);
      newPhase = analysis.phase as 'up' | 'down' | 'rest' | 'ready';
      formScore = analysis.formScore;
      isPerforming = analysis.isPerforming;
    } else if (exerciseType === 'pull-up') {
      const analysis = analyzePushUpMovement(landmarks); // Similar analysis
      newPhase = analysis.phase as 'up' | 'down' | 'rest' | 'ready';
      formScore = analysis.formScore;
      isPerforming = analysis.isPerforming;
    } else if (exerciseType === 'dips') {
      const analysis = analyzePushUpMovement(landmarks); // Similar analysis
      newPhase = analysis.phase as 'up' | 'down' | 'rest' | 'ready';
      formScore = analysis.formScore;
      isPerforming = analysis.isPerforming;
    } else if (exerciseType === 'burpees') {
      const analysis = analyzeSquatMovement(landmarks); // Use squat analysis for main movement
      newPhase = analysis.phase as 'up' | 'down' | 'rest' | 'ready';
      formScore = analysis.formScore;
      isPerforming = analysis.isPerforming;
    }
    
    // Lower Body Exercises
    else if (exerciseType === 'squat') {
      const analysis = analyzeSquatMovement(landmarks);
      newPhase = analysis.phase as 'up' | 'down' | 'rest' | 'ready';
      formScore = analysis.formScore;
      isPerforming = analysis.isPerforming;
    } else if (exerciseType === 'lunge') {
      const analysis = analyzeLungeMovement(landmarks);
      newPhase = analysis.phase as 'up' | 'down' | 'rest' | 'ready';
      formScore = analysis.formScore;
      isPerforming = analysis.isPerforming;
    } else if (exerciseType === 'jump-squat') {
      const analysis = analyzeSquatMovement(landmarks); // Similar to squat
      newPhase = analysis.phase as 'up' | 'down' | 'rest' | 'ready';
      formScore = analysis.formScore;
      isPerforming = analysis.isPerforming;
    } else if (exerciseType === 'wall-sit') {
      const analysis = analyzePlankMovement(landmarks); // Isometric like plank
      newPhase = analysis.phase as 'up' | 'down' | 'rest' | 'ready';
      formScore = analysis.formScore;
      isPerforming = analysis.isPerforming;
    }
    
    // Core Exercises
    else if (exerciseType === 'plank') {
      const analysis = analyzePlankMovement(landmarks);
      newPhase = analysis.phase as 'up' | 'down' | 'rest' | 'ready';
      formScore = analysis.formScore;
      isPerforming = analysis.isPerforming;
    } else if (exerciseType === 'crunch') {
      const analysis = analyzePlankMovement(landmarks); // Similar core analysis
      newPhase = analysis.phase as 'up' | 'down' | 'rest' | 'ready';
      formScore = analysis.formScore;
      isPerforming = analysis.isPerforming;
    } else if (exerciseType === 'mountain-climber') {
      const analysis = analyzePlankMovement(landmarks); // Dynamic plank
      newPhase = analysis.phase as 'up' | 'down' | 'rest' | 'ready';
      formScore = analysis.formScore;
      isPerforming = analysis.isPerforming;
    } else if (exerciseType === 'russian-twist') {
      const analysis = analyzePlankMovement(landmarks); // Core rotation
      newPhase = analysis.phase as 'up' | 'down' | 'rest' | 'ready';
      formScore = analysis.formScore;
      isPerforming = analysis.isPerforming;
    }
    
    // Posture Exercises
    else if (exerciseType === 'proper-sitting' || exerciseType === 'standing-posture') {
      const analysis = analyzeSittingPosture(landmarks);
      newPhase = analysis.phase as 'up' | 'down' | 'rest' | 'ready';
      formScore = analysis.formScore;
      isPerforming = analysis.isPerforming;
    }
    
    // Yoga Poses (from yoga dashboard)
    else if (exerciseType === 'mountain-pose' || exerciseType === 'downward-dog' || 
             exerciseType === 'warrior-1' || exerciseType === 'warrior-2' || 
             exerciseType === 'tree-pose' || exerciseType === 'child-pose' || 
             exerciseType === 'cobra-pose' || exerciseType === 'bridge-pose' || 
             exerciseType === 'triangle-pose' || exerciseType === 'pigeon-pose' ||
             exerciseType === 'cat-cow-pose' || exerciseType === 'corpse-pose') {
      const analysis = analyzeYogaPose(landmarks, exerciseType);
      newPhase = analysis.phase as 'up' | 'down' | 'rest' | 'ready';
      formScore = analysis.formScore;
      isPerforming = analysis.isPerforming;
    }
    

    // Update exercise state with smooth transitions
    setIsPerformingExercise(isPerforming);
    setExercisePhase(newPhase);
    setExerciseFormScore(formScore);

    // Rep counting only for non-sitting exercises with proper down-then-up logic
    const isSittingExercise = exerciseType === 'plank' || exerciseType === 'sitting';
    
    // Count rep when transitioning from down to up (completing a full movement)
    if (!isSittingExercise && newPhase === 'up' && exercisePhase === 'down' && isPerforming) {
      setExerciseMetrics(prev => {
        const newReps = prev.reps + 1;
        const newAccuracy = Math.round((prev.accuracy * prev.reps + formScore) / newReps);
        const newSets = Math.floor(newReps / 10);
        
        return {
          ...prev,
          reps: newReps,
          sets: newSets,
          accuracy: newAccuracy
        };
      });
    }

    // Calculate calories based on exercise intensity and duration
    const calorieRate = getExerciseCalorieRate(exerciseType);
    const baseCalories = Math.floor(duration * calorieRate);
    const intensityMultiplier = isPerforming ? 1.5 : 1.0;
    const calories = Math.floor(baseCalories * intensityMultiplier);
    setExerciseCalories(calories);
  };

  // Video upload functions
  const handleVideoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('video/')) {
      setUploadedVideo(file);
      const url = URL.createObjectURL(file);
      setVideoUrl(url);
      setIsAnalyzing(false); // Stop live analysis
    }
  };

  const analyzeUploadedVideo = async () => {
    if (!uploadedVideo) return;

    setIsAnalyzing(true);
    setVideoAnalysisProgress(0);

    try {
      // Create video element to extract frames
      const video = document.createElement('video');
      video.src = videoUrl;
      video.crossOrigin = 'anonymous';
      
      await new Promise((resolve) => {
        video.onloadedmetadata = resolve;
      });

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Optimized analysis: Smart sampling based on mode
      const videoDuration = video.duration;
      const sampleInterval = analysisMode === 'fast' ? 3 : 1; // Fast: 3s, Detailed: 1s
      const totalSamples = Math.ceil(videoDuration / sampleInterval);
      let currentSample = 0;
      const analysisResults: any[] = [];

      console.log(`🎬 Starting optimized video analysis: ${totalSamples} samples from ${videoDuration.toFixed(1)}s video`);

      const analyzeSample = async () => {
        if (currentSample >= totalSamples) {
          // Analysis complete
          console.log('✅ Video analysis complete:', analysisResults);
          setVideoAnalysisProgress(100);
          setIsAnalyzing(false);
          
          // Display results summary
          const successfulAnalyses = analysisResults.filter(r => r.success);
          console.log(`📊 Analysis Summary: ${successfulAnalyses.length}/${totalSamples} samples analyzed successfully`);
          
          return;
        }

        const timestamp = currentSample * sampleInterval;
        video.currentTime = timestamp;
        
        await new Promise((resolve) => {
          video.onseeked = resolve;
        });

        // Optimize canvas size for faster processing
        const maxWidth = 640;
        const aspectRatio = video.videoWidth / video.videoHeight;
        
        if (video.videoWidth > maxWidth) {
          canvas.width = maxWidth;
          canvas.height = maxWidth / aspectRatio;
        } else {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
        }

        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Optimize image quality for faster processing
        const imageData = canvas.toDataURL('image/jpeg', 0.7);
        
        try {
          const response = await fetch(`${backendUrl}/api/analyze/realtime`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              image: imageData,
              exerciseType: exerciseType || 'general'
            })
          });

          if (response.ok) {
            const result = await response.json();
            analysisResults.push({
              sample: currentSample,
              timestamp: timestamp,
              duration: videoDuration,
              ...result
            });
            
            console.log(`📸 Sample ${currentSample + 1}/${totalSamples} analyzed at ${timestamp.toFixed(1)}s`);
          }
        } catch (error) {
          console.error('Frame analysis error:', error);
        }

        currentSample++;
        setVideoAnalysisProgress((currentSample / totalSamples) * 100);
        
        // Faster processing: No delay between samples
        setTimeout(analyzeSample, 50);
      };

      analyzeSample();
    } catch (error) {
      console.error('Video analysis error:', error);
      setIsAnalyzing(false);
    }
  };

  const resetVideoAnalysis = () => {
    setUploadedVideo(null);
    setVideoUrl('');
    setVideoAnalysisProgress(0);
    setIsAnalyzing(false);
  };

  // Backend connection check
  const checkBackendConnection = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/health`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (response.ok) {
        setIsConnected(true);
      } else {
        setIsConnected(false);
      }
    } catch (error) {
      setIsConnected(false);
    }
  };

  // Initialize backend connection
  useEffect(() => {
    checkBackendConnection();
    const interval = setInterval(checkBackendConnection, 5000);
    return () => clearInterval(interval);
  }, []);

  // Continuous drawing effect to prevent landmark blinking
  useEffect(() => {
    if (isAnalyzing && poseData.landmarks.length > 0) {
      const drawInterval = setInterval(() => {
        drawPoseOverlay(poseData.landmarks, poseData.score);
      }, 50); // Draw every 50ms for smooth display

      return () => clearInterval(drawInterval);
    }
  }, [isAnalyzing, poseData.landmarks, poseData.score]);

  // Keyboard shortcut for stopping analysis (Escape key)
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isAnalyzing) {
        toggleAnalysis();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isAnalyzing]);

  // Start camera with original dimensions
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          width: { ideal: 1280, max: 1920 },
          height: { ideal: 720, max: 1080 },
          frameRate: { ideal: 30, max: 60 }
        }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        
        // Wait for video to load and get actual dimensions
        videoRef.current.onloadedmetadata = () => {
          if (canvasRef.current && videoRef.current) {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            
            // Set canvas to match video dimensions
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            
            console.log(`Video dimensions: ${video.videoWidth}x${video.videoHeight}`);
            console.log(`Canvas dimensions: ${canvas.width}x${canvas.height}`);
          }
        };
      }
    } catch (error) {
      console.error('Failed to access camera:', error);
    }
  };

  // Stop camera
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  // Start real-time analysis with optimized performance
  const startRealTimeAnalysis = () => {
    if (analysisInterval) {
      clearInterval(analysisInterval);
    }

    let isProcessing = false; // Prevent overlapping requests

    const interval = setInterval(async () => {
      if (videoRef.current && canvasRef.current && isConnected && !isProcessing) {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const video = videoRef.current;

        if (ctx && video.videoWidth > 0 && video.videoHeight > 0) {
          isProcessing = true;
          
          try {
            // Draw video frame to canvas with original dimensions
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            
            // Convert canvas to base64 with optimized quality
            const imageData = canvas.toDataURL('image/jpeg', 0.8);
            
            const response = await fetch(`${backendUrl}/api/analyze/realtime`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ 
                image: imageData,
                exerciseType: exerciseType || 'general',
                timestamp: Date.now()
              })
            });

            if (response.ok) {
              const result = await response.json();
              
              if (result.success && result.analysis) {
                // Smooth landmarks to prevent blinking
                const smoothedLandmarks = smoothLandmarks(result.landmarks || []);
                
                // Update pose data with smooth transitions
                setPoseData(prev => ({
                  score: result.analysis.overall_score || prev.score,
                  deviations: result.analysis.deviations || prev.deviations,
                  feedback: result.analysis.feedback || prev.feedback,
                  landmarks: smoothedLandmarks
                }));

                // Exercise-specific analysis
                if (exerciseMode && exerciseType && smoothedLandmarks && smoothedLandmarks.length > 0) {
                  const validation = validateExercisePosition(smoothedLandmarks, exerciseType);
                  setPositionValidation(validation);
                  
                  // Only analyze movement if in valid position
                  if (validation.isValidPosition && validation.isCameraPositioned) {
                    analyzeExerciseMovement(smoothedLandmarks, exerciseType);
                  }
                }
              }
            }
          } catch (error) {
            console.error('Analysis error:', error);
          } finally {
            isProcessing = false;
          }
        }
      }
    }, 1000); // Increased interval to prevent landmark blinking

    setAnalysisInterval(interval);
  };

  // Stop real-time analysis
  const stopRealTimeAnalysis = () => {
    if (analysisInterval) {
      clearInterval(analysisInterval);
      setAnalysisInterval(null);
    }
  };

  // Toggle analysis
  const toggleAnalysis = () => {
    if (isAnalyzing) {
      setIsAnalyzing(false);
      stopCamera();
      stopRealTimeAnalysis();
    } else {
      setIsAnalyzing(true);
      startCamera();
      startRealTimeAnalysis();
    }
  };

  // Draw pose overlay with dynamic dimensions and anti-glitching measures
  const drawPoseOverlay = (landmarks: any[], score: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Use requestAnimationFrame for smooth rendering
    requestAnimationFrame(() => {
      ctx.save();

      // Clear canvas with smooth clearing
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Calculate dynamic font sizes based on canvas dimensions
      const baseFontSize = Math.max(12, canvas.width / 50);
      const largeFontSize = Math.max(24, canvas.width / 25);
      const mediumFontSize = Math.max(16, canvas.width / 35);

      // Draw position validation overlay only for specific issues
      if (exerciseMode && exerciseType) {
        // Only show red overlay for camera positioning issues or exercise mismatch
        if (!positionValidation.isCameraPositioned || 
            (!positionValidation.isValidPosition && positionValidation.positionMessage.includes('Get into'))) {
          
          // Red background overlay with smooth transition
          ctx.fillStyle = 'rgba(255, 0, 0, 0.2)';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          
          // Red text in center with dynamic sizing
          ctx.fillStyle = '#FF0000';
          ctx.font = `bold ${largeFontSize}px Arial`;
          ctx.textAlign = 'center';
          ctx.strokeStyle = '#FFFFFF';
          ctx.lineWidth = 2;
          ctx.strokeText(positionValidation.positionMessage, canvas.width / 2, canvas.height / 2 - 20);
          ctx.fillText(positionValidation.positionMessage, canvas.width / 2, canvas.height / 2 - 20);
          
          // Camera position message
          if (!positionValidation.isCameraPositioned) {
            ctx.font = `bold ${mediumFontSize}px Arial`;
            ctx.strokeText(positionValidation.cameraMessage, canvas.width / 2, canvas.height / 2 + 40);
            ctx.fillText(positionValidation.cameraMessage, canvas.width / 2, canvas.height / 2 + 40);
          }
        }
      }
      
      // Draw score indicator with dynamic sizing
      if (exerciseMode && isPerformingExercise) {
        ctx.fillStyle = '#4F46E5';
        ctx.fillRect(10, 10, 20, 20);
        ctx.fillStyle = '#FFFFFF';
        ctx.font = `bold ${baseFontSize}px Arial`;
        ctx.textAlign = 'left';
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 1;
        ctx.strokeText(`Form Score: ${Math.round(exerciseFormScore)}%`, 40, 25);
        ctx.fillText(`Form Score: ${Math.round(exerciseFormScore)}%`, 40, 25);
      } else if (!exerciseMode) {
        // Show posture score for general posture analysis
        ctx.fillStyle = '#4F46E5';
        ctx.fillRect(10, 10, 20, 20);
        ctx.fillStyle = '#FFFFFF';
        ctx.font = `bold ${baseFontSize}px Arial`;
        ctx.textAlign = 'left';
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 1;
        ctx.strokeText(`Score: ${Math.round(score)}%`, 40, 25);
        ctx.fillText(`Score: ${Math.round(score)}%`, 40, 25);
      }
      
      // Draw skeleton and landmarks with improved visibility
      if (landmarks && landmarks.length > 0) {
        const landmarkSize = Math.max(3, canvas.width / 150); // Smaller landmarks
        const textSize = Math.max(6, canvas.width / 120); // Smaller text
        
        // MediaPipe pose connections (skeleton structure)
        const poseConnections = [
          // Face
          [0, 1], [1, 2], [2, 3], [3, 7], [0, 4], [4, 5], [5, 6], [6, 8],
          // Torso
          [9, 10], [11, 12], [11, 13], [12, 14], [13, 15], [14, 16],
          [11, 23], [12, 24], [23, 24],
          // Left arm
          [11, 13], [13, 15], [15, 17], [15, 19], [15, 21], [17, 19], [19, 21],
          // Right arm
          [12, 14], [14, 16], [16, 18], [16, 20], [16, 22], [18, 20], [20, 22],
          // Left leg
          [23, 25], [25, 27], [27, 29], [27, 31], [29, 31],
          // Right leg
          [24, 26], [26, 28], [28, 30], [28, 32], [30, 32]
        ];
        
        // Draw skeleton lines first with exercise-specific highlighting
        const exerciseKeyLandmarks = exerciseMode ? getExerciseKeyLandmarks(exerciseType || '') : [];
        
        poseConnections.forEach(([startIdx, endIdx]) => {
          const startLandmark = landmarks[startIdx];
          const endLandmark = landmarks[endIdx];
          
          if (startLandmark && endLandmark && 
              startLandmark.visibility > 0.3 && endLandmark.visibility > 0.3) {
            const startX = startLandmark.x * canvas.width;
            const startY = startLandmark.y * canvas.height;
            const endX = endLandmark.x * canvas.width;
            const endY = endLandmark.y * canvas.height;
            
            // Highlight exercise-specific connections
            const isExerciseConnection = exerciseKeyLandmarks.includes(startIdx) && 
                                       exerciseKeyLandmarks.includes(endIdx);
            
            if (isExerciseConnection) {
              // Highlighted skeleton lines for exercise
              ctx.strokeStyle = '#FFD700'; // Gold color
              ctx.lineWidth = 3;
            } else {
              // Regular skeleton lines
              ctx.strokeStyle = '#00FF00'; // Green color
              ctx.lineWidth = 2;
            }
            
            ctx.beginPath();
            ctx.moveTo(startX, startY);
            ctx.lineTo(endX, endY);
            ctx.stroke();
          }
        });
        
        // Draw landmarks on top of skeleton with exercise-specific highlighting
        landmarks.forEach((landmark, index) => {
          if (landmark && landmark.visibility > 0.3) { // Lower threshold for better visibility
            const x = landmark.x * canvas.width;
            const y = landmark.y * canvas.height;
            
            // Check if this is an exercise-specific landmark
            const isExerciseLandmark = exerciseKeyLandmarks.includes(index);
            
            if (isExerciseLandmark) {
              // Highlighted landmarks for exercise
              ctx.fillStyle = '#FFD700'; // Gold color
              ctx.beginPath();
              ctx.arc(x, y, landmarkSize + 1, 0, 2 * Math.PI);
              ctx.fill();
              
              // Draw white outline for better visibility
              ctx.strokeStyle = '#FFFFFF';
              ctx.lineWidth = 2;
              ctx.stroke();
            } else {
              // Regular landmarks
              ctx.fillStyle = '#00FF00'; // Green color
              ctx.beginPath();
              ctx.arc(x, y, landmarkSize, 0, 2 * Math.PI);
              ctx.fill();
              
              // Draw white outline for better visibility
              ctx.strokeStyle = '#FFFFFF';
              ctx.lineWidth = 1;
              ctx.stroke();
            }
            
            // Draw landmark number with smaller text
            ctx.fillStyle = '#000000';
            ctx.font = `bold ${textSize}px Arial`;
            ctx.textAlign = 'center';
            ctx.strokeStyle = '#FFFFFF';
            ctx.lineWidth = 0.5;
            ctx.strokeText(index.toString(), x, y - landmarkSize - 1);
            ctx.fillText(index.toString(), x, y - landmarkSize - 1);
          }
        });
      }

      // Draw exercise metrics with dynamic sizing
      if (exerciseMode && exerciseType) {
        const metricsWidth = Math.min(250, canvas.width / 3);
        const metricsHeight = Math.min(150, canvas.height / 4);
        const metricsFontSize = Math.max(10, canvas.width / 60);
        const isSittingExercise = exerciseType === 'plank' || exerciseType === 'sitting';
        
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(5, canvas.height - metricsHeight - 5, metricsWidth, metricsHeight);
        
        ctx.fillStyle = '#FFFFFF';
        ctx.font = `bold ${metricsFontSize}px Arial`;
        ctx.textAlign = 'left';
        ctx.fillText(`Exercise: ${exerciseType.toUpperCase()}`, 10, canvas.height - metricsHeight + 15);
        
        // Only show reps and sets for non-sitting exercises
        if (!isSittingExercise) {
          ctx.fillText(`Reps: ${exerciseMetrics.reps}`, 10, canvas.height - metricsHeight + 30);
          ctx.fillText(`Sets: ${exerciseMetrics.sets}`, 10, canvas.height - metricsHeight + 45);
        }
        
        ctx.fillText(`Phase: ${exercisePhase.toUpperCase()}`, 10, canvas.height - metricsHeight + (isSittingExercise ? 30 : 60));
        ctx.fillText(`Accuracy: ${exerciseMetrics.accuracy}%`, 10, canvas.height - metricsHeight + (isSittingExercise ? 45 : 75));
        ctx.fillText(`Duration: ${Math.floor(exerciseDuration / 60)}:${(exerciseDuration % 60).toString().padStart(2, '0')}`, 10, canvas.height - metricsHeight + (isSittingExercise ? 60 : 90));
        ctx.fillText(`Calories: ${exerciseCalories}`, 10, canvas.height - metricsHeight + (isSittingExercise ? 75 : 105));
        
        // Status indicator
        ctx.fillStyle = isPerformingExercise ? '#00FF00' : '#FFA500';
        ctx.fillText(isPerformingExercise ? 'PERFORMING' : 'READY', 10, canvas.height - metricsHeight + (isSittingExercise ? 90 : 120));
      }

      ctx.restore();
    });
  };

  // Update pose data and draw overlay
  useEffect(() => {
    if (poseData.landmarks && poseData.landmarks.length > 0) {
      drawPoseOverlay(poseData.landmarks, poseData.score);
    }
  }, [poseData, exerciseMode, exerciseType, positionValidation, isPerformingExercise, exerciseFormScore, exerciseMetrics, exercisePhase, exerciseDuration, exerciseCalories]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-full mb-8">
            <Brain className="w-5 h-5" />
            <span className="font-semibold">AI Posture Analysis</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            {selectedExercise 
              ? `Analyzing: ${selectedExercise.name}` 
              : selectedPose 
                ? `Analyzing: ${selectedPose.name} (${selectedPose.sanskritName})`
                : 'Real-Time Posture Analysis'
            }
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {selectedExercise 
              ? `Get real-time feedback on your ${selectedExercise.name} form with AI-powered analysis`
              : selectedPose
                ? `Practice ${selectedPose.name} with AI-guided alignment and breathing cues`
                : 'Get instant feedback on your posture with advanced AI analysis'
            }
          </p>
        </div>

        {/* Analysis Panel */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
              <div className="relative">
          {/* Video Feed */}
            <div className="relative bg-black">
                <video
                  ref={videoRef}
                className="w-full h-auto object-cover"
                  playsInline
                  muted
                />
                <canvas
                  ref={canvasRef}
                className="absolute top-0 left-0 w-full h-full pointer-events-none"
              />
              
              {/* Overlay Controls */}
              <div className="absolute top-4 right-4 flex space-x-2">
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                  isConnected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {isConnected ? 'Connected' : 'Disconnected'}
                </div>
                
                {/* Stop Analysis Button */}
                {isAnalyzing && (
                    <button
                    onClick={toggleAnalysis}
                    className="flex items-center space-x-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-full text-sm font-medium transition-colors shadow-lg"
                  >
                    <Pause className="w-4 h-4" />
                    <span>Stop Analysis</span>
                    </button>
                )}
              </div>
              
              {/* Bottom Right Quick Stop Button */}
              {isAnalyzing && (
                <div className="absolute bottom-4 right-4">
                    <button
                      onClick={toggleAnalysis}
                    className="flex items-center space-x-2 px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-105 shadow-lg"
                  >
                    <Pause className="w-5 h-5" />
                    <span>Stop Analysis</span>
                    </button>
                  </div>
              )}
              
              {/* Analysis Status Overlay */}
                {isAnalyzing && (
                  <div className="absolute top-4 left-4">
                  <div className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-full shadow-lg">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium">AI Analysis Active</span>
                </div>
                  </div>
                )}
              </div>
              
            {/* Analysis Controls */}
            <div className="p-8">
              {/* Video Upload Section */}
              <div className="mb-8 p-6 bg-gray-50 rounded-2xl">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Target className="w-5 h-5 mr-2" />
                  Video Analysis Dashboard
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Video Upload */}
                  <div className="space-y-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Upload Video for Analysis
                    </label>
                    <input
                      type="file"
                      accept="video/*"
                      onChange={handleVideoUpload}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    
                    {uploadedVideo && (
                      <div className="mt-4 space-y-3">
                        <div className="p-4 bg-blue-50 rounded-lg">
                          <p className="text-sm text-blue-800">
                            <strong>Selected:</strong> {uploadedVideo.name}
                          </p>
                          <p className="text-xs text-blue-600">
                            Size: {(uploadedVideo.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                        
                        {/* Video Preview */}
              <div className="relative">
                <video
                            src={videoUrl}
                            className="w-full h-32 object-cover rounded-lg"
                            controls
                  muted
                          />
                          <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
                            Preview
                          </div>
                    </div>
                  </div>
                )}
              </div>

                  {/* Video Analysis Controls */}
                  <div className="space-y-4">
                    {/* Analysis Mode Selector */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Analysis Mode
                      </label>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setAnalysisMode('fast')}
                          className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                            analysisMode === 'fast'
                              ? 'bg-blue-500 text-white'
                              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          }`}
                        >
                          Fast (3s intervals)
                        </button>
                        <button
                          onClick={() => setAnalysisMode('detailed')}
                          className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                            analysisMode === 'detailed'
                              ? 'bg-blue-500 text-white'
                              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          }`}
                        >
                          Detailed (1s intervals)
                        </button>
            </div>
          </div>

                    <div className="flex space-x-3">
                      <button
                        onClick={analyzeUploadedVideo}
                        disabled={!uploadedVideo || isAnalyzing}
                        className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                      >
                        {isAnalyzing ? 'Analyzing...' : 'Analyze Video'}
                      </button>
                      
                      <button
                        onClick={resetVideoAnalysis}
                        className="px-4 py-2 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors"
                      >
                        Reset
                      </button>
              </div>
              
                    {isAnalyzing && (
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>Video Analysis Progress</span>
                          <span>{Math.round(videoAnalysisProgress)}%</span>
                </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div 
                            className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-300"
                            style={{ width: `${videoAnalysisProgress}%` }}
                          ></div>
                        </div>
                        <div className="text-xs text-gray-500 text-center">
                          {analysisMode === 'fast' 
                            ? 'Fast analysis: Sampling every 3 seconds' 
                            : 'Detailed analysis: Sampling every 1 second'
                          }
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-6 items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={toggleAnalysis}
                    className={`flex items-center space-x-3 px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 ${
                      isAnalyzing
                        ? 'bg-red-500 hover:bg-red-600 text-white shadow-lg'
                        : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg'
                    }`}
                    >
                      {isAnalyzing ? (
                        <>
                        <Pause className="w-6 h-6" />
                        <span>Stop Analysis</span>
                    </>
                  ) : (
                    <>
                        <Play className="w-6 h-6" />
                        <span>Start Analysis</span>
                    </>
                  )}
                    </button>
                    
                    {/* Analysis Status Indicator */}
                    {isAnalyzing && (
                      <div className="flex items-center space-x-2 px-4 py-2 bg-green-100 text-green-800 rounded-full">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-sm font-medium">Analysis Active</span>
                </div>
                    )}
            </div>

                {/* Status Display */}
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900 mb-2">
                    {exerciseMode && isPerformingExercise 
                      ? `Form Score: ${Math.round(exerciseFormScore)}%`
                      : `Posture Score: ${Math.round(poseData.score)}%`
                    }
              </div>
                  <div className="text-gray-600">
                    {exerciseMode && isPerformingExercise 
                      ? `Performing ${exerciseType.toUpperCase()} - ${exercisePhase.toUpperCase()}`
                      : poseData.feedback
                    }
            </div>
              </div>
            </div>

              {/* Exercise Metrics */}
              {exerciseMode && (
                <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-blue-50 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600">{exerciseMetrics.reps}</div>
                    <div className="text-sm text-gray-600">Reps</div>
                    </div>
                  <div className="bg-green-50 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">{exerciseMetrics.sets}</div>
                    <div className="text-sm text-gray-600">Sets</div>
                </div>
                  <div className="bg-purple-50 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-purple-600">{Math.floor(exerciseDuration / 60)}:{(exerciseDuration % 60).toString().padStart(2, '0')}</div>
                    <div className="text-sm text-gray-600">Duration</div>
              </div>
                  <div className="bg-orange-50 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-orange-600">{exerciseCalories}</div>
                    <div className="text-sm text-gray-600">Calories</div>
              </div>
                </div>
                  )}
                </div>
              </div>
            </div>

        {/* Exercise Instructions */}
            {selectedExercise && (
          <div className="mt-12 bg-white rounded-3xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Exercise Instructions</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Points</h3>
                <ul className="space-y-2">
                  {selectedExercise.keyPoints.map((point, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-600">{point}</span>
                    </li>
                  ))}
                </ul>
                </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Analysis</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Target className="w-5 h-5 text-blue-500" />
                    <span className="text-gray-600">Real-time form analysis</span>
              </div>
                  <div className="flex items-center space-x-3">
                    <Zap className="w-5 h-5 text-yellow-500" />
                    <span className="text-gray-600">Instant feedback</span>
          </div>
                  <div className="flex items-center space-x-3">
                    <Brain className="w-5 h-5 text-purple-500" />
                    <span className="text-gray-600">AI-powered coaching</span>
        </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
