export const convertMetersToKm = (meter: number): number => {
  if (meter < 0) {
    throw new Error('The value of meters cannot be negative.');
  }
  const kilometers = meter / 1000;
  return kilometers;
};
