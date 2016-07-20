/**
 * Check whether an extension manifest has client side components
 * @private
 * @param manifest
 * @returns {boolean} true if client components
 */
export function manifestIsClient(manifest) {
  const hasRegion = (manifest.region === null || !!manifest.region);
  return hasRegion;
}

/**
 * Check whether an extension manifest has server side components
 * @private
 * @param manifest
 * @returns {boolean} true if server components
 */
export function manifestIsServer(manifest) {
  return !!manifest.router;
}
