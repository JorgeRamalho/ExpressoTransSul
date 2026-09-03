/** Prefixo correto para assets em /public (Vite base ./ no build / Live Server). */
export function assetUrl(path: string): string {
  const normalized = path.replace(/^\//, '');
  return `${import.meta.env.BASE_URL}${normalized}`;
}
