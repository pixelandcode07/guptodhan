import { IntegrationsController } from '@/lib/modules/integrations/integrations.controller';
import { catchAsync } from '@/lib/middlewares/catchAsync';

export const POST = catchAsync(IntegrationsController.createOrUpdateIntegrations);
export const GET = catchAsync(IntegrationsController.getPublicIntegrations);
