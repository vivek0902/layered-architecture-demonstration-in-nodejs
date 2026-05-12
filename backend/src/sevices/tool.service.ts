import ToolRepository from '../repository/tool.repository';

class ToolService {
  private toolRepository: typeof ToolRepository;
  constructor() {
    this.toolRepository = ToolRepository;
  }

  async createTool(toolData: any) {
    try {
      const existingTool = await this.toolRepository.findByName(toolData.name);
      if (existingTool) {
        throw new Error('A tool with this name already exists');
      }
      const savedTool = await this.toolRepository.create(toolData);
      return savedTool;
    } catch (error: any) {
      throw new Error(`Failed to create tool: ${error.message}`);
    }
  }

  async createBulkTools(toolsData: any[]) {
    const result: {
      created: any[];
      failed: { data: any; error: string }[];
      total: number;
    } = {
      created: [],
      failed: [],
      total: toolsData.length,
    };

    for (const toolData of toolsData) {
      try {
        const createdTool = await this.createTool(toolData);
        result.created.push(createdTool);
      } catch (error: any) {
        result.failed.push({
          data: toolData,
          error: error.message,
        });
      }
    }

    return result;
  }

  async getAllTools(filters = {}, options = {}) {
    try {
      const tools = await this.toolRepository.findAll(filters, options);
      return tools;
    } catch (error: any) {
      throw new Error(`Failed to fetch tools: ${error.message}`);
    }
  }

  async getToolById(id: string) {
    try {
      const tool = await this.toolRepository.findById(id);
      if (!tool) {
        throw new Error('Tool not found');
      }
      return tool;
    } catch (error: any) {
      throw new Error(`Failed to fetch tool: ${error.message}`);
    }
  }

  async updateTool(id: string, updateData: any) {
    try {
      const tool = await this.toolRepository.updateById(id, updateData);

      if (!tool) {
        throw new Error('Tool not found');
      }

      return tool;
    } catch (error: any) {
      if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map(
          (err: any) => err.message,
        );
        throw new Error(`Validation failed: ${messages.join(', ')}`);
      }
      throw new Error(`Failed to update tool: ${error.message}`);
    }
  }

  async deleteTool(id: string) {
    try {
      const tool = await this.toolRepository.deleteById(id);
      if (!tool) {
        throw new Error('Tool not found');
      }
      return tool;
    } catch (error: any) {
      throw new Error(`Failed to delete tool: ${error.message}`);
    }
  }

  async deleteBulkTools(ids: string[]) {
    const results: {
      deleted: any[];
      failed: { id: string; error: string }[];
      total: number;
    } = {
      deleted: [],
      failed: [],
      total: ids.length,
    };

    for (const id of ids) {
      try {
        const deletedTool = await this.deleteTool(id);
        results.deleted.push(deletedTool);
      } catch (error: any) {
        results.failed.push({
          id,
          error: error.message,
        });
      }
    }

    return results;
  }

  async getToolsByCategory(category: any) {
    try {
      const tools = await this.toolRepository.findByCategory(category);
      return tools;
    } catch (error: any) {
      throw new Error(`Failed to fetch tools by category: ${error.message}`);
    }
  }

  async getPopularTools() {
    try {
      const tools = await this.toolRepository.findPopular();
      return tools;
    } catch (error: any) {
      throw new Error(`Failed to fetch popular tools: ${error.message}`);
    }
  }

  async searchTools(query: string) {
    try {
      const tools = await this.toolRepository.search(query);
      return tools;
    } catch (error: any) {
      throw new Error(`Failed to search tools: ${error.message}`);
    }
  }
}

export default new ToolService();
