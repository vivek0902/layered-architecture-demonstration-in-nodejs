import express from 'express';
import ToolController from '../controllers/tool.controller';
import { TOOLBOX_ROUTES } from './constants';
const router = express.Router();

const toolController = new ToolController();

// localhost:5000/api/tools/
router.get(TOOLBOX_ROUTES.ALL, toolController.getAllTools);

// localhost:5000/api/tools/popular
router.get(TOOLBOX_ROUTES.POPULAR, toolController.getPopularTools);

// localhost:5000/api/tools/category/frontend
router.get(TOOLBOX_ROUTES.CATEGORY, toolController.getToolsByCategory);

router.get(TOOLBOX_ROUTES.BY_ID, toolController.getToolById);

router.post(TOOLBOX_ROUTES.CREATE, toolController.createTool);

router.post(TOOLBOX_ROUTES.CREATE_BULK, toolController.createBulkTools);

router.put(TOOLBOX_ROUTES.UPDATE, toolController.updateTool);

router.delete(TOOLBOX_ROUTES.DELETE_BULK, toolController.deleteBulkTools);

router.delete(TOOLBOX_ROUTES.DELETE_BY_ID, toolController.deleteTool);

export default router;
