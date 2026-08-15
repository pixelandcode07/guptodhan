import { createAdminNotification } from "@/lib/utils/createAdminNotification";
import { IService } from "./provideService.interface";
import { ServiceModel } from "./provideService.model";

// --- Create a new service ---
const createServiceInDB = async (payload: Partial<IService>) => {
  const result = await ServiceModel.create(payload);

  // ✅ Admin Notification Added Here
  await createAdminNotification(
    'service_request',
    `New Service pending approval: ${result.service_title}`,
    `/general/all-service-request`
  );

  return result;
};

// --- Provider: Get all their services ---
const getProviderServicesFromDB = async (provider_id: string) => {
  const services = await ServiceModel.find({ provider_id })
    .sort({ createdAt: -1 });
  const total_services = services.length;
  return { total_services, services };
};

// --- Admin: Get all services ---
const getAllServicesFromDB = async () => {
  const services = await ServiceModel.aggregate([
    { $sort: { createdAt: -1 } },
    {
      $lookup: {
        from: 'users',
        let: { providerId: '$provider_id' },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ['$_id', { $toObjectId: '$$providerId' }] }
            }
          },
          {
            $project: { name: 1, email: 1, phoneNumber: 1, profilePicture: 1 }
          }
        ],
        as: 'providerInfo'
      }
    },
    {
      $addFields: {
        providerInfo: { $arrayElemAt: ['$providerInfo', 0] }
      }
    }
  ]);

  const total_services = services.length;
  return { total_services, services };
};

// --- Get a single service by ID ---
const getServiceByIdFromDB = async (id: string) => {
  const service = await ServiceModel.findById(id);
  if (!service) throw new Error("Service not found.");
  return service;
};

// --- Update a service ---
const updateServiceInDB = async (
  id: string,
  payload: Partial<IService>
) => {
  const service = await ServiceModel.findByIdAndUpdate(
    id,
    payload,
    { new: true }
  );
  if (!service) throw new Error("Service not found to update.");
  return service;
};

// --- Change service status (Admin only) ---
const changeServiceStatusInDB = async (
  id: string,
  status: "Draft" | "Active" | "Under Review" | "Disabled",
  is_visible_to_customers?: boolean
) => {
  const service = await ServiceModel.findByIdAndUpdate(
    id,
    { service_status: status, is_visible_to_customers },
    { new: true }
  );
  if (!service) throw new Error("Service not found to update status.");
  return service;
};

// --- Get only visible services for customers ---
const getVisibleServicesFromDB = async () => {
  const services = await ServiceModel.find({
    service_status: "Active",
    is_visible_to_customers: true,
  }).sort({ createdAt: -1 });
  const total_services = services.length;
  return { total_services, services };
};

// --- Delete a service (Admin / Provider) ---
const deleteServiceInDB = async (id: string, provider_id: string) => {
  // ✅ MAGIC FIX: findByIdAndUpdate এর বদলে findByIdAndDelete ব্যবহার করে ডাটাবেস থেকে পুরোপুরি ডিলিট করা হলো
  const service = await ServiceModel.findByIdAndDelete(id);

  if (!service) throw new Error("Service not found or already deleted.");
  return service;
};

export const ServiceServices = {
  createServiceInDB,
  getProviderServicesFromDB,
  getAllServicesFromDB,
  getServiceByIdFromDB,
  updateServiceInDB,
  changeServiceStatusInDB,
  getVisibleServicesFromDB,
  deleteServiceInDB,
};