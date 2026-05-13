import {
  Model,
  PopulateOptions,
  QueryOptions,
  UpdateQuery,
  QueryFilter,
} from 'mongoose';

type RepositoryOptions = {
  skip?: number;
  limit?: number;
  sort?: Record<string, 1 | -1>;
  populate?: string | PopulateOptions | Array<string | PopulateOptions>;
  select?: string;
  category?: string;
};

class BaseRepository<TDocument> {
  protected model: Model<TDocument>;

  constructor(model: Model<TDocument>) {
    this.model = model;
  }

  async findAll(
    filter: QueryFilter<TDocument> = {},
    options: RepositoryOptions = {},
  ) {
    const {
      skip = 0,
      limit = 10,
      sort = { createdAt: -1 },
      populate,
      select,
    } = options;

    let query = this.model.find(filter);
    if (populate) {
      query = query.populate(populate as PopulateOptions | PopulateOptions[]);
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

  async findById(id: string, options: RepositoryOptions = {}) {
    const { populate, select } = options;

    let query = this.model.findById(id);

    if (select) query = query.select(select);
    if (populate) {
      query = query.populate(populate as PopulateOptions | PopulateOptions[]);
    }

    return await query.exec();
  }

  async findOne(
    filters: QueryFilter<TDocument>,
    options: RepositoryOptions = {},
  ) {
    const { populate, select } = options;

    let query = this.model.findOne(filters);

    if (select) query = query.select(select);
    if (populate) {
      query = query.populate(populate as PopulateOptions | PopulateOptions[]);
    }

    return await query.exec();
  }

  async create(data: Partial<TDocument>) {
    const document = new this.model(data);
    return await document.save();
  }

  async updateById(
    id: string,
    updateData: UpdateQuery<TDocument> | Partial<TDocument>,
    options: QueryOptions = {},
  ) {
    const defaultOptions: QueryOptions = {
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

  async count(filters: QueryFilter<TDocument> = {}) {
    return await this.model.countDocuments(filters);
  }
}

export default BaseRepository;
