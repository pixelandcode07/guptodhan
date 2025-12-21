'use client';

import React from 'react';
import DeleteProductDialog from './DeleteProductDialog';
import StatusToggleDialog from './StatusToggleDialog';
import { Product } from '@/components/TableHelper/product_columns';

interface DialogsProps {
	deleteOpen: boolean;
	onDeleteOpenChange: (open: boolean) => void;
	productToDelete: Product | null;
	isDeleting: boolean;
	onConfirmDelete: () => void;

	statusToggleOpen: boolean;
	onStatusToggleOpenChange: (open: boolean) => void;
	productToToggle: Product | null;
	isToggling: boolean;
	onConfirmToggle: () => void;
}

export default function Dialogs(props: DialogsProps) {
	const { deleteOpen, onDeleteOpenChange, productToDelete, isDeleting, onConfirmDelete,
		statusToggleOpen, onStatusToggleOpenChange, productToToggle, isToggling, onConfirmToggle } = props;
	return (
		<>
			<DeleteProductDialog
				open={deleteOpen}
				onOpenChange={onDeleteOpenChange}
				productName={productToDelete?.name}
				isDeleting={isDeleting}
				onConfirm={onConfirmDelete}
			/>

			<StatusToggleDialog
				open={statusToggleOpen}
				onOpenChange={onStatusToggleOpenChange}
				product={productToToggle}
				isToggling={isToggling}
				onConfirm={onConfirmToggle}
			/>
		</>
	);
}
