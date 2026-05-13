import { Request, Response } from 'express';
import ToolService from '../sevices/tool.service';
import { ToolCategory } from '../models/tool.schema';
import ApiResponse from '../utils/apiResponse.util';
import { HTTP_STATUS, RESPONSE_MESSAGES } from '../constants';

class ToolController {
  private toolService: any;

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

      return ApiResponse.success(
        res,
        RESPONSE_MESSAGES.TOOL.FETCHED,
        tools,
        HTTP_STATUS.OK,
        {
          count: tools.length,
        },
      );
    } catch (error: any) {
      return ApiResponse.error(res, error.message);
    }
  };

  createTool = async (req: any, res: any) => {
    try {
      const toolData = req.body;

      const tool = await this.toolService.createTool(toolData);

      return ApiResponse.created(res, RESPONSE_MESSAGES.TOOL.CREATED, tool);
    } catch (error: any) {
      return ApiResponse.error(res, error.message);
    }
  };

  getToolById = async (req: any, res: any) => {
    try {
      const { id } = req.params;
      const tool = await this.toolService.getToolById(id);

      return ApiResponse.success(res, RESPONSE_MESSAGES.TOOL.FETCHED, tool);
    } catch (error: any) {
      const statusCode = error.message.includes('not found') ? 404 : 500;
      return ApiResponse.error(res, error.message, statusCode);
    }
  };

  createBulkTools = async (req: any, res: any) => {
    try {
      const { tools } = req.body;

      if (!Array.isArray(tools)) {
        return ApiResponse.badRequest(
          res,
          RESPONSE_MESSAGES.ERROR.ARRAY_REQUIRED,
        );
      }

      const results = await this.toolService.createBulkTools(tools);

      const statusCode = results.failed.length === 0 ? 201 : 207;

      return ApiResponse.success(
        res,
        `${RESPONSE_MESSAGES.TOOL.BULK_CREATED}: ${results.created.length} created, ${results.failed.length} failed`,
        results,
        statusCode,
      );
    } catch (error: any) {
      return ApiResponse.error(res, error.message);
    }
  };

  updateTool = async (req: any, res: any) => {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const tool = await this.toolService.updateTool(id, updateData);

      return ApiResponse.success(res, RESPONSE_MESSAGES.TOOL.UPDATED, tool);
    } catch (error: any) {
      const statusCode = error.message.includes('not found')
        ? 404
        : error.message.includes('Validation failed')
          ? 400
          : 500;
      return ApiResponse.error(res, error.message, statusCode);
    }
  };

  deleteTool = async (req: any, res: any) => {
    try {
      const { id } = req.params;
      const tool = await this.toolService.deleteTool(id);

      return ApiResponse.success(res, RESPONSE_MESSAGES.TOOL.DELETED, tool);
    } catch (error: any) {
      const statusCode = error.message.includes('not found') ? 404 : 500;
      return ApiResponse.error(res, error.message, statusCode);
    }
  };

  deleteBulkTools = async (req: any, res: any) => {
    try {
      const { ids } = req.body;

      if (!Array.isArray(ids)) {
        return ApiResponse.badRequest(
          res,
          RESPONSE_MESSAGES.ERROR.ARRAY_REQUIRED,
        );
      }

      const results = await this.toolService.deleteBulkTools(ids);

      const statusCode = results.failed.length === 0 ? 200 : 207;

      return ApiResponse.success(
        res,
        `${RESPONSE_MESSAGES.TOOL.BULK_DELETED}: ${results.deleted.length} deleted, ${results.failed.length} failed`,
        results,
        statusCode,
      );
    } catch (error: any) {
      return ApiResponse.error(res, error.message);
    }
  };

  getToolsByCategory = async (req: any, res: any) => {
    try {
      const { category } = req.params;
      const tools = await this.toolService.getToolsByCategory(category);

      return ApiResponse.success(
        res,
        RESPONSE_MESSAGES.TOOL.FETCHED,
        tools,
        HTTP_STATUS.OK,
        {
          count: tools.length,
        },
      );
    } catch (error: any) {
      return ApiResponse.error(res, error.message);
    }
  };

  getPopularTools = async (req: any, res: any) => {
    try {
      const tools = await this.toolService.getPopularTools();

      return ApiResponse.success(
        res,
        RESPONSE_MESSAGES.TOOL.FETCHED,
        tools,
        HTTP_STATUS.OK,
        {
          count: tools.length,
        },
      );
    } catch (error: any) {
      return ApiResponse.error(res, error.message);
    }
  };
}

export default ToolController;
