import BaseRepository from './base.repository';
import Tool, { IToolModel, ToolCategory } from '../models/tool.schema';

const ToolModel = Tool as IToolModel;

class ToolRepository extends BaseRepository<any> {
  constructor() {
    super(ToolModel);
  }

  async findByName(name: string) {
    return await this.findOne({ name });
  }

  async findByCategory(category: ToolCategory) {
    return await ToolModel.findByCategory(category);
  }

  async findPopular() {
    return await ToolModel.findPopular();
  }

  async search(searchQuery: string = 'postman') {
    return await this.findAll(
      {
        $or: [
          { name: { $regex: searchQuery, $options: 'i' } },
          { description: { $regex: searchQuery, $options: 'i' } },
          { tags: { $in: [new RegExp(searchQuery, 'i')] } },
        ],
      },
      { sort: { createdAt: -1 } },
    );
  }
}

export default ToolRepository;
