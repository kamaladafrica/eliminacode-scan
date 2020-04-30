export const minutiToText = (min: number): string => {
  const h = Math.floor(min / 60);
  const m = Math.ceil(min % 60);
  let res = '';
  if (h) {
    res += `${h} ${h === 1 ? 'ora' : 'ore'} e `;
  }
  res += `${m} ${m === 1 ? 'minuto' : 'minuti'}`;
  return res;
};

export const getPosizione = (progressivo: number, fila: number[]) =>
  fila.indexOf(progressivo);

export const toDataURL = (blob: Blob) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => resolve(reader.result as string);
    reader.readAsDataURL(blob);
  });
