import { checkRole } from "@/lib/middlewares/checkRole";
import { JobController } from "@/lib/modules/job/job.controller";

export const PATCH = checkRole(['admin'])(JobController.updateStatus);