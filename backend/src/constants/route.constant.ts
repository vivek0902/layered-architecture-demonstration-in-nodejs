/**
 * Route Constants
 * Centralized definitions for all API route paths
 */

export const ROUTE_CONSTANTS = Object.freeze({
  TOOLS: '/tools',
});

export const TOOLS_ROUTES = Object.freeze({
  ALL: '/',
  POPULAR: '/popular',
  CATEGORY: '/category/:category',
  BY_ID: '/:id',
  CREATE: '/create',
  CREATE_BULK: '/create/bulk',
  UPDATE: '/:id',
  DELETE_BULK: '/delete/bulk',
  DELETE_BY_ID: '/delete/:id',
});
