"use client";

import { useEffect, useState } from "react";

export default function TimeAgo({ date }: { date: string | number | Date }) {
  const [text, setText] = useState<string>("");

  useEffect(() => {
    const createdAt = new Date(date);
    const update = () => {
      const now = new Date();
      const diffSeconds = Math.round(
        (now.getTime() - createdAt.getTime()) / 1000
      );
      if (diffSeconds < 60) return setText(`${diffSeconds} seconds ago`);
      const diffMinutes = Math.round(diffSeconds / 60);
      if (diffMinutes < 60) return setText(`${diffMinutes} mins ago`);
      const diffHours = Math.round(diffMinutes / 60);
      if (diffHours < 24) return setText(`${diffHours} hours ago`);
      const diffDays = Math.round(diffHours / 24);
      return setText(`${diffDays} days ago`);
    };
    update();
    const id = setInterval(update, 30000);
    return () => clearInterval(id);
  }, [date]);

  return <span>{text}</span>;
}
