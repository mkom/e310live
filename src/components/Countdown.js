import { useState, useEffect } from "react";
import { Typography } from "@material-tailwind/react";

const Countdown = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft(targetDate));

  useEffect(() => {
    const timer = setInterval(() => {
      const updatedTimeLeft = getTimeLeft(targetDate);
      setTimeLeft(updatedTimeLeft);

      // Refresh the page when the countdown reaches zero
      if (updatedTimeLeft.days === 0 && updatedTimeLeft.hours === 0 && updatedTimeLeft.minutes === 0 && updatedTimeLeft.seconds === 0) {
        window.location.reload();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  function getTimeLeft(targetDate) {
    const now = new Date().getTime();
    const distance = targetDate - now;

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    return { days, hours, minutes, seconds };
  }

  return (
    <Typography variant="h6" color="blue-gray">
      {`${timeLeft.days}d ${timeLeft.hours}h ${timeLeft.minutes}m ${timeLeft.seconds}s`}
    </Typography>
  );
};

export default Countdown;
