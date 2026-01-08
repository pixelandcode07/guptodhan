import { checkRole } from "@/lib/middlewares/checkRole";
import { JobController } from "@/lib/modules/job/job.controller";

export const GET = checkRole(['admin'])(JobController.getAllJobsForAdmin);

export const POST = checkRole(['user', 'vendor', 'service-provider', 'admin'])(JobController.createJob);