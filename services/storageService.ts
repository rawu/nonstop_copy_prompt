import { Prompt } from '../types';
import { DEFAULT_PROMPTS } from '../constants';

// Define the shape of the global chrome object for TypeScript
declare global {
  interface Window {
    chrome: any;
    browser: any;
  }
}

/**
 * Cross-browser storage service.
 * Chrome uses `chrome.storage.sync` (callback based).
 * Firefox supports `chrome.storage.sync` as well for WebExtensions, 
 * but `browser.storage.sync` (promise based) is the native preference.
 * 
 * To ensure maximum compatibility without external polyfills, 
 * we wrap the callback-based `chrome` API in Promises.
 */

const isExtension = () => {
  return typeof window !== 'undefined' && 
         (window.chrome?.storage || window.browser?.storage);
};

export const getPrompts = (): Promise<Prompt[]> => {
  return new Promise((resolve) => {
    if (!isExtension()) {
      // Fallback for local development (browser tab)
      const local = localStorage.getItem('myPrompts');
      return resolve(local ? JSON.parse(local) : DEFAULT_PROMPTS);
    }

    // Use chrome namespace which works in both Chrome and Firefox WebExtensions
    window.chrome.storage.sync.get(['myPrompts'], (result: any) => {
      if (window.chrome.runtime.lastError) {
        console.error(window.chrome.runtime.lastError);
        resolve(DEFAULT_PROMPTS);
        return;
      }
      
      if (!result || !result.myPrompts) {
        resolve(DEFAULT_PROMPTS);
      } else {
        resolve(result.myPrompts);
      }
    });
  });
};

export const savePrompts = (prompts: Prompt[]): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (!isExtension()) {
      localStorage.setItem('myPrompts', JSON.stringify(prompts));
      resolve();
      return;
    }

    window.chrome.storage.sync.set({ myPrompts: prompts }, () => {
      if (window.chrome.runtime.lastError) {
        reject(window.chrome.runtime.lastError);
      } else {
        resolve();
      }
    });
  });
};