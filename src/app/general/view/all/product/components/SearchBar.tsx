"use client";

import React from "react";

interface SearchBarProps {
	value: string;
	onChange: (value: string) => void;
	placeholder?: string;
}

export default function SearchBar({ value, onChange, placeholder }: SearchBarProps) {
	return (
		<div className="space-y-2">
			<label className="text-xs sm:text-sm font-medium text-gray-700">Search by Product Name</label>
			<input
				type="text"
				value={value}
				onChange={(e) => onChange(e.target.value)}
				placeholder={placeholder || "Search by product name..."}
				className="w-full border border-gray-300 rounded-md px-3 py-2 text-xs sm:text-sm focus:border-blue-500 focus:ring-blue-500 transition-colors h-10 sm:h-auto"
			/>
		</div>
	);
}
