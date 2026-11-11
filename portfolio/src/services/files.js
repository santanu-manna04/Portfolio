export const fileUrl = (path) => {
  if (!path) return '';
  const value = String(path);
  if (/^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(value)) return value;
  return `${import.meta.env.BASE_URL}${value.replace(/^\/+/, '')}`;
};
