import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Function to write/set localStorage value
export const writeLocalStorage = (key, value) => {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Error writing to localStorage key "${key}":`, error);
    return false;
  }
};

// Function to read/get localStorage value
export const readLocalStorage = (key, defaultValue = null) => {
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading from localStorage key "${key}":`, error);
    return defaultValue;
  }
};

// Function to remove localStorage value
export const removeLocalStorage = (key) => {
  try {
    window.localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing localStorage key "${key}":`, error);
    return false;
  }
};

// Function to check if key exists in localStorage
export const hasLocalStorage = (key) => {
  try {
    return window.localStorage.getItem(key) !== null;
  } catch (error) {
    console.error(`Error checking localStorage key "${key}":`, error);
    return false;
  }
};

// Function to clear all localStorage
export const clearLocalStorage = () => {
  try {
    window.localStorage.clear();
    return true;
  } catch (error) {
    console.error('Error clearing localStorage:', error);
    return false;
  }
};

// // Example usage
// const examples = () => {
//   // Write different types of data
//   writeLocalStorage('username', 'john_doe');
//   writeLocalStorage('userSettings', { theme: 'dark', notifications: true });
//   writeLocalStorage('todos', ['Task 1', 'Task 2', 'Task 3']);
//   writeLocalStorage('isLoggedIn', true);
//   writeLocalStorage('score', 1250);

//   // Read data back
//   const username = readLocalStorage('username'); // 'john_doe'
//   const settings = readLocalStorage('userSettings'); // { theme: 'dark', notifications: true }
//   const todos = readLocalStorage('todos'); // ['Task 1', 'Task 2', 'Task 3']
//   const isLoggedIn = readLocalStorage('isLoggedIn'); // true
//   const score = readLocalStorage('score'); // 1250
//   const nonExistent = readLocalStorage('doesNotExist', 'default'); // 'default'

//   // Check if key exists
//   const userExists = hasLocalStorage('username'); // true
//   const profileExists = hasLocalStorage('profile'); // false

//   // Remove specific key
//   removeLocalStorage('username');

//   // Clear all localStorage
//   clearLocalStorage();
// };