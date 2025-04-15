import { useEffect, useState } from "react";

export default function Timer() {
  const [timeLeft, setTimeLeft] = useState({});

  useEffect(() => {
    const targetDate = new Date("2025-04-20T00:00:00");

    const updateTimer = () => {
      const now = new Date();
      const difference = targetDate - now;

      if (difference <= 0) {
        setTimeLeft({ expired: true });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    updateTimer(); // initial call
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, []);

  if (timeLeft.expired) {
    return <div className="text-xl font-bold">Timer Expired!</div>;
  }

  return (
    <div style={{
    fontSize: "1.5rem",
    fontWeight: "bold",
    textAlign: "center", 
    marginBottom: "1rem"
    }}>
      <p>
        <span style={{
    fontSize: "1rem",
    fontWeight: "100"
    }}>Live  on 20 April</span><br></br>
        <span style={{"color": "#85dadc"}}>{timeLeft.days}</span>d <span style={{"color": "#85dadc"}}>{timeLeft.hours}</span>h <span style={{"color": "#85dadc"}}>{timeLeft.minutes}</span>m <span style={{"color": "#85dadc"}}>{timeLeft.seconds}</span>s
        
      </p>
    </div>
  );
}