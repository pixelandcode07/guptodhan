import { AboutFactController } from '@/lib/modules/about-fact/fact.controller';
import { catchAsync } from '@/lib/middlewares/catchAsync';

/**
 * @description Get a single "About Fact" by its ID. (Public)
 * @method GET
 */
export const GET = catchAsync(AboutFactController.getFactById);