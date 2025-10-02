import { catchAsync } from "@/lib/middlewares/catchAsync";
import { SettingsController } from "@/lib/modules/settings/settings.controller";

export const POST = catchAsync(SettingsController.createOrUpdateSettings);