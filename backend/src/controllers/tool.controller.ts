import { Request, Response } from 'express';
import { IToolDocument, ToolCategory } from '../models/tool.schema';
import ApiResponse from '../utils/apiResponse.util';
import { HTTP_STATUS, RESPONSE_MESSAGES } from '../constants';

type ToolCreateInput = {
  name: string;
  description: string;
  category: ToolCategory;
  url: string;
  isPopular?: boolean;
  tags?: string[];
};

type ToolUpdateInput = Partial<ToolCreateInput>;

interface ToolFilters extends Record<string, unknown> {
  category?: ToolCategory;
  isPopular?: boolean;
}

interface ToolQuery {
  category?: string;
  popular?: string;
  search?: string;
  limit?: string;
  skip?: string;
  sort?: string;
}

interface ToolQueryOptions {
  limit?: number;
  skip?: number;
  sort?: Record<string, 1 | -1>;
}

interface IToolServiceShape {
  createTool(toolData: ToolCreateInput): Promise<IToolDocument>;
  createBulkTools(toolsData: ToolCreateInput[]): Promise<any>;
  getAllTools(
    filters?: Record<string, unknown>,
    options?: ToolQueryOptions,
  ): Promise<IToolDocument[]>;
  getToolById(id: string): Promise<IToolDocument>;
  updateTool(id: string, updateData: ToolUpdateInput): Promise<IToolDocument>;
  deleteTool(id: string): Promise<IToolDocument>;
  deleteBulkTools(ids: string[]): Promise<any>;
  getToolsByCategory(category: ToolCategory): Promise<IToolDocument[]>;
  getPopularTools(): Promise<IToolDocument[]>;
  searchTools(query: string): Promise<IToolDocument[]>;
}

class ToolController<TService extends IToolServiceShape> {
  private toolService: TService;

  constructor(toolService: TService) {
    this.toolService = toolService;
  }

  /**
   *
   * @param {*} req
   * @param {*} res
   *
   * - /api/tools?category='Frontend'&popular=true&limit=10
   * - /api/tools?category='Frontend'&limit=10
   */
  getAllTools = async (req: Request<{}, {}, {}, ToolQuery>, res: Response) => {
    try {
      const { category, popular, search, limit, skip, sort } = req.query;

      const filters: ToolFilters = {};
      if (category && typeof category === 'string') {
        filters.category = category as ToolCategory;
      }
      if (popular === 'true') {
        filters.isPopular = true;
      }

      const options: ToolQueryOptions = {};
      if (limit && typeof limit === 'string') {
        options.limit = parseInt(limit, 10);
      }
      if (skip && typeof skip === 'string') {
        options.skip = parseInt(skip, 10);
      }
      if (sort && typeof sort === 'string') {
        options.sort = { [sort]: 1 };
      }

      let tools: IToolDocument[];

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
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      return ApiResponse.error(res, errorMessage);
    }
  };

  createTool = async (req: Request<{}, {}, ToolCreateInput>, res: Response) => {
    try {
      const toolData = req.body;

      const tool = await this.toolService.createTool(toolData);

      return ApiResponse.created(res, RESPONSE_MESSAGES.TOOL.CREATED, tool);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      return ApiResponse.error(res, errorMessage);
    }
  };

  getToolById = async (req: Request<{ id: string }>, res: Response) => {
    try {
      const { id } = req.params;
      const tool = await this.toolService.getToolById(id);

      return ApiResponse.success(res, RESPONSE_MESSAGES.TOOL.FETCHED, tool);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      const statusCode = errorMessage.includes('not found') ? 404 : 500;
      return ApiResponse.error(res, errorMessage, statusCode);
    }
  };

  createBulkTools = async (
    req: Request<{}, {}, { tools?: ToolCreateInput[] }>,
    res: Response,
  ) => {
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
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      return ApiResponse.error(res, errorMessage);
    }
  };

  updateTool = async (
    req: Request<{ id: string }, {}, ToolUpdateInput>,
    res: Response,
  ) => {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const tool = await this.toolService.updateTool(id, updateData);

      return ApiResponse.success(res, RESPONSE_MESSAGES.TOOL.UPDATED, tool);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      const statusCode = errorMessage.includes('not found')
        ? 404
        : errorMessage.includes('Validation failed')
          ? 400
          : 500;
      return ApiResponse.error(res, errorMessage, statusCode);
    }
  };

  deleteTool = async (req: Request<{ id: string }>, res: Response) => {
    try {
      const { id } = req.params;
      const tool = await this.toolService.deleteTool(id);

      return ApiResponse.success(res, RESPONSE_MESSAGES.TOOL.DELETED, tool);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      const statusCode = errorMessage.includes('not found') ? 404 : 500;
      return ApiResponse.error(res, errorMessage, statusCode);
    }
  };

  deleteBulkTools = async (
    req: Request<{}, {}, { ids?: string[] }>,
    res: Response,
  ) => {
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
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      return ApiResponse.error(res, errorMessage);
    }
  };

  getToolsByCategory = async (
    req: Request<{ category: string }>,
    res: Response,
  ) => {
    try {
      const { category } = req.params;
      const tools = await this.toolService.getToolsByCategory(
        category as ToolCategory,
      );

      return ApiResponse.success(
        res,
        RESPONSE_MESSAGES.TOOL.FETCHED,
        tools,
        HTTP_STATUS.OK,
        {
          count: tools.length,
        },
      );
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      return ApiResponse.error(res, errorMessage);
    }
  };

  getPopularTools = async (req: Request, res: Response) => {
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
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      return ApiResponse.error(res, errorMessage);
    }
  };
}

export default ToolController;
