export const normalize = (value = '') => String(value)
  .normalize('NFD')
  .replace(/[̀-ͯ]/g, '')
  .toLowerCase()
  .trim();

export const formatDate = (value) => new Date(value).toLocaleDateString('pt-BR');
export const formatDateTime = (value) => new Date(value).toLocaleString('pt-BR');
export const formatRating = (value) => Number(value || 0).toFixed(1).replace('.', ',');
