import { NextRequest } from 'next/server';
import { catchAsync } from '@/lib/middlewares/catchAsync';
import { checkRole } from '@/lib/middlewares/checkRole';
import { sendResponse } from '@/lib/utils/sendResponse';
import { StatusCodes } from 'http-status-codes';
import Redis from 'ioredis';

const handler = async (req: NextRequest) => {
  const redis = new Redis(process.env.REDIS_URL!);
  await redis.flushall();
  await redis.quit();

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Redis cache cleared successfully!',
    data: null,
  });
};

export const POST = catchAsync(checkRole(['admin'])(handler));