import { checkRole } from "@/lib/middlewares/checkRole";
import { JobController } from "@/lib/modules/job/job.controller";

export const PATCH = checkRole(['user', 'admin', 'vendor', 'service-provider'])(JobController.updateMyJob);
export const DELETE = checkRole(['user', 'admin', 'vendor', 'service-provider'])(JobController.deleteMyJob);