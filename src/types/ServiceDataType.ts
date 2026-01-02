export interface ServiceArea {
    city: string;
    district: string;
    thana: string;
}

export type PricingType = 'fixed' | 'hourly';

export type TimeSlot = 'Morning' | 'Afternoon' | 'Evening' | 'Night';

export type DayOfWeek =
    | 'Sunday'
    | 'Monday'
    | 'Tuesday'
    | 'Wednesday'
    | 'Thursday'
    | 'Friday'
    | 'Saturday';

export type ServiceStatus = 'Under Review' | 'Approved' | 'Rejected' | 'Active';

export interface ServiceData {
    _id: string;
    provider_id: string;
    service_id: string;
    service_title: string;
    service_category: string;
    service_description: string;
    service_area: ServiceArea;
    pricing_type: PricingType;
    base_price: number;
    minimum_charge: number;
    available_time_slots: TimeSlot[];
    working_days: DayOfWeek[];
    tools_provided: boolean;
    service_images: string[];
    service_status: ServiceStatus;
    is_visible_to_customers: boolean;
    average_rating: number;
    total_bookings: number;
    createdAt: string;
    updatedAt: string;
    __v?: number; // Added __v as it's present in your API response
}

// Generic API Response Wrapper
export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

// Data format for list of services
export interface AllServicesData {
    total_services: number;
    services: ServiceData[];
    // Pagination meta thakle ekhaneo add korte paren
}

// Specific Type for a Single Service Response
// Usually single service e "data" er bhetore direct object thake
export type SingleServiceResponse = ApiResponse<ServiceData>;

// Specific Type for the List of Services Response (Updated)
export type AllServicesResponse = ApiResponse<AllServicesData>;