'use client';

// src/app/general/sales/report/sections/AdminDashboardReport.tsx

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import { toast } from 'sonner';
import {
  Loader2, Printer, Download, TrendingUp, TrendingDown,
  ShoppingBag, Users, Store, Truck, CreditCard, Package,
  ChevronUp, ChevronDown, ChevronsUpDown, Filter,
} from 'lucide-react';

import { Input }   from '@/components/ui/input';
import { Label }   from '@/components/ui/label';
import { Button }  from '@/components/ui/button';
import { Badge }   from '@/components/ui/badge';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Tabs, TabsContent, TabsList, TabsTrigger,
} from '@/components/ui/tabs';

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

interface AdminSummary {
  totalRevenue:          number;
  totalDeliveryRevenue:  number;
  totalProductRevenue:   number;
  totalAdminProfit:      number;
  totalOrders:           number;
  deliveredOrders:       number;
  pendingOrders:         number;
  processingOrders:      number;
  shippedOrders:         number;
  cancelledOrders:       number;
  returnedOrders:        number;
  paidOrders:            number;
  unpaidOrders:          number;
  uniqueCustomersCount:  number;
  uniqueVendorsCount:    number;
}

interface VendorBreakdownItem {
  storeId:             string;
  storeName:           string;
  storeEmail:          string;
  storeLogo:           string;
  commissionRate:      number;
  totalOrders:         number;
  deliveredOrders:     number;
  cancelledOrders:     number;
  totalRevenue:        number;
  totalProductRevenue: number;
  totalDeliveryCharge: number;
  adminEarned:         number;
  vendorNet:           number;
}

interface CustomerBreakdownItem {
  userId:          string;
  customerName:    string;
  customerPhone:   string;
  totalOrders:     number;
  deliveredOrders: number;
  cancelledOrders: number;
  totalSpent:      number;
  totalProducts:   number;
  uniqueProducts:  number;
  lastOrderDate:   string;
  firstOrderDate:  string;
  cities:          string[];
}

interface AdminDashboardData {
  summary:           AdminSummary;
  vendorBreakdown:   VendorBreakdownItem[];
  customerBreakdown: CustomerBreakdownItem[];
}

// Sort direction type
type SortDir = 'asc' | 'desc' | null;
interface SortState { key: string; dir: SortDir }

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

const tk = (n: number) =>
  `৳${n.toLocaleString('en-BD', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const fDate = (d: string | undefined) =>
  d ? new Date(d).toLocaleDateString('en-BD') : '—';

function sortData<T extends Record<string, any>>(
  data: T[],
  sort: SortState,
): T[] {
  if (!sort.key || !sort.dir) return data;
  return [...data].sort((a, b) => {
    const av = a[sort.key];
    const bv = b[sort.key];
    if (typeof av === 'number' && typeof bv === 'number') {
      return sort.dir === 'asc' ? av - bv : bv - av;
    }
    return sort.dir === 'asc'
      ? String(av).localeCompare(String(bv))
      : String(bv).localeCompare(String(av));
  });
}

// ─────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────

interface SummaryCardProps {
  title:     string;
  value:     string;
  subtitle?: string;
  icon:      React.ReactNode;
  accent:    string; // tailwind border-color class
  bg:        string; // tailwind bg class for icon wrapper
}

function SummaryCard({ title, value, subtitle, icon, accent, bg }: SummaryCardProps) {
  return (
    <div className={`rounded-lg border ${accent} bg-white p-4 flex items-start gap-3`}>
      <div className={`${bg} rounded-md p-2 shrink-0`}>{icon}</div>
      <div className="min-w-0">
        <p className="text-xs text-gray-500 font-medium truncate">{title}</p>
        <p className="text-lg font-bold text-gray-800 leading-tight mt-0.5">{value}</p>
        {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
      </div>
    </div>
  );
}

function SortIcon({ columnKey, sort }: { columnKey: string; sort: SortState }) {
  if (sort.key !== columnKey) return <ChevronsUpDown className="inline h-3 w-3 ml-1 text-gray-400" />;
  return sort.dir === 'asc'
    ? <ChevronUp className="inline h-3 w-3 ml-1 text-blue-500" />
    : <ChevronDown className="inline h-3 w-3 ml-1 text-blue-500" />;
}

function Th({
  label, colKey, sort, onSort, right,
}: {
  label: string;
  colKey: string;
  sort: SortState;
  onSort: (k: string) => void;
  right?: boolean;
}) {
  return (
    <th
      onClick={() => onSort(colKey)}
      className={`px-3 py-2.5 text-xs font-semibold text-white cursor-pointer select-none whitespace-nowrap ${right ? 'text-right' : 'text-left'}`}
    >
      {label}
      <SortIcon columnKey={colKey} sort={sort} />
    </th>
  );
}

function EmptyRow({ cols }: { cols: number }) {
  return (
    <tr>
      <td colSpan={cols} className="text-center py-10 text-gray-400 text-sm">
        No data available.
      </td>
    </tr>
  );
}

// ─────────────────────────────────────────────
// CSV helpers
// ─────────────────────────────────────────────

function downloadCSV(rows: string[][], filename: string) {
  const content = rows.map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
  const blob = new Blob(['\uFEFF' + content], { type: 'text/csv;charset=utf-8;' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function exportVendorCSV(data: VendorBreakdownItem[]) {
  const headers = [
    'Store Name', 'Email', 'Commission %', 'Total Orders',
    'Delivered', 'Cancelled', 'Total Revenue (৳)',
    'Product Revenue (৳)', 'Delivery Charge (৳)',
    'Admin Earned (৳)', 'Vendor Net (৳)',
  ];
  const rows = data.map(v => [
    v.storeName, v.storeEmail, String(v.commissionRate),
    String(v.totalOrders), String(v.deliveredOrders), String(v.cancelledOrders),
    String(v.totalRevenue), String(v.totalProductRevenue),
    String(v.totalDeliveryCharge), String(v.adminEarned), String(v.vendorNet),
  ]);
  downloadCSV([headers, ...rows], `vendor_report_${Date.now()}.csv`);
  toast.success('Vendor CSV exported!');
}

function exportCustomerCSV(data: CustomerBreakdownItem[]) {
  const headers = [
    'Customer Name', 'Phone', 'Total Orders', 'Delivered',
    'Cancelled', 'Total Products', 'Total Spent (৳)',
    'Last Order', 'First Order', 'Cities',
  ];
  const rows = data.map(c => [
    c.customerName, c.customerPhone,
    String(c.totalOrders), String(c.deliveredOrders), String(c.cancelledOrders),
    String(c.totalProducts), String(c.totalSpent),
    fDate(c.lastOrderDate), fDate(c.firstOrderDate), c.cities.join(' | '),
  ]);
  downloadCSV([headers, ...rows], `customer_report_${Date.now()}.csv`);
  toast.success('Customer CSV exported!');
}

// ─────────────────────────────────────────────
// Print helper
// ─────────────────────────────────────────────

function handlePrint(data: AdminDashboardData, filters: Record<string, string>) {
  const w = window.open('', '_blank');
  if (!w) { toast.error('Allow popups to print.'); return; }

  const { summary: s, vendorBreakdown: vb, customerBreakdown: cb } = data;

  const filterLines = Object.entries(filters)
    .filter(([, v]) => v)
    .map(([k, v]) => `<span style="margin-right:16px"><b>${k}:</b> ${v}</span>`)
    .join('');

  const vendorRows = vb.map((v, i) => `
    <tr style="background:${i % 2 ? '#f9fafb' : '#fff'}">
      <td>${i + 1}</td>
      <td><b>${v.storeName}</b><br><small>${v.storeEmail}</small></td>
      <td>${v.commissionRate}%</td>
      <td>${v.totalOrders}</td>
      <td>${v.deliveredOrders}</td>
      <td>৳${v.totalRevenue.toFixed(2)}</td>
      <td style="color:#16a34a;font-weight:600">৳${v.adminEarned.toFixed(2)}</td>
      <td>৳${v.vendorNet.toFixed(2)}</td>
    </tr>`).join('');

  const customerRows = cb.map((c, i) => `
    <tr style="background:${i % 2 ? '#f9fafb' : '#fff'}">
      <td>${i + 1}</td>
      <td><b>${c.customerName}</b></td>
      <td>${c.customerPhone}</td>
      <td>${c.totalOrders}</td>
      <td>${c.totalProducts}</td>
      <td style="font-weight:600">৳${c.totalSpent.toFixed(2)}</td>
      <td>${fDate(c.lastOrderDate)}</td>
    </tr>`).join('');

  w.document.write(`<!DOCTYPE html><html><head><title>Guptodhan Sales Report</title>
  <style>
    *{margin:0;padding:0;box-sizing:border-box}
    body{font-family:Arial,sans-serif;padding:24px;color:#111}
    h1{font-size:22px;margin-bottom:4px}
    .sub{color:#666;font-size:13px;margin-bottom:20px}
    .filters{background:#f3f4f6;padding:10px 14px;border-radius:6px;font-size:12px;margin-bottom:20px}
    .summary{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:24px}
    .card{border:1px solid #e5e7eb;border-radius:8px;padding:14px}
    .card h4{font-size:11px;color:#6b7280;margin-bottom:4px}
    .card p{font-size:20px;font-weight:700;color:#111}
    .card small{font-size:11px;color:#9ca3af}
    h2{font-size:15px;margin:20px 0 10px;border-bottom:2px solid #111;padding-bottom:6px}
    table{width:100%;border-collapse:collapse;font-size:12px;margin-bottom:24px}
    th{background:#1f2937;color:#fff;padding:8px 10px;text-align:left}
    td{padding:7px 10px;border-bottom:1px solid #e5e7eb}
    .footer{text-align:center;font-size:11px;color:#9ca3af;margin-top:20px;border-top:1px solid #e5e7eb;padding-top:12px}
    @media print{body{padding:10px}}
  </style></head><body>
  <h1>Guptodhan — Sales & Revenue Report</h1>
  <p class="sub">Generated: ${new Date().toLocaleString()}</p>
  ${filterLines ? `<div class="filters"><b>Filters Applied: </b>${filterLines}</div>` : ''}
  <div class="summary">
    <div class="card"><h4>Total Revenue</h4><p>৳${s.totalRevenue.toFixed(2)}</p></div>
    <div class="card"><h4>Admin Profit</h4><p style="color:#16a34a">৳${s.totalAdminProfit.toFixed(2)}</p></div>
    <div class="card"><h4>Delivery Revenue</h4><p>৳${s.totalDeliveryRevenue.toFixed(2)}</p></div>
    <div class="card"><h4>Total Orders</h4><p>${s.totalOrders}</p><small>Delivered: ${s.deliveredOrders} | Pending: ${s.pendingOrders}</small></div>
    <div class="card"><h4>Unique Customers</h4><p>${s.uniqueCustomersCount}</p></div>
    <div class="card"><h4>Unique Vendors</h4><p>${s.uniqueVendorsCount}</p></div>
    <div class="card"><h4>Paid Orders</h4><p>${s.paidOrders}</p><small>Unpaid: ${s.unpaidOrders}</small></div>
    <div class="card"><h4>Cancelled / Returned</h4><p>${s.cancelledOrders + s.returnedOrders}</p></div>
  </div>
  <h2>Vendor Breakdown</h2>
  <table><thead><tr>
    <th>#</th><th>Store</th><th>Commission</th><th>Orders</th><th>Delivered</th>
    <th>Revenue</th><th>Admin Earned</th><th>Vendor Net</th>
  </tr></thead><tbody>${vendorRows}</tbody></table>
  <h2>Customer Purchase History</h2>
  <table><thead><tr>
    <th>#</th><th>Customer</th><th>Phone</th><th>Orders</th>
    <th>Products</th><th>Total Spent</th><th>Last Order</th>
  </tr></thead><tbody>${customerRows}</tbody></table>
  <div class="footer">Computer-generated report — Guptodhan Admin Panel</div>
  <script>window.onload=()=>window.print()</script>
  </body></html>`);
  w.document.close();
}

// ─────────────────────────────────────────────
// Vendor Table
// ─────────────────────────────────────────────

function VendorTable({ data }: { data: VendorBreakdownItem[] }) {
  const [sort, setSort] = useState<SortState>({ key: 'totalRevenue', dir: 'desc' });

  const toggle = (key: string) =>
    setSort(prev =>
      prev.key === key
        ? { key, dir: prev.dir === 'desc' ? 'asc' : 'desc' }
        : { key, dir: 'desc' },
    );

  const sorted = sortData(data, sort);

  return (
    <div className="overflow-x-auto rounded-lg border border-[#e4e7eb]">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-800">
            <th className="px-3 py-2.5 text-xs font-semibold text-white text-left w-8">#</th>
            <Th label="Store Name"    colKey="storeName"           sort={sort} onSort={toggle} />
            <Th label="Commission %"  colKey="commissionRate"      sort={sort} onSort={toggle} right />
            <Th label="Total Orders"  colKey="totalOrders"         sort={sort} onSort={toggle} right />
            <Th label="Delivered"     colKey="deliveredOrders"     sort={sort} onSort={toggle} right />
            <Th label="Cancelled"     colKey="cancelledOrders"     sort={sort} onSort={toggle} right />
            <Th label="Revenue"       colKey="totalRevenue"        sort={sort} onSort={toggle} right />
            <Th label="Delivery ৳"   colKey="totalDeliveryCharge" sort={sort} onSort={toggle} right />
            <Th label="Admin Earned"  colKey="adminEarned"         sort={sort} onSort={toggle} right />
            <Th label="Vendor Net"    colKey="vendorNet"           sort={sort} onSort={toggle} right />
          </tr>
        </thead>
        <tbody>
          {sorted.length === 0 ? (
            <EmptyRow cols={10} />
          ) : (
            sorted.map((v, i) => (
              <tr key={v.storeId} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-3 py-2 text-gray-400 text-xs">{i + 1}</td>
                <td className="px-3 py-2">
                  <p className="font-medium text-gray-800">{v.storeName || '—'}</p>
                  <p className="text-xs text-gray-400">{v.storeEmail || ''}</p>
                </td>
                <td className="px-3 py-2 text-right">
                  <Badge variant="outline" className="text-xs">
                    {v.commissionRate}%
                  </Badge>
                </td>
                <td className="px-3 py-2 text-right font-medium">{v.totalOrders}</td>
                <td className="px-3 py-2 text-right">
                  <span className="text-green-600 font-medium">{v.deliveredOrders}</span>
                </td>
                <td className="px-3 py-2 text-right">
                  <span className="text-red-500">{v.cancelledOrders}</span>
                </td>
                <td className="px-3 py-2 text-right font-medium text-gray-700">
                  {tk(v.totalRevenue)}
                </td>
                <td className="px-3 py-2 text-right text-gray-500">
                  {tk(v.totalDeliveryCharge)}
                </td>
                <td className="px-3 py-2 text-right">
                  <span className="font-semibold text-green-600">{tk(v.adminEarned)}</span>
                </td>
                <td className="px-3 py-2 text-right">
                  <span className="font-medium text-blue-600">{tk(v.vendorNet)}</span>
                </td>
              </tr>
            ))
          )}
        </tbody>
        {sorted.length > 0 && (
          <tfoot>
            <tr className="bg-gray-100 border-t border-[#e4e7eb] font-semibold text-sm">
              <td className="px-3 py-2 text-gray-500 text-xs" colSpan={3}>
                {sorted.length} vendor{sorted.length !== 1 ? 's' : ''}
              </td>
              <td className="px-3 py-2 text-right">
                {sorted.reduce((s, v) => s + v.totalOrders, 0)}
              </td>
              <td className="px-3 py-2 text-right text-green-600">
                {sorted.reduce((s, v) => s + v.deliveredOrders, 0)}
              </td>
              <td className="px-3 py-2 text-right text-red-500">
                {sorted.reduce((s, v) => s + v.cancelledOrders, 0)}
              </td>
              <td className="px-3 py-2 text-right">
                {tk(sorted.reduce((s, v) => s + v.totalRevenue, 0))}
              </td>
              <td className="px-3 py-2 text-right">
                {tk(sorted.reduce((s, v) => s + v.totalDeliveryCharge, 0))}
              </td>
              <td className="px-3 py-2 text-right text-green-600">
                {tk(sorted.reduce((s, v) => s + v.adminEarned, 0))}
              </td>
              <td className="px-3 py-2 text-right text-blue-600">
                {tk(sorted.reduce((s, v) => s + v.vendorNet, 0))}
              </td>
            </tr>
          </tfoot>
        )}
      </table>
    </div>
  );
}

// ─────────────────────────────────────────────
// Customer Table
// ─────────────────────────────────────────────

function CustomerTable({ data }: { data: CustomerBreakdownItem[] }) {
  const [sort, setSort]   = useState<SortState>({ key: 'totalSpent', dir: 'desc' });
  const [search, setSearch] = useState('');

  const toggle = (key: string) =>
    setSort(prev =>
      prev.key === key
        ? { key, dir: prev.dir === 'desc' ? 'asc' : 'desc' }
        : { key, dir: 'desc' },
    );

  const filtered = data.filter(c =>
    !search ||
    c.customerName?.toLowerCase().includes(search.toLowerCase()) ||
    c.customerPhone?.includes(search),
  );

  const sorted = sortData(filtered, sort);

  return (
    <div className="space-y-3">
      {/* Search */}
      <div className="flex items-center gap-2">
        <Input
          placeholder="Search by name or phone…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="max-w-xs h-8 text-sm"
        />
        {search && (
          <span className="text-xs text-gray-400">
            {filtered.length} result{filtered.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      <div className="overflow-x-auto rounded-lg border border-[#e4e7eb]">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-800">
              <th className="px-3 py-2.5 text-xs font-semibold text-white text-left w-8">#</th>
              <Th label="Customer"      colKey="customerName"    sort={sort} onSort={toggle} />
              <Th label="Phone"         colKey="customerPhone"   sort={sort} onSort={toggle} />
              <Th label="Orders"        colKey="totalOrders"     sort={sort} onSort={toggle} right />
              <Th label="Delivered"     colKey="deliveredOrders" sort={sort} onSort={toggle} right />
              <Th label="Products"      colKey="totalProducts"   sort={sort} onSort={toggle} right />
              <Th label="Total Spent"   colKey="totalSpent"      sort={sort} onSort={toggle} right />
              <Th label="First Order"   colKey="firstOrderDate"  sort={sort} onSort={toggle} />
              <Th label="Last Order"    colKey="lastOrderDate"   sort={sort} onSort={toggle} />
              <th className="px-3 py-2.5 text-xs font-semibold text-white text-left">Cities</th>
            </tr>
          </thead>
          <tbody>
            {sorted.length === 0 ? (
              <EmptyRow cols={10} />
            ) : (
              sorted.map((c, i) => (
                <tr key={c.userId ?? i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-3 py-2 text-gray-400 text-xs">{i + 1}</td>
                  <td className="px-3 py-2 font-medium text-gray-800">
                    {c.customerName || '—'}
                  </td>
                  <td className="px-3 py-2 text-gray-600">{c.customerPhone || '—'}</td>
                  <td className="px-3 py-2 text-right font-medium">{c.totalOrders}</td>
                  <td className="px-3 py-2 text-right">
                    <span className="text-green-600 font-medium">{c.deliveredOrders}</span>
                  </td>
                  <td className="px-3 py-2 text-right text-gray-600">{c.totalProducts}</td>
                  <td className="px-3 py-2 text-right">
                    <span className="font-semibold text-gray-800">{tk(c.totalSpent)}</span>
                  </td>
                  <td className="px-3 py-2 text-xs text-gray-500">{fDate(c.firstOrderDate)}</td>
                  <td className="px-3 py-2 text-xs text-gray-500">{fDate(c.lastOrderDate)}</td>
                  <td className="px-3 py-2">
                    <div className="flex flex-wrap gap-1">
                      {(c.cities ?? []).slice(0, 3).map(city => (
                        <Badge
                          key={city}
                          variant="outline"
                          className="text-[10px] px-1.5 py-0"
                        >
                          {city}
                        </Badge>
                      ))}
                      {(c.cities ?? []).length > 3 && (
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                          +{c.cities.length - 3}
                        </Badge>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
          {sorted.length > 0 && (
            <tfoot>
              <tr className="bg-gray-100 border-t border-[#e4e7eb] font-semibold text-sm">
                <td className="px-3 py-2 text-gray-500 text-xs" colSpan={3}>
                  {sorted.length} customer{sorted.length !== 1 ? 's' : ''}
                </td>
                <td className="px-3 py-2 text-right">
                  {sorted.reduce((s, c) => s + c.totalOrders, 0)}
                </td>
                <td className="px-3 py-2 text-right text-green-600">
                  {sorted.reduce((s, c) => s + c.deliveredOrders, 0)}
                </td>
                <td className="px-3 py-2 text-right">
                  {sorted.reduce((s, c) => s + c.totalProducts, 0)}
                </td>
                <td className="px-3 py-2 text-right">
                  {tk(sorted.reduce((s, c) => s + c.totalSpent, 0))}
                </td>
                <td colSpan={3} />
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Order Status Breakdown (mini overview bar)
// ─────────────────────────────────────────────

function OrderStatusBar({ summary }: { summary: AdminSummary }) {
  const statuses = [
    { label: 'Delivered',   count: summary.deliveredOrders,  color: 'bg-green-500' },
    { label: 'Pending',     count: summary.pendingOrders,    color: 'bg-yellow-400' },
    { label: 'Processing',  count: summary.processingOrders, color: 'bg-blue-400' },
    { label: 'Shipped',     count: summary.shippedOrders,    color: 'bg-indigo-400' },
    { label: 'Cancelled',   count: summary.cancelledOrders,  color: 'bg-red-400' },
    { label: 'Returned',    count: summary.returnedOrders,   color: 'bg-orange-400' },
  ];

  const total = summary.totalOrders || 1;

  return (
    <div className="border border-[#e4e7eb] rounded-lg p-4 bg-white">
      <p className="text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wide">
        Order Status Breakdown
      </p>
      {/* Bar */}
      <div className="flex h-3 rounded-full overflow-hidden gap-0.5 mb-3">
        {statuses.map(s =>
          s.count > 0 ? (
            <div
              key={s.label}
              className={`${s.color} transition-all`}
              style={{ width: `${(s.count / total) * 100}%` }}
              title={`${s.label}: ${s.count}`}
            />
          ) : null,
        )}
      </div>
      {/* Legend */}
      <div className="flex flex-wrap gap-x-4 gap-y-1.5">
        {statuses.map(s => (
          <div key={s.label} className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${s.color} shrink-0`} />
            <span className="text-xs text-gray-600">
              {s.label}:{' '}
              <span className="font-semibold text-gray-800">{s.count}</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Payment Breakdown
// ─────────────────────────────────────────────

function PaymentBreakdown({ summary }: { summary: AdminSummary }) {
  const rows = [
    { label: 'Paid Orders',   value: summary.paidOrders,   color: 'text-green-600' },
    { label: 'Unpaid Orders', value: summary.unpaidOrders, color: 'text-yellow-600' },
  ];

  return (
    <div className="border border-[#e4e7eb] rounded-lg p-4 bg-white">
      <p className="text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wide">
        Payment Overview
      </p>
      <div className="space-y-2">
        {rows.map(r => (
          <div key={r.label} className="flex items-center justify-between">
            <span className="text-sm text-gray-600">{r.label}</span>
            <span className={`text-sm font-bold ${r.color}`}>{r.value}</span>
          </div>
        ))}
        <div className="border-t border-[#e4e7eb] pt-2 flex items-center justify-between">
          <span className="text-sm text-gray-500">Total</span>
          <span className="text-sm font-bold text-gray-800">{summary.totalOrders}</span>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Revenue Breakdown
// ─────────────────────────────────────────────

function RevenueBreakdown({ summary }: { summary: AdminSummary }) {
  const rows = [
    { label: 'Gross Revenue',     value: summary.totalRevenue,        color: 'text-gray-800' },
    { label: 'Product Revenue',   value: summary.totalProductRevenue,  color: 'text-gray-600' },
    { label: 'Delivery Revenue',  value: summary.totalDeliveryRevenue, color: 'text-blue-600' },
    { label: 'Admin Profit',      value: summary.totalAdminProfit,     color: 'text-green-600' },
    {
      label: 'Vendor Earnings (est.)',
      value: summary.totalProductRevenue - summary.totalAdminProfit,
      color: 'text-indigo-600',
    },
  ];

  return (
    <div className="border border-[#e4e7eb] rounded-lg p-4 bg-white col-span-2">
      <p className="text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wide">
        Revenue Breakdown
      </p>
      <div className="space-y-2">
        {rows.map((r, i) => (
          <div
            key={r.label}
            className={`flex items-center justify-between ${i === rows.length - 1 ? 'border-t border-[#e4e7eb] pt-2 mt-2' : ''}`}
          >
            <span className="text-sm text-gray-600">{r.label}</span>
            <span className={`text-sm font-bold ${r.color}`}>{tk(r.value)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────

export default function AdminDashboardReport() {
  // ── Filter state ─────────────────────────────
  const [startDate,     setStartDate]     = useState('');
  const [endDate,       setEndDate]       = useState('');
  const [orderStatus,   setOrderStatus]   = useState<string | undefined>(undefined);
  const [paymentStatus, setPaymentStatus] = useState<string | undefined>(undefined);
  const [paymentMethod, setPaymentMethod] = useState<string | undefined>(undefined);

  // ── Data state ───────────────────────────────
  const [reportData, setReportData] = useState<AdminDashboardData | null>(null);
  const [isLoading,  setIsLoading]  = useState(false);

  const { data: session } = useSession();
  const token = (session as any)?.accessToken;

  // ── Generate report ──────────────────────────
  const onGenerate = async () => {
    if (!token) { toast.error('Authentication required.'); return; }
    setIsLoading(true);
    setReportData(null);

    try {
      const params = new URLSearchParams();
      if (startDate)     params.append('startDate',     startDate);
      if (endDate)       params.append('endDate',       endDate);
      if (orderStatus)   params.append('orderStatus',   orderStatus);
      if (paymentStatus) params.append('paymentStatus', paymentStatus);
      if (paymentMethod) params.append('paymentMethod', paymentMethod);

      const res = await axios.get(
        `/api/v1/product-order/reports/admin-dashboard?${params.toString()}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (res.data.success) {
        setReportData(res.data.data);
        toast.success(
          `Report ready — ${res.data.data.summary.totalOrders} orders across ` +
          `${res.data.data.vendorBreakdown.length} vendors, ` +
          `${res.data.data.customerBreakdown.length} customers.`,
        );
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to generate report.');
    } finally {
      setIsLoading(false);
    }
  };

  // ── Reset filters ────────────────────────────
  const onReset = () => {
    setStartDate('');
    setEndDate('');
    setOrderStatus(undefined);
    setPaymentStatus(undefined);
    setPaymentMethod(undefined);
  };

  // ── Active filter count ──────────────────────
  const activeFilters = [startDate, endDate, orderStatus, paymentStatus, paymentMethod].filter(Boolean).length;

  // ── Filters object for print ─────────────────
  const filtersForPrint: Record<string, string> = {
    'Start Date':      startDate,
    'End Date':        endDate,
    'Order Status':    orderStatus  ?? '',
    'Payment Status':  paymentStatus ?? '',
    'Payment Method':  paymentMethod ?? '',
  };

  const s = reportData?.summary;

  // ─────────────────────────────────────────────
  return (
    <div className="space-y-6">

      {/* ── Filters ───────────────────────────── */}
      <div className="border border-[#e4e7eb] rounded-lg bg-white">

        <div className="flex items-center gap-2 px-4 pt-4 pb-2">
          <Filter className="h-4 w-4 text-gray-400" />
          <span className="text-sm font-medium text-gray-700">Filters</span>
          {activeFilters > 0 && (
            <Badge variant="secondary" className="text-xs h-4 px-1.5">
              {activeFilters} active
            </Badge>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 px-4 pb-4">
          <div>
            <Label className="mb-1 block text-xs">Start Date</Label>
            <Input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="h-9" />
          </div>
          <div>
            <Label className="mb-1 block text-xs">End Date</Label>
            <Input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="h-9" />
          </div>
          <div>
            <Label className="mb-1 block text-xs">Order Status</Label>
            <Select value={orderStatus} onValueChange={setOrderStatus}>
              <SelectTrigger className="h-9"><SelectValue placeholder="All Statuses" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Processing">Processing</SelectItem>
                <SelectItem value="Shipped">Shipped</SelectItem>
                <SelectItem value="Delivered">Delivered</SelectItem>
                <SelectItem value="Cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="mb-1 block text-xs">Payment Status</Label>
            <Select value={paymentStatus} onValueChange={setPaymentStatus}>
              <SelectTrigger className="h-9"><SelectValue placeholder="All Statuses" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Paid">Paid</SelectItem>
                <SelectItem value="Failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="mb-1 block text-xs">Payment Method</Label>
            <Select value={paymentMethod} onValueChange={setPaymentMethod}>
              <SelectTrigger className="h-9"><SelectValue placeholder="All Methods" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="COD">Cash On Delivery</SelectItem>
                <SelectItem value="card">Online (Card/Mobile)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 px-4 py-3 border-t border-[#e4e7eb]">
          {activeFilters > 0 && (
            <Button variant="ghost" size="sm" onClick={onReset} className="text-gray-500 h-8">
              Reset
            </Button>
          )}
          <Button onClick={onGenerate} disabled={isLoading} size="sm" className="h-8">
            {isLoading && <Loader2 className="animate-spin mr-2 h-3.5 w-3.5" />}
            Generate Report
          </Button>
        </div>
      </div>

      {/* ── Loading ────────────────────────────── */}
      {isLoading && (
        <div className="flex flex-col justify-center items-center h-48 gap-3">
          <Loader2 className="animate-spin text-blue-500 h-8 w-8" />
          <p className="text-sm text-gray-400">Generating report, please wait…</p>
        </div>
      )}

      {/* ── Results ────────────────────────────── */}
      {reportData && !isLoading && (
        <div className="space-y-6">

          {/* Action row */}
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-400">
              {s?.totalOrders} orders ·{' '}
              {reportData.vendorBreakdown.length} vendors ·{' '}
              {reportData.customerBreakdown.length} customers
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-7 text-xs"
                onClick={() => handlePrint(reportData, filtersForPrint)}
              >
                <Printer className="mr-1.5 h-3.5 w-3.5" />
                Print
              </Button>
            </div>
          </div>

          {/* ── Summary Cards ───────────────────── */}
          {s && (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <SummaryCard
                title="Total Revenue"
                value={tk(s.totalRevenue)}
                subtitle={`${s.totalOrders} orders`}
                icon={<TrendingUp className="h-5 w-5 text-blue-600" />}
                accent="border-blue-200"
                bg="bg-blue-50"
              />
              <SummaryCard
                title="Admin Profit"
                value={tk(s.totalAdminProfit)}
                subtitle="Commission earned"
                icon={<CreditCard className="h-5 w-5 text-green-600" />}
                accent="border-green-200"
                bg="bg-green-50"
              />
              <SummaryCard
                title="Delivery Revenue"
                value={tk(s.totalDeliveryRevenue)}
                subtitle="Shipping charges"
                icon={<Truck className="h-5 w-5 text-indigo-600" />}
                accent="border-indigo-200"
                bg="bg-indigo-50"
              />
              <SummaryCard
                title="Product Revenue"
                value={tk(s.totalProductRevenue)}
                subtitle="Excl. delivery"
                icon={<Package className="h-5 w-5 text-purple-600" />}
                accent="border-purple-200"
                bg="bg-purple-50"
              />
              <SummaryCard
                title="Total Orders"
                value={String(s.totalOrders)}
                subtitle={`${s.deliveredOrders} delivered`}
                icon={<ShoppingBag className="h-5 w-5 text-orange-500" />}
                accent="border-orange-200"
                bg="bg-orange-50"
              />
              <SummaryCard
                title="Cancelled / Returned"
                value={String(s.cancelledOrders + s.returnedOrders)}
                subtitle={`${s.cancelledOrders} cancelled · ${s.returnedOrders} returned`}
                icon={<TrendingDown className="h-5 w-5 text-red-500" />}
                accent="border-red-200"
                bg="bg-red-50"
              />
              <SummaryCard
                title="Unique Customers"
                value={String(s.uniqueCustomersCount)}
                icon={<Users className="h-5 w-5 text-teal-600" />}
                accent="border-teal-200"
                bg="bg-teal-50"
              />
              <SummaryCard
                title="Active Vendors"
                value={String(s.uniqueVendorsCount)}
                icon={<Store className="h-5 w-5 text-yellow-600" />}
                accent="border-yellow-200"
                bg="bg-yellow-50"
              />
            </div>
          )}

          {/* ── Overview mini-charts ─────────────── */}
          {s && (
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <RevenueBreakdown summary={s} />
              <OrderStatusBar  summary={s} />
              <PaymentBreakdown summary={s} />
            </div>
          )}

          {/* ── Tabs ─────────────────────────────── */}
          <Tabs defaultValue="vendor">
            <div className="flex items-center justify-between mb-3">
              <TabsList>
                <TabsTrigger value="vendor">
                  Vendor Report
                  <Badge variant="secondary" className="ml-1.5 text-[10px] h-4 px-1">
                    {reportData.vendorBreakdown.length}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="customer">
                  Customer History
                  <Badge variant="secondary" className="ml-1.5 text-[10px] h-4 px-1">
                    {reportData.customerBreakdown.length}
                  </Badge>
                </TabsTrigger>
              </TabsList>

              {/* Per-tab export buttons */}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs"
                  onClick={() => exportVendorCSV(reportData.vendorBreakdown)}
                >
                  <Download className="mr-1.5 h-3.5 w-3.5" />
                  Vendor CSV
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs"
                  onClick={() => exportCustomerCSV(reportData.customerBreakdown)}
                >
                  <Download className="mr-1.5 h-3.5 w-3.5" />
                  Customer CSV
                </Button>
              </div>
            </div>

            {/* Vendor Tab */}
            <TabsContent value="vendor" className="mt-0">
              {reportData.vendorBreakdown.length === 0 ? (
                <div className="text-center py-12 border border-[#e4e7eb] rounded-lg text-gray-400 text-sm">
                  No vendor data for the selected filters.
                </div>
              ) : (
                <VendorTable data={reportData.vendorBreakdown} />
              )}
            </TabsContent>

            {/* Customer Tab */}
            <TabsContent value="customer" className="mt-0">
              {reportData.customerBreakdown.length === 0 ? (
                <div className="text-center py-12 border border-[#e4e7eb] rounded-lg text-gray-400 text-sm">
                  No customer data for the selected filters.
                </div>
              ) : (
                <CustomerTable data={reportData.customerBreakdown} />
              )}
            </TabsContent>
          </Tabs>
        </div>
      )}

      {/* ── Empty state (generated but 0 results) ─ */}
      {reportData && reportData.summary.totalOrders === 0 && !isLoading && (
        <div className="text-center py-12 border border-[#e4e7eb] rounded-lg">
          <ShoppingBag className="h-10 w-10 text-gray-200 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">No orders found for the selected filters.</p>
          <p className="text-gray-400 text-xs mt-1">Try adjusting your date range or filters.</p>
        </div>
      )}
    </div>
  );
}