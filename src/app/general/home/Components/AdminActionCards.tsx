import { UserPlus, ShoppingCart } from "lucide-react";
import Link from "next/link";

export function AdminActionCards({ pendingVendors, pendingOrders }: { pendingVendors: number, pendingOrders: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Pending Vendor Request */}
      <div className="group relative overflow-hidden rounded-xl border border-white/20 bg-gradient-to-br from-orange-50/50 to-red-50/50 backdrop-blur-md p-6 hover:shadow-xl transition-all duration-300">
        
        {/* Background glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/0 via-orange-500/5 to-transparent group-hover:via-orange-500/10 transition-all duration-500"></div>

        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-orange-100/50 rounded-xl group-hover:bg-orange-100 transition-colors duration-300">
              <UserPlus className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-xs text-orange-600 font-bold uppercase tracking-widest">Vendor Requests</p>
              <h4 className="text-3xl font-bold text-slate-900 mt-1">{pendingVendors}</h4>
              <p className="text-xs text-orange-600/70 mt-1">Pending approval</p>
            </div>
          </div>
          <Link 
            href={'/general/view/vendor/requests'} 
            className="px-4 py-2 bg-white/50 backdrop-blur-sm border border-orange-200/50 text-orange-600 rounded-lg font-semibold text-sm hover:bg-white hover:border-orange-300 transition-all duration-300 hover:shadow-md"
          >
            Review
          </Link>
        </div>
      </div>

      {/* Pending Orders */}
      <div className="group relative overflow-hidden rounded-xl border border-white/20 bg-gradient-to-br from-blue-50/50 to-indigo-50/50 backdrop-blur-md p-6 hover:shadow-xl transition-all duration-300">
        
        {/* Background glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/5 to-transparent group-hover:via-blue-500/10 transition-all duration-500"></div>

        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100/50 rounded-xl group-hover:bg-blue-100 transition-colors duration-300">
              <ShoppingCart className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-blue-600 font-bold uppercase tracking-widest">Order Processing</p>
              <h4 className="text-3xl font-bold text-slate-900 mt-1">{pendingOrders}</h4>
              <p className="text-xs text-blue-600/70 mt-1">To ship & deliver</p>
            </div>
          </div>
          <button className="px-4 py-2 bg-white/50 backdrop-blur-sm border border-blue-200/50 text-blue-600 rounded-lg font-semibold text-sm hover:bg-white hover:border-blue-300 transition-all duration-300 hover:shadow-md">
            Manage
          </button>
        </div>
      </div>
    </div>
  );
}