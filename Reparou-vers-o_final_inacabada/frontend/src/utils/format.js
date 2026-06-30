export const normalize = (value = '') => String(value)
  .normalize('NFD')
  .replace(/[̀-ͯ]/g, '')
  .toLowerCase()
  .trim();

export const formatDate = (value) => new Date(value).toLocaleDateString('pt-BR');
export const formatDateTime = (value) => new Date(value).toLocaleString('pt-BR');
export const formatRating = (value) => Number(value || 0).toFixed(1).replace('.', ',');


export const formatPhoneBR = (value = '') => {
  const digits = String(value).replace(/\D/g, '').slice(0, 11);

  if (digits.length <= 2) return digits;
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
};
