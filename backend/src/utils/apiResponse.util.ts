import { Response } from 'express';
import { HTTP_STATUS, RESPONSE_MESSAGES } from '../constants';

type ApiMeta = Record<string, unknown>;

class ApiResponse {
  static success(
    res: Response,
    message?: string,
    data: unknown = null,
    statusCode: number = HTTP_STATUS.OK,
    meta: ApiMeta = {},
  ) {
    const msg = message ?? RESPONSE_MESSAGES.SUCCESS;
    return res.status(statusCode).json({
      success: true,
      message: msg,
      ...(data !== null && { data }),
      ...(Object.keys(meta).length > 0 && meta),
    });
  }

  static created(
    res: Response,
    message?: string,
    data: unknown = null,
    meta: ApiMeta = {},
  ) {
    return this.success(
      res,
      (message ?? RESPONSE_MESSAGES.CREATED) as string,
      data,
      HTTP_STATUS.CREATED,
      meta,
    );
  }

  static badRequest(
    res: Response,
    message?: string,
    data: unknown = null,
    meta: ApiMeta = {},
  ) {
    const msg = message ?? RESPONSE_MESSAGES.ERROR.BAD_REQUEST;
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: msg,
      ...(data !== null && { data }),
      ...(Object.keys(meta).length > 0 && meta),
    });
  }

  static notFound(
    res: Response,
    message?: string,
    data: unknown = null,
    meta: ApiMeta = {},
  ) {
    const msg = message ?? RESPONSE_MESSAGES.ERROR.NOT_FOUND;
    return res.status(HTTP_STATUS.NOT_FOUND).json({
      success: false,
      message: msg,
      ...(data !== null && { data }),
      ...(Object.keys(meta).length > 0 && meta),
    });
  }

  static error(
    res: Response,
    message?: string,
    statusCode: number = HTTP_STATUS.INTERNAL_SERVER_ERROR,
    data: unknown = null,
    meta: ApiMeta = {},
  ) {
    const msg = message ?? RESPONSE_MESSAGES.ERROR.INTERNAL;
    return res.status(statusCode).json({
      success: false,
      message: msg,
      ...(data !== null && { data }),
      ...(Object.keys(meta).length > 0 && meta),
    });
  }
}

export default ApiResponse;
