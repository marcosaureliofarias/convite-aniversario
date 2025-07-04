import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  return res.status(200).json({
    message: 'API is running',
    version: '1.0.0',
    endpoints: [
      '/api/guests',
      '/api/guests/[id]',
      '/api/guests/[id]/confirm'
    ]
  });
}
