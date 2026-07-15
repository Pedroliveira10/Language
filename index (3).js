export const screens = Object.freeze({
  HOME: 'home',
  COURSE: 'course',
  EXERCISE: 'exercise',
  RESULTS: 'results',
  SETTINGS: 'settings'
});

export function createNavigator(initialScreen = screens.HOME) {
  let current = initialScreen;
  const listeners = new Set();

  return {
    get current() {
      return current;
    },
    go(screen, detail = {}) {
      if (!Object.values(screens).includes(screen)) {
        throw new RangeError(`Unknown screen: ${screen}`);
      }
      current = screen;
      listeners.forEach((listener) => listener({ screen, detail }));
    },
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    }
  };
}

