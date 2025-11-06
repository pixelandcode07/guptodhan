'use client';

import React from 'react';
import SearchBar from './SearchBar';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

interface FiltersBarProps {
	search: string;
	onSearchChange: (v: string) => void;
	isSearching: boolean;
	onDownloadCSV: () => void;
}

export default function FiltersBar({ search, onSearchChange, isSearching, onDownloadCSV }: FiltersBarProps) {
	return (
		<div className="mb-4 sm:mb-6">
			<div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
				<div className="mb-4">
					<h2 className="text-base sm:text-lg font-semibold text-gray-900">Filters</h2>
				</div>
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-end">
					<SearchBar value={search} onChange={onSearchChange} placeholder="Search by product name..." />
					<div className="flex items-end">
						<Button 
							onClick={onDownloadCSV}
							className="h-10 w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white font-medium"
							disabled={isSearching}
						>
							<Download className="w-4 h-4 mr-2" />
							Download CSV
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
