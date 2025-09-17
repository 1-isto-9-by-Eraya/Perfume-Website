"use client";
import { useEffect, useState } from "react";

export default function PublishedAt({ date }: { date: Date }) {
  const [formatted, setFormatted] = useState("");

  useEffect(() => {
    setFormatted(new Date(date).toLocaleString());
  }, [date]);

  return (
    <p className="mt-8 text-xs text-neutral-500">
      Published {formatted}
    </p>
  );
}
