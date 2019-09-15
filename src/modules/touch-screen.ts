function detect(): boolean {
  if (typeof window !== 'undefined') {
    return Boolean(
      'ontouchstart' in window ||
        window.navigator.maxTouchPoints > 0 ||
        window.navigator.msMaxTouchPoints > 0
    );
  }
  return false;
}

export { detect };
