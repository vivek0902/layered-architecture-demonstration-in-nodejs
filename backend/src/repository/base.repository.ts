class BaseRepository<T> {
  protected model: any;
  constructor(model: any) {
    this.model = model;
  }

  async findAll(filter: any = {}, options: any = {}) {
    const {
      skip = 0,
      limit = 10,
      sort = { createdAt: -1 },
      populate,
      select,
    } = options;

    let query = this.model.find(filter);
    if (populate) {
      query = query.populate(populate);
    }
    if (select) {
      query = query.select(select);
    }
    if (sort) {
      query = query.sort(sort);
    }
    if (limit) {
      query = query.limit(limit);
    }
    if (skip) {
      query = query.skip(skip);
    }
    return await query.exec();
  }

  async findById(id: string, options: any = {}) {
    const { populate, select } = options;

    let query = this.model.findById(id);

    if (select) query = query.select(select);
    if (populate) query = query.populate(populate);

    return await query.exec();
  }

  async findOne(filters: any, options: any = {}) {
    const { populate, select } = options;

    let query = this.model.findOne(filters);

    if (select) query = query.select(select);
    if (populate) query = query.populate(populate);

    return await query.exec();
  }

  async create(data: any) {
    const document = new this.model(data);
    return await document.save();
  }

  async updateById(id: string, updateData: any, options: any = {}) {
    const defaultOptions = {
      new: true,
      runValidators: true,
      ...options,
    };

    return await this.model.findByIdAndUpdate(
      id,
      { ...updateData, updatedAt: new Date() },
      defaultOptions,
    );
  }

  async deleteById(id: string) {
    return await this.model.findByIdAndDelete(id);
  }

  async count(filters: any = {}) {
    return await this.model.countDocuments(filters);
  }
}

export default BaseRepository;
