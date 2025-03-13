// helpers/time.ts
export const addMinutesToTimeString = (
  timeString: string,
  minutes: number,
): string => {
  if (!minutes) return timeString;

  // แยก hours และ minutes
  const [hours, mins] = timeString.split(":").map(Number);

  // คำนวณเวลาใหม่
  const totalMinutes = hours * 60 + mins + minutes;
  const newHours = Math.floor(totalMinutes / 60) % 24;
  const newMinutes = totalMinutes % 60;

  // format กลับเป็น "HH:mm"
  return `${String(newHours).padStart(2, "0")}:${String(newMinutes).padStart(2, "0")}`;
};

export const calculateTimeDifferenceInMinutes = (
  time1: string,
  time2: string,
): number => {
  const [h1, m1] = time1.split(":").map(Number);
  const [h2, m2] = time2.split(":").map(Number);

  return h2 * 60 + m2 - (h1 * 60 + m1);
};
