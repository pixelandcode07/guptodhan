import { Product } from '@/components/TableHelper/product_columns'

export function downloadProductsCSV(rows: Product[]) {
	if (rows.length === 0) return false
	const headers = [
		'ID','Product Name','Category','Store','Price','Offer Price','Stock','Flag','Status','Created At'
	]
	const csvData = rows.map(product => [
		product.id,
		product.name,
		product.category,
		product.store,
		product.price,
		product.offer_price,
		product.stock,
		product.flag || '',
		product.status,
		product.created_at
	])
	const csvContent = [headers, ...csvData]
		.map(row => row.map(field => `"${String(field).replace(/"/g, '""')}"`).join(','))
		.join('\n')
	const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
	const link = document.createElement('a')
	const url = URL.createObjectURL(blob)
	link.setAttribute('href', url)
	link.setAttribute('download', `products_${new Date().toISOString().split('T')[0]}.csv`)
	link.style.visibility = 'hidden'
	document.body.appendChild(link)
	link.click()
	document.body.removeChild(link)
	URL.revokeObjectURL(url)
	return true
}
