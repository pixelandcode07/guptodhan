import { IService } from "./provideService.interface";
import { ServiceModel } from "./provideService.model";
import mongoose from "mongoose";

// --- Create a new service ---
const createServiceInDB = async (payload: Partial<IService>) => {
  const result = await ServiceModel.create(payload);
  return result;
};

// --- Provider: Get all their services ---
const getProviderServicesFromDB = async (provider_id: string) => {
  const services = await ServiceModel.find({ provider_id })
    .sort({ createdAt: -1 });
  const total_services = services.length;
  return { total_services, services };
};

// --- Admin: Get all services (with filters) ---
const getAllServicesFromDB = async (filters?: Partial<IService>) => {
  const query = filters ? { ...filters } : {};
  const services = await ServiceModel.find(query).sort({ createdAt: -1 });
  const total_services = services.length;
  return { total_services, services };
};

// --- Get a single service by ID ---
const getServiceByIdFromDB = async (id: string) => {
  const service = await ServiceModel.findOne({ id });
  if (!service) throw new Error("Service not found.");
  return service;
};

// --- Update a service ---
const updateServiceInDB = async (
  id: string,
  payload: Partial<IService>
) => {
  const service = await ServiceModel.findOneAndUpdate(
    { id },
    payload,
    { new: true }
  );
  if (!service) throw new Error("Service not found to update.");
  return service;
};

// --- Change service status (Admin only) ---
const changeServiceStatusInDB = async (
  service_id: string,
  status: "Draft" | "Active" | "Under Review" | "Disabled",
  is_visible_to_customers?: boolean
) => {
  const service = await ServiceModel.findOneAndUpdate(
    { service_id },
    { service_status: status, is_visible_to_customers },
    { new: true }
  );
  if (!service) throw new Error("Service not found to update status.");
  return service;
};

// --- Get only visible services for customers ---
const getVisibleServicesFromDB = async (filters?: Partial<IService>) => {
  const query = {
    service_status: "Active",
    is_visible_to_customers: true,
    ...filters,
  };
  const services = await ServiceModel.find(query).sort({ createdAt: -1 });
  const total_services = services.length;
  return { total_services, services };
};

// --- Delete a service (Provider) ---
const deleteServiceInDB = async (id: string, provider_id: string) => {
  // Optional: soft delete by status
  const service = await ServiceModel.findOneAndUpdate(
    { id, provider_id },
    { service_status: "Disabled", is_visible_to_customers: false },
    { new: true }
  );

  if (!service) throw new Error("Service not found or not owned by provider.");
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
