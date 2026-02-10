import { checkRole } from "@/lib/middlewares/checkRole";
import { JobController } from "@/lib/modules/job/job.controller";

export const GET = checkRole(['admin'])(JobController.getSingleJob)
export const PATCH = checkRole(['admin'])(JobController.updateStatus);