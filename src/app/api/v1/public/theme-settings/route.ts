import { ThemeSettingsController } from '@/lib/modules/theme-settings/theme.controller';
import { catchAsync } from '@/lib/middlewares/catchAsync';

/**
 * @description Get the active theme settings. (Public)
 * @method GET
 */
export const GET = catchAsync(ThemeSettingsController.getPublicTheme);