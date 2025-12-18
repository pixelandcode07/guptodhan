import { UserPlus, ShoppingCart, CheckCircle } from "lucide-react";

export default function AdminActionCards({ pendingVendors, pendingOrders }: { pendingVendors: number, pendingOrders: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Pending Vendor Request */}
      <div className="bg-orange-50 border border-orange-100 p-4 rounded-xl flex items-center justify-between">
        <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 text-orange-600 rounded-lg">
                <UserPlus size={20} />
            </div>
            <div>
                <p className="text-xs text-orange-600 font-semibold uppercase tracking-wider">Vendor Requests</p>
                <h4 className="text-xl font-bold text-gray-800">{pendingVendors} Pending</h4>
            </div>
        </div>
        <button className="text-xs bg-white border border-orange-200 text-orange-600 px-3 py-1.5 rounded-md hover:bg-orange-100 transition">
            Review
        </button>
      </div>

      {/* Pending Orders */}
      <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex items-center justify-between">
        <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                <ShoppingCart size={20} />
            </div>
            <div>
                <p className="text-xs text-blue-600 font-semibold uppercase tracking-wider">Order Processing</p>
                <h4 className="text-xl font-bold text-gray-800">{pendingOrders} To Ship</h4>
            </div>
        </div>
        <button className="text-xs bg-white border border-blue-200 text-blue-600 px-3 py-1.5 rounded-md hover:bg-blue-100 transition">
            Manage
        </button>
      </div>
    </div>
  );
}