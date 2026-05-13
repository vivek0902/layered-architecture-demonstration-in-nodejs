import express from 'express';
import ToolController from '../controllers/tool.controller';
import { TOOLS_ROUTES } from '../constants';
const router = express.Router();

const toolController = new ToolController();

// localhost:5000/api/tools/
router.get(TOOLS_ROUTES.ALL, toolController.getAllTools);

// localhost:5000/api/tools/popular
router.get(TOOLS_ROUTES.POPULAR, toolController.getPopularTools);

// localhost:5000/api/tools/category/frontend
router.get(TOOLS_ROUTES.CATEGORY, toolController.getToolsByCategory);

router.get(TOOLS_ROUTES.BY_ID, toolController.getToolById);

router.post(TOOLS_ROUTES.CREATE, toolController.createTool);

router.post(TOOLS_ROUTES.CREATE_BULK, toolController.createBulkTools);

router.put(TOOLS_ROUTES.UPDATE, toolController.updateTool);

router.delete(TOOLS_ROUTES.DELETE_BULK, toolController.deleteBulkTools);

router.delete(TOOLS_ROUTES.DELETE_BY_ID, toolController.deleteTool);

export default router;
