export const generateId = (): string => {
  return String(Date.now()) + Math.floor(Math.random() * 10000);
};
