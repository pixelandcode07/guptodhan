import { ThemeSettingsController } from '@/lib/modules/theme-settings/theme.controller';
import { catchAsync } from '@/lib/middlewares/catchAsync';
import { checkRole } from '@/lib/middlewares/checkRole';

/**
 * @description Update parts of the theme settings. (Admin Only)
 * @method PATCH
 */
export const PATCH = catchAsync(checkRole(['admin'])(ThemeSettingsController.updateTheme));

/**
 * @description Delete the theme settings. (Admin Only)
 * @method DELETE
 */
export const DELETE = catchAsync(checkRole(['admin'])(ThemeSettingsController.deleteTheme));