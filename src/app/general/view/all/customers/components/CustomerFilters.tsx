"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Download } from "lucide-react";
import { Customer } from "@/components/TableHelper/customer_columns";

interface CustomerFiltersProps {
  searchText: string;
  setSearchText: (text: string) => void;
  customers: Customer[];
}

export default function CustomerFilters({
  searchText,
  setSearchText,
  customers,
}: CustomerFiltersProps) {
  const downloadCSV = () => {
    // Prepare CSV headers
    const headers = [
      'ID',
      'Name', 
      'Email',
      'Phone',
      'Address',
      'Wallet Balance',
      'Created At'
    ];

    // Convert customer data to CSV format
    const csvData = customers.map(customer => [
      customer.id,
      customer.name,
      customer.email,
      customer.phone,
      customer.address,
      customer.wallet,
      customer.created_at
    ]);

    // Combine headers and data
    const csvContent = [headers, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `customers_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search Input */}
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Search customers by name, email, or phone..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="pl-10 h-10 sm:h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Download CSV Button */}
        <div className="w-full lg:w-auto">
          <Button 
            onClick={downloadCSV}
            className="w-full lg:w-auto h-10 sm:h-11 bg-green-600 hover:bg-green-700 text-white font-medium"
          >
            <Download className="w-4 h-4 mr-2" />
            Download CSV
          </Button>
        </div>
      </div>
    </div>
  );
}
