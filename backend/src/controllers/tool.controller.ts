import ToolService from '../sevices/tool.service';
import { Request, Response } from 'express';
import { ToolCategory } from '../models/tool.schema';

class ToolController {
  private toolService: typeof ToolService;

  constructor() {
    this.toolService = ToolService;
  }
  /**
   *
   * @param {*} req
   * @param {*} res
   *
   * - /api/tools?category='Frontend'&popular=true&limit=10
   * - /api/tools?category='Frontend'&limit=10
   */
  getAllTools = async (req: Request, res: Response) => {
    try {
      const { category, popular, search, limit, skip, sort } = req.query;

      const filters: any = {};
      if (category && typeof category === 'string')
        filters.category = category as ToolCategory;
      if (popular === 'true') filters.isPopular = true;

      const options: any = {};
      if (limit && typeof limit === 'string') options.limit = parseInt(limit);
      if (skip && typeof skip === 'string') options.skip = parseInt(skip);
      if (sort && typeof sort === 'string') options.sort = { [sort]: 1 };

      let tools;

      if (search && typeof search === 'string') {
        tools = await this.toolService.searchTools(search);
      } else {
        tools = await this.toolService.getAllTools(filters, options);
      }

      res.status(200).json({
        success: true,
        count: tools.length,
        data: tools,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

  createTool = async (req: any, res: any) => {
    try {
      const toolData = req.body;

      const tool = await this.toolService.createTool(toolData);

      res.status(201).json({
        success: true,
        message: 'Tool created successfully',
        data: tool,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

  getToolById = async (req: any, res: any) => {
    try {
      const { id } = req.params;
      const tool = await this.toolService.getToolById(id);

      res.status(200).json({
        success: true,
        data: tool,
      });
    } catch (error: any) {
      const statusCode = error.message.includes('not found') ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        message: error.message,
      });
    }
  };

  createBulkTools = async (req: any, res: any) => {
    try {
      const { tools } = req.body;

      if (!Array.isArray(tools)) {
        return res.status(400).json({
          success: false,
          message: 'Tools should be an array',
        });
      }

      const results = await this.toolService.createBulkTools(tools);

      const statusCode = results.failed.length === 0 ? 201 : 207;

      res.status(statusCode).json({
        success: true,
        message: `Bulk operation completed. ${results.created.length} created, ${results.failed.length} failed`,
        data: results,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

  updateTool = async (req: any, res: any) => {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const tool = await this.toolService.updateTool(id, updateData);

      res.status(200).json({
        success: true,
        message: 'Tool updated successfully',
        data: tool,
      });
    } catch (error: any) {
      const statusCode = error.message.includes('not found')
        ? 404
        : error.message.includes('Validation failed')
          ? 400
          : 500;
      res.status(statusCode).json({
        success: false,
        message: error.message,
      });
    }
  };

  deleteTool = async (req: any, res: any) => {
    try {
      const { id } = req.params;
      const tool = await this.toolService.deleteTool(id);

      res.status(200).json({
        success: true,
        message: 'Tool deleted successfully',
        data: tool,
      });
    } catch (error: any) {
      const statusCode = error.message.includes('not found') ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        message: error.message,
      });
    }
  };

  deleteBulkTools = async (req: any, res: any) => {
    try {
      const { ids } = req.body;

      if (!Array.isArray(ids)) {
        return res.status(400).json({
          success: false,
          message: 'IDs should be an array',
        });
      }

      const results = await this.toolService.deleteBulkTools(ids);

      const statusCode = results.failed.length === 0 ? 200 : 207;

      res.status(statusCode).json({
        success: true,
        message: `Bulk deletion completed. ${results.deleted.length} deleted, ${results.failed.length} failed`,
        data: results,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

  getToolsByCategory = async (req: any, res: any) => {
    try {
      const { category } = req.params;
      const tools = await this.toolService.getToolsByCategory(category);

      res.status(200).json({
        success: true,
        count: tools.length,
        data: tools,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

  getPopularTools = async (req: any, res: any) => {
    try {
      const tools = await this.toolService.getPopularTools();

      res.status(200).json({
        success: true,
        count: tools.length,
        data: tools,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };
}

export default ToolController;
