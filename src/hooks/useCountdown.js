import { useEffect, useState } from 'react';

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

function splitDuration(ms) {
  const safe = Math.max(0, ms);
  return {
    days: Math.floor(safe / DAY),
    hours: Math.floor((safe % DAY) / HOUR),
    minutes: Math.floor((safe % HOUR) / MINUTE),
    seconds: Math.floor((safe % MINUTE) / SECOND),
    isOver: safe === 0,
  };
}

export function useCountdown(target) {
  const targetTime = target.getTime();
  const [remaining, setRemaining] = useState(() => splitDuration(targetTime - Date.now()));

  useEffect(() => {
    const tick = () => setRemaining(splitDuration(targetTime - Date.now()));
    tick();
    const id = setInterval(tick, SECOND);
    return () => clearInterval(id);
  }, [targetTime]);

  return remaining;
}
