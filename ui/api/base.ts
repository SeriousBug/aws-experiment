export const API_URL: string = (() => {
  const url = process.env.API_URL;
  if (!url) throw "API_URL missing, check .env.local";
  return url;
})();
