
"use client";

import { useEffect, useState } from "react";

interface ClockProps {
  showSeconds: boolean;
  format: "12" | "24";
}

export default function Clock({ showSeconds, format }: ClockProps) {
  const [time, setTime] = useState<Date | null>(null);

  useEffect(() => {
    const updateTime = () => {
      setTime(new Date());
    };

    updateTime();

    const interval = window.setInterval(updateTime, 1000);

    return () => window.clearInterval(interval);
  }, []);

  if (!time) {
    return (
      <div className="clock-section">
        <div className="clock-time">--:--</div>
        <div className="clock-date">Loading date...</div>
      </div>
    );
  }

  const timeString = time.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: showSeconds ? "2-digit" : undefined,
    hour12: format === "12",
  });

  const dateString = time.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="clock-section">
      <div className="clock-time">{timeString}</div>
      <div className="clock-date">{dateString}</div>
    </div>
  );
}
