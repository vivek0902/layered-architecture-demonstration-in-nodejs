import express from 'express';
import ToolController from '../controllers/tool.controller';
import ToolService from '../services/tool.service';
import ToolRepository from '../repository/tool.repository';
import { TOOLS_ROUTES } from '../constants';
import {
  validateToolCreation,
  validateToolUpdate,
  validateToolId,
  validateBulkDelete,
  validateBulkCreate,
} from '../middleware/validate.middleware';

const router = express.Router();

const toolRepository = new ToolRepository();
const toolService = new ToolService<ToolRepository>(toolRepository);
const toolController = new ToolController<ToolService<ToolRepository>>(
  toolService,
);

// GET Routes
router.get(TOOLS_ROUTES.ALL, toolController.getAllTools);
router.get(TOOLS_ROUTES.POPULAR, toolController.getPopularTools);
router.get(TOOLS_ROUTES.CATEGORY, toolController.getToolsByCategory);
router.get(TOOLS_ROUTES.BY_ID, toolController.getToolById);

// POST Routes
router.post(
  TOOLS_ROUTES.CREATE,
  validateToolCreation,
  toolController.createTool,
);
router.post(
  TOOLS_ROUTES.CREATE_BULK,
  validateBulkCreate,
  toolController.createBulkTools,
);

// PUT Routes
router.put(
  TOOLS_ROUTES.UPDATE,
  validateToolId,
  validateToolUpdate,
  toolController.updateTool,
);

// DELETE Routes
router.delete(
  TOOLS_ROUTES.DELETE_BULK,
  validateBulkDelete,
  toolController.deleteBulkTools,
);
router.delete(
  TOOLS_ROUTES.DELETE_BY_ID,
  validateToolId,
  toolController.deleteTool,
);

export default router;
