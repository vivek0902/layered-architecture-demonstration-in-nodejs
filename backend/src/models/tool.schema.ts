import mongoose, { Document, Model, Query } from 'mongoose';

export type ToolCategory =
  | 'IDE'
  | 'API_TOOL'
  | 'VERSION_CONTROL'
  | 'DATABASE'
  | 'DESIGN'
  | 'PRODUCTIVITY'
  | 'OTHER';

export interface ITool {
  name: string;
  description: string;
  category: ToolCategory;
  url: string;
  isPopular: boolean;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IToolDocument extends ITool, Document {}

export interface IToolModel extends Model<IToolDocument> {
  findPopular(): Query<IToolDocument[], IToolDocument>;
  findByCategory(category: ToolCategory): Query<IToolDocument[], IToolDocument>;
}

const toolSchema = new mongoose.Schema<IToolDocument, IToolModel>(
  {
    name: {
      type: String,
      required: [true, 'Tool name is required'],
      trim: true,
      maxlength: [100, 'Tool name cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Tool description is required'],
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    category: {
      type: String,
      required: [true, 'Tool category is required'],
      enum: {
        values: [
          'IDE',
          'API_TOOL',
          'VERSION_CONTROL',
          'DATABASE',
          'DESIGN',
          'PRODUCTIVITY',
          'OTHER',
        ],
        message: 'Invalid category',
      },
    },
    url: {
      type: String,
      required: [true, 'Tool URL is required'],
      validate: {
        validator: function (url: string) {
          return /^https?:\/\/.+/.test(url);
        },
        message: 'Please provide a valid URL',
      },
    },
    isPopular: {
      type: Boolean,
      default: false,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

toolSchema.index({ category: 1, isPopular: -1 });
toolSchema.index({ name: 1 });

toolSchema.pre('save', function (this: IToolDocument) {
  this.updatedAt = new Date();
});

toolSchema.statics.findPopular = function (this: IToolModel) {
  return this.find({ isPopular: true }).sort({ createdAt: -1 });
};

toolSchema.statics.findByCategory = function (
  this: IToolModel,
  category: ToolCategory,
) {
  return this.find({ category }).sort({ name: 1 });
};

const Tool = mongoose.model<IToolDocument, IToolModel>('Tool', toolSchema);

export default Tool;
