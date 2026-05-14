import { IToolDocument, ToolCategory } from '../models/tool.schema';

type ToolCreateInput = {
  name: string;
  description: string;
  category: ToolCategory;
  url: string;
  isPopular?: boolean;
  tags?: string[];
};

type ToolUpdateInput = Partial<ToolCreateInput>;

type ToolQueryOptions = {
  limit?: number;
  skip?: number;
  sort?: Record<string, 1 | -1>;
};

type BulkCreateFailure = {
  data: ToolCreateInput;
  error: string;
};

type BulkDeleteFailure = {
  id: string;
  error: string;
};

type BulkCreateResult = {
  created: IToolDocument[];
  failed: BulkCreateFailure[];
  total: number;
};

type BulkDeleteResult = {
  deleted: IToolDocument[];
  failed: BulkDeleteFailure[];
  total: number;
};

const getErrorMessage = (error: unknown): string =>
  error instanceof Error ? error.message : 'Unknown error';

const getValidationMessages = (error: unknown): string[] => {
  if (
    typeof error === 'object' &&
    error !== null &&
    'name' in error &&
    (error as { name?: string }).name === 'ValidationError' &&
    'errors' in error &&
    typeof (error as { errors?: unknown }).errors === 'object' &&
    (error as { errors?: unknown }).errors !== null
  ) {
    const validationError = error as {
      errors: Record<string, { message?: string }>;
    };

    return Object.values(validationError.errors).map(
      (validationItem) => validationItem.message ?? 'Invalid value',
    );
  }

  return [];
};

interface IToolRepositoryShape {
  findByName(name: string): Promise<any>;
  findAll(
    filters: Record<string, unknown>,
    options: ToolQueryOptions,
  ): Promise<any>;
  findById(id: string): Promise<any>;
  updateById(id: string, updateData: Record<string, unknown>): Promise<any>;
  deleteById(id: string): Promise<any>;
  create(data: ToolCreateInput): Promise<any>;
  findByCategory(category: ToolCategory): Promise<any>;
  findPopular(): Promise<any>;
  search(query: string): Promise<IToolDocument[]>;
}

class ToolService<TRepository extends IToolRepositoryShape> {
  private toolRepository: TRepository;
  constructor(toolRepository: TRepository) {
    this.toolRepository = toolRepository;
  }

  async createTool(toolData: ToolCreateInput): Promise<IToolDocument> {
    try {
      const existingTool = await this.toolRepository.findByName(toolData.name);
      if (existingTool) {
        throw new Error('A tool with this name already exists');
      }
      const savedTool = await this.toolRepository.create(toolData);
      return savedTool;
    } catch (error: unknown) {
      throw new Error(`Failed to create tool: ${getErrorMessage(error)}`);
    }
  }

  async createBulkTools(
    toolsData: ToolCreateInput[],
  ): Promise<BulkCreateResult> {
    const result: BulkCreateResult = {
      created: [],
      failed: [],
      total: toolsData.length,
    };

    for (const toolData of toolsData) {
      try {
        const createdTool = await this.createTool(toolData);
        result.created.push(createdTool);
      } catch (error: unknown) {
        result.failed.push({
          data: toolData,
          error: getErrorMessage(error),
        });
      }
    }

    return result;
  }

  async getAllTools(
    filters: Record<string, unknown> = {},
    options: ToolQueryOptions = {},
  ): Promise<IToolDocument[]> {
    try {
      const tools = await this.toolRepository.findAll(filters, options);
      return tools;
    } catch (error: unknown) {
      throw new Error(`Failed to fetch tools: ${getErrorMessage(error)}`);
    }
  }

  async getToolById(id: string): Promise<IToolDocument> {
    try {
      const tool = await this.toolRepository.findById(id);
      if (!tool) {
        throw new Error('Tool not found');
      }
      return tool;
    } catch (error: unknown) {
      throw new Error(`Failed to fetch tool: ${getErrorMessage(error)}`);
    }
  }

  async updateTool(
    id: string,
    updateData: ToolUpdateInput,
  ): Promise<IToolDocument> {
    try {
      const tool = await this.toolRepository.updateById(id, updateData);

      if (!tool) {
        throw new Error('Tool not found');
      }

      return tool;
    } catch (error: unknown) {
      if (
        typeof error === 'object' &&
        error !== null &&
        'name' in error &&
        (error as { name?: string }).name === 'ValidationError'
      ) {
        const messages = getValidationMessages(error);
        throw new Error(`Validation failed: ${messages.join(', ')}`);
      }
      throw new Error(`Failed to update tool: ${getErrorMessage(error)}`);
    }
  }

  async deleteTool(id: string): Promise<IToolDocument> {
    try {
      const tool = await this.toolRepository.deleteById(id);
      if (!tool) {
        throw new Error('Tool not found');
      }
      return tool;
    } catch (error: unknown) {
      throw new Error(`Failed to delete tool: ${getErrorMessage(error)}`);
    }
  }

  async deleteBulkTools(ids: string[]): Promise<BulkDeleteResult> {
    const results: BulkDeleteResult = {
      deleted: [],
      failed: [],
      total: ids.length,
    };

    for (const id of ids) {
      try {
        const deletedTool = await this.deleteTool(id);
        results.deleted.push(deletedTool);
      } catch (error: unknown) {
        results.failed.push({
          id,
          error: getErrorMessage(error),
        });
      }
    }

    return results;
  }

  async getToolsByCategory(category: ToolCategory): Promise<IToolDocument[]> {
    try {
      const tools = await this.toolRepository.findByCategory(category);
      return tools;
    } catch (error: unknown) {
      throw new Error(
        `Failed to fetch tools by category: ${getErrorMessage(error)}`,
      );
    }
  }

  async getPopularTools(): Promise<IToolDocument[]> {
    try {
      const tools = await this.toolRepository.findPopular();
      return tools;
    } catch (error: unknown) {
      throw new Error(
        `Failed to fetch popular tools: ${getErrorMessage(error)}`,
      );
    }
  }

  async searchTools(query: string): Promise<IToolDocument[]> {
    try {
      const tools = await this.toolRepository.search(query);
      return tools;
    } catch (error: unknown) {
      throw new Error(`Failed to search tools: ${getErrorMessage(error)}`);
    }
  }
}

export default ToolService;
