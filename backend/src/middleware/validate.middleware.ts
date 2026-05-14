import { Request, Response, NextFunction } from 'express';
import { ToolCategory } from '../models/tool.schema';

export interface ValidationError {
  field: string;
  message: string;
}

/**
 * Validates if a string is a valid MongoDB ObjectId
 */
export const isValidObjectId = (id: string): boolean => {
  return /^[0-9a-fA-F]{24}$/.test(id);
};

/**
 * Validates if a string is a valid URL
 */
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Validates if category is one of the allowed categories
 */
export const isValidCategory = (category: string): boolean => {
  const validCategories: ToolCategory[] = [
    'IDE',
    'API_TOOL',
    'VERSION_CONTROL',
    'DATABASE',
    'DESIGN',
    'PRODUCTIVITY',
    'OTHER',
  ];
  return validCategories.includes(category as ToolCategory);
};

/**
 * Middleware to validate tool creation request
 */
export const validateToolCreation = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const errors: ValidationError[] = [];
  const { name, description, category, url } = req.body;

  // Validate required fields
  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    errors.push({
      field: 'name',
      message: 'Name is required and must be a non-empty string',
    });
  }

  if (
    !description ||
    typeof description !== 'string' ||
    description.trim().length === 0
  ) {
    errors.push({
      field: 'description',
      message: 'Description is required and must be a non-empty string',
    });
  }

  if (!category || !isValidCategory(category)) {
    errors.push({
      field: 'category',
      message: `Category must be one of: Frontend, Backend, Database, DevOps, Testing`,
    });
  }

  if (!url || typeof url !== 'string' || !isValidUrl(url)) {
    errors.push({
      field: 'url',
      message: 'URL is required and must be a valid URL',
    });
  }

  // Validate optional fields
  if (req.body.tags && !Array.isArray(req.body.tags)) {
    errors.push({
      field: 'tags',
      message: 'Tags must be an array',
    });
  }

  if (
    req.body.isPopular !== undefined &&
    typeof req.body.isPopular !== 'boolean'
  ) {
    errors.push({
      field: 'isPopular',
      message: 'isPopular must be a boolean',
    });
  }

  if (errors.length > 0) {
    res.status(400).json({
      success: false,
      statusCode: 400,
      message: 'Validation failed',
      errors,
    });
    return;
  }

  next();
};

/**
 * Middleware to validate tool update request
 */
export const validateToolUpdate = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const errors: ValidationError[] = [];
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const body = req.body;

  // Validate ID
  if (!id || typeof id !== 'string' || !isValidObjectId(id)) {
    errors.push({
      field: 'id',
      message: 'ID must be a valid MongoDB ObjectId',
    });
  }

  // Validate body has at least one field
  if (Object.keys(body).length === 0) {
    errors.push({
      field: 'body',
      message: 'At least one field must be provided for update',
    });
  }

  // Validate optional fields if provided
  if (body.name !== undefined) {
    if (typeof body.name !== 'string' || body.name.trim().length === 0) {
      errors.push({
        field: 'name',
        message: 'Name must be a non-empty string',
      });
    }
  }

  if (body.category !== undefined && !isValidCategory(body.category)) {
    errors.push({
      field: 'category',
      message:
        'Category must be one of: Frontend, Backend, Database, DevOps, Testing',
    });
  }

  if (body.url !== undefined) {
    if (typeof body.url !== 'string' || !isValidUrl(body.url)) {
      errors.push({
        field: 'url',
        message: 'URL must be a valid URL',
      });
    }
  }

  if (body.tags !== undefined && !Array.isArray(body.tags)) {
    errors.push({
      field: 'tags',
      message: 'Tags must be an array',
    });
  }

  if (body.isPopular !== undefined && typeof body.isPopular !== 'boolean') {
    errors.push({
      field: 'isPopular',
      message: 'isPopular must be a boolean',
    });
  }

  if (errors.length > 0) {
    res.status(400).json({
      success: false,
      statusCode: 400,
      message: 'Validation failed',
      errors,
    });
    return;
  }

  next();
};

/**
 * Middleware to validate tool ID in URL
 */
export const validateToolId = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

  if (!id || typeof id !== 'string' || !isValidObjectId(id)) {
    res.status(400).json({
      success: false,
      statusCode: 400,
      message: 'Invalid tool ID',
      errors: [
        {
          field: 'id',
          message: 'ID must be a valid MongoDB ObjectId',
        },
      ],
    });
    return;
  }

  next();
};

/**
 * Middleware to validate bulk delete request
 */
export const validateBulkDelete = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const { ids } = req.body;
  const errors: ValidationError[] = [];

  if (!Array.isArray(ids) || ids.length === 0) {
    errors.push({
      field: 'ids',
      message: 'IDs must be a non-empty array',
    });
  } else {
    const invalidIds = ids.filter((id: any) => !isValidObjectId(id));
    if (invalidIds.length > 0) {
      errors.push({
        field: 'ids',
        message: `Invalid MongoDB ObjectIds: ${invalidIds.join(', ')}`,
      });
    }
  }

  if (errors.length > 0) {
    res.status(400).json({
      success: false,
      statusCode: 400,
      message: 'Validation failed',
      errors,
    });
    return;
  }

  next();
};

/**
 * Middleware to validate bulk create request
 */
export const validateBulkCreate = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const { tools } = req.body;
  const errors: ValidationError[] = [];

  if (!Array.isArray(tools) || tools.length === 0) {
    errors.push({
      field: 'tools',
      message: 'Tools must be a non-empty array',
    });
    res.status(400).json({
      success: false,
      statusCode: 400,
      message: 'Validation failed',
      errors,
    });
    return;
  }

  // Validate each tool
  tools.forEach((tool, index) => {
    if (!tool.name || typeof tool.name !== 'string') {
      errors.push({
        field: `tools[${index}].name`,
        message: 'Name is required and must be a string',
      });
    }

    if (!tool.description || typeof tool.description !== 'string') {
      errors.push({
        field: `tools[${index}].description`,
        message: 'Description is required and must be a string',
      });
    }

    if (!tool.category || !isValidCategory(tool.category)) {
      errors.push({
        field: `tools[${index}].category`,
        message:
          'Category must be one of: Frontend, Backend, Database, DevOps, Testing',
      });
    }

    if (!tool.url || !isValidUrl(tool.url)) {
      errors.push({
        field: `tools[${index}].url`,
        message: 'URL must be a valid URL',
      });
    }
  });

  if (errors.length > 0) {
    res.status(400).json({
      success: false,
      statusCode: 400,
      message: 'Validation failed',
      errors,
    });
    return;
  }

  next();
};
