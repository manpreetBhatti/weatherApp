export const range = (start: number, stop: number, step: number) => {
  return Array.from(
    { length: (stop - start) / step },
    (_, i) => start + i * step
  );
};

export const addOffSet = (date, offset) => {
  return new Date(date + 1000 * offset).toLocaleTimeString("en-US", {
    hour12: true,
    hour: "2-digit",
    minute: "2-digit",
    timezone: "America/New_York",
  });
};
