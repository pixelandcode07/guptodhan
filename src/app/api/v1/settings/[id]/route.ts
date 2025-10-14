import { SettingsController } from '@/lib/modules/settings/settings.controller';
import { catchAsync } from '@/lib/middlewares/catchAsync';
import { checkRole } from '@/lib/middlewares/checkRole';

/**
 * @description Update parts of the settings by ID. (Admin Only)
 * @method PATCH
 */
export const PATCH = catchAsync(checkRole(['admin'])(SettingsController.updateSettings));

/**
 * @description Delete the settings by ID. (Admin Only)
 * @method DELETE
 */
export const DELETE = catchAsync(checkRole(['admin'])(SettingsController.deleteSettings));