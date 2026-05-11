import express, { Request, Response } from 'express';
const router = express.Router();

interface ToolboxResponse {
  success: boolean;
  message: string;
}

router.get('/', (req: Request, res: Response): void => {
  const response: ToolboxResponse = {
    success: true,
    message: 'This is an example route for the toolbox.',
  };
  res.json(response);
});

export default router;
