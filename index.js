import { createNavigator } from './app/navigation/index.js';
import { mergeSettings } from './app/settings/index.js';

export function createApp(options = {}) {
  return {
    navigator: createNavigator(options.initialScreen),
    settings: mergeSettings(options.settings)
  };
}
