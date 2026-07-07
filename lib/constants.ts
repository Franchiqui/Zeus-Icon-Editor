export const APP_NAME = 'ZeusIcon Editor';
export const APP_VERSION = '1.0.0';

export const CANVAS = {
  GRID_SIZE: 20,
  DOT_RADIUS: 2,
  DOT_COLOR: '#ffffff',
  DOT_OPACITY: 0.3,
  BACKGROUND_COLOR: '#1a1a2e',
  SNAP_DISTANCE: 10,
  MIN_ZOOM: 0.1,
  MAX_ZOOM: 5,
  ZOOM_STEP: 0.1,
  DEFAULT_ZOOM: 1,
} as const;

export const TOOLS = {
  LINE: 'line',
  CURVE: 'curve',
  SELECT: 'select',
  ERASER: 'eraser',
  HAND: 'hand',
  ZOOM_IN: 'zoom-in',
  ZOOM_OUT: 'zoom-out',
} as const;

export const COLORS = {
  PRIMARY: '#6366f1',
  SECONDARY: '#8b5cf6',
  SUCCESS: '#22c55e',
  DANGER: '#ef4444',
  WARNING: '#f59e0b',
  INFO: '#3b82f6',
  DARK: '#1a1a2e',
  LIGHT: '#f8fafc',
  WHITE: '#ffffff',
  BLACK: '#000000',
  TRANSPARENT: 'transparent',
} as const;

export const FILL_TYPES = {
  SOLID: 'solid',
  GRADIENT: 'gradient',
  NONE: 'none',
} as const;

export const GRADIENT_DIRECTIONS = {
  TOP_BOTTOM: 'to bottom',
  LEFT_RIGHT: 'to right',
  TOP_LEFT_BOTTOM_RIGHT: 'to bottom right',
  BOTTOM_LEFT_TOP_RIGHT: 'to top right',
} as const;

export const STORAGE_KEYS = {
  ICONS: 'icons',
  SETTINGS: 'settings',
  RECENT_FILES: 'recent-files',
} as const;

export const API = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8090',
  ENDPOINTS: {
    ICONS: '/api/icons',
    ICON_BY_ID: (id: string) => `/api/icons/${id}`,
    UPLOAD: '/api/upload',
    EXPORT: '/api/export',
  },
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
} as const;

export const FILE = {
  MAX_SIZE: 5 * 1024 * 1024,
  ACCEPTED_TYPES: ['image/png', 'image/svg+xml'],
  EXPORT_FORMAT: 'png',
  EXPORT_QUALITY: 1,
} as const;

export const ZOOM = {
  MIN: 0.1,
  MAX: 5,
  STEP: 0.1,
  DEFAULT: 1,
  ANIMATION_DURATION: 200,
} as const;

export const GRID = {
  SIZE: 20,
  VISIBLE: true,
  SNAP: true,
  COLOR: 'rgba(255, 255, 255, 0.1)',
  LINE_WIDTH: 1,
} as const;

export const SHORTCUTS = {
  UNDO: 'ctrl+z',
  REDO: 'ctrl+shift+z',
  COPY: 'ctrl+c',
  PASTE: 'ctrl+v',
  CUT: 'ctrl+x',
  DELETE: 'delete',
  SELECT_ALL: 'ctrl+a',
  ZOOM_IN: 'ctrl+=',
  ZOOM_OUT: 'ctrl+-',
  RESET_ZOOM: 'ctrl+0',
  SAVE: 'ctrl+s',
  EXPORT: 'ctrl+e',
} as const;

export const ANIMATION = {
  DURATION: 300,
  EASING: 'ease-in-out',
  SPRING: {
    stiffness: 300,
    damping: 30,
  },
} as const;

export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

export const THEME = {
  DARK: 'dark',
  LIGHT: 'light',
  SYSTEM: 'system',
} as const;

export const ERROR_MESSAGES = {
  FILE_TOO_LARGE: 'File size exceeds maximum limit',
  INVALID_FILE_TYPE: 'Invalid file type',
  UPLOAD_FAILED: 'Failed to upload file',
  SAVE_FAILED: 'Failed to save icon',
  LOAD_FAILED: 'Failed to load icon',
  EXPORT_FAILED: 'Failed to export icon',
  NETWORK_ERROR: 'Network error occurred',
  UNKNOWN_ERROR: 'An unknown error occurred',
} as const;

export const SUCCESS_MESSAGES = {
  ICON_SAVED: 'Icon saved successfully',
  ICON_EXPORTED: 'Icon exported successfully',
  ICON_DELETED: 'Icon deleted successfully',
  FILE_UPLOADED: 'File uploaded successfully',
} as const;

export const POCKETBASE = {
  COLLECTIONS: {
    ICONS: 'icons',
    USERS: 'users',
    SETTINGS: 'settings',
  },
  FIELDS: {
    ICONS: {
      TITLE: 'title',
      DESCRIPTION: 'description',
      DATA: 'data',
      PNG: 'png',
      CREATED: 'created',
      UPDATED: 'updated',
    },
  },
} as const;

export const DEFAULT_ICON_SIZE = 512;
export const DEFAULT_ICON_TITLE = 'Untitled Icon';
export const DEFAULT_ICON_DESCRIPTION = '';
export const MAX_ICON_TITLE_LENGTH = 100;
export const MAX_ICON_DESCRIPTION_LENGTH = 500;
export const MAX_RECENT_FILES = 10;
export const DEBOUNCE_DELAY = 300;
export const THROTTLE_DELAY = 100;