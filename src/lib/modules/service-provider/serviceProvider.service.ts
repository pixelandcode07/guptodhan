// ফাইল পাথ: D:\yeamin student\Guptodhan Project\guptodhan\src\lib\modules\service-provider\serviceProvider.service.ts
import { ServiceProvider } from './serviceProvider.model';
import { IServiceProvider } from './serviceProvider.interface';

const registerServiceProviderInDB = async (payload: Partial<IServiceProvider>) => {
  const isProviderExist = await ServiceProvider.findOne({
    $or: [{ email: payload.email }, { phoneNumber: payload.phoneNumber }],
  });

  if (isProviderExist) {
    throw new Error('A service provider with this email or phone number already exists.');
  }

  const result = await ServiceProvider.create(payload);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password, ...providerData } = result.toObject();
  return providerData;
};

export const ServiceProviderServices = {
  registerServiceProviderInDB,
};