export const MAX_FOCUS = 30000;
export const DAILY_GAIN = 10000;

export interface FocusCalculation {
  current: number;
  target: number;
  remaining: number;
  hoursNeeded: number;
  minutesNeeded: number;
  totalMinutes: number;
  completionDate: Date | null;
  progressPercent: number;
}

export function calculateFocus(
  currentFocus: number,
  targetFocus: number = MAX_FOCUS,
  dailyGain: number = DAILY_GAIN
): FocusCalculation {
  const remaining = Math.max(0, targetFocus - currentFocus);
  // const daysNeeded = remaining > 0 ? Math.ceil(remaining / dailyGain) : 0;
  const focusPerHour = dailyGain / 24;
  
  const totalHours = remaining > 0 ? remaining / focusPerHour : 0;


// Pisahkan jam dan menit
const hoursNeeded = Math.floor(totalHours);
const minutesNeeded = Math.floor((totalHours - hoursNeeded) * 60);
const totalMinutes = Math.ceil(totalHours * 60);

  const completionDate = totalMinutes > 0 
    ? new Date(Date.now() + totalMinutes * 24 * 60 * 60 * 1000)
    : null;

  const progressPercent = targetFocus > 0 
    ? Math.min(100, (currentFocus / targetFocus) * 100)
    : 0;

  return {
    current: currentFocus,
    target: targetFocus,
    remaining,
    hoursNeeded,minutesNeeded,totalMinutes,
    completionDate,
    progressPercent,
  };
}