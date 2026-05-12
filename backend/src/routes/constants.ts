/**
 * Route Constants
 * Centralized definitions for all API route paths
 */

export const ROUTE_CONSTANTS = {
  TOOLBOX: '/tools',
};

export const TOOLBOX_ROUTES = {
  ALL: '/',
  POPULAR: '/popular',
  CATEGORY: '/category/:category',
  BY_ID: '/:id',
  CREATE: '/create',
  CREATE_BULK: '/create/bulk',
  UPDATE: '/:id',
  DELETE_BULK: '/delete/bulk',
  DELETE_BY_ID: '/delete/:id',
};
