import express, { Router } from 'express';
import toolboxRouter from './toolbox.route';
import { ROUTE_CONSTANTS } from '../constants';

const apiRoutes: Router = Router();

apiRoutes.use(ROUTE_CONSTANTS.TOOLS, toolboxRouter);
export default apiRoutes;
