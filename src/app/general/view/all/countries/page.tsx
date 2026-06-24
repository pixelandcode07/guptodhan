// src/app/(dashboard)/general/view/all/countries/page.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image'; // ✅ Added Image import
import { Plus, Search, Pencil, Trash2, Globe, ToggleLeft, ToggleRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useCountry, ICountry } from '@/hooks/useCountry';
import CountryFormModal from '@/components/DashboardComponent/ProductConfig/Country/CountryFormModal';
import CountryDeleteDialog from '@/components/DashboardComponent/ProductConfig/Country/CountryDeleteDialog';

export default function CountriesPage() {
  const {
    countries,
    loading,
    submitting,
    createCountry,
    updateCountry,
    deleteCountry,
    toggleStatus,
  } = useCountry();

  // ── Modal states ──────────────────────────────────────────────────────────
  const [formOpen, setFormOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<ICountry | null>(null);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<ICountry | null>(null);

  // ── Search ────────────────────────────────────────────────────────────────
  const [search, setSearch] = useState('');

  const filtered = countries.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      (c.code && c.code.toLowerCase().includes(search.toLowerCase()))
  );

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleOpenAdd = () => {
    setEditTarget(null);
    setFormOpen(true);
  };

  const handleOpenEdit = (country: ICountry) => {
    setEditTarget(country);
    setFormOpen(true);
  };

  const handleFormSubmit = async (data: any) => {
    if (editTarget) {
      return updateCountry(editTarget._id, data);
    }
    return createCountry(data);
  };

  const handleDeleteClick = (country: ICountry) => {
    setDeleteTarget(country);
    setDeleteOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    await deleteCountry(deleteTarget._id, deleteTarget.name);
    setDeleteOpen(false);
    setDeleteTarget(null);
  };

  // ── Stats ─────────────────────────────────────────────────────────────────
  const activeCount = countries.filter((c) => c.status === 'active').length;
  const inactiveCount = countries.filter((c) => c.status === 'inactive').length;

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">

      {/* ── Page Header ──────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Globe className="w-6 h-6 text-primary" />
            Product Countries
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage countries for product variants
          </p>
        </div>
        <Button onClick={handleOpenAdd} className="shrink-0">
          <Plus className="w-4 h-4 mr-2" />
          Add Country
        </Button>
      </div>

      {/* ── Stats Cards ──────────────────────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-muted-foreground text-sm">Total</p>
            <p className="text-3xl font-bold">{countries.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-muted-foreground text-sm">Active</p>
            <p className="text-3xl font-bold text-green-600">{activeCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-muted-foreground text-sm">Inactive</p>
            <p className="text-3xl font-bold text-red-500">{inactiveCount}</p>
          </CardContent>
        </Card>
      </div>

      {/* ── Table Card ───────────────────────────────────────────────────── */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
            <CardTitle className="text-base font-medium">
              All Countries ({filtered.length})
            </CardTitle>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or code..."
                className="pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="rounded-b-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="w-10">#</TableHead>
                  <TableHead>Flag</TableHead>
                  <TableHead>Country Name</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {/* Loading skeletons */}
                {loading &&
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-4 w-6" /></TableCell>
                      <TableCell><Skeleton className="h-7 w-10 rounded" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-36" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-10" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-16 rounded-full" /></TableCell>
                      <TableCell className="text-right">
                        <Skeleton className="h-8 w-20 ml-auto" />
                      </TableCell>
                    </TableRow>
                  ))}

                {/* Empty state */}
                {!loading && filtered.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center py-16 text-muted-foreground"
                    >
                      {search
                        ? `No country found for "${search}"`
                        : 'No countries added yet. Click "Add Country" to get started.'}
                    </TableCell>
                  </TableRow>
                )}

                {/* Data rows */}
                {!loading &&
                  filtered.map((country, idx) => (
                    <TableRow key={country._id} className="hover:bg-muted/30">
                      <TableCell className="text-muted-foreground text-sm">
                        {idx + 1}
                      </TableCell>

                      {/* ✅ FIX: Displaying Image properly instead of raw URL string */}
                      <TableCell>
                        {country.flag && (country.flag.startsWith('http') || country.flag.startsWith('/')) ? (
                          <div className="relative w-10 h-7 overflow-hidden rounded border border-gray-200 shadow-sm">
                            <Image 
                              src={country.flag} 
                              alt={`${country.name} flag`}
                              fill
                              sizes="40px"
                              className="object-cover"
                              unoptimized // ✅ Bypass Next.js image domain config for external CDNs
                            />
                          </div>
                        ) : (
                          <span className="text-2xl leading-none">
                            {country.flag || '🌐'}
                          </span>
                        )}
                      </TableCell>

                      {/* Name */}
                      <TableCell className="font-medium">{country.name}</TableCell>

                      {/* Code */}
                      <TableCell>
                        {country.code ? (
                          <code className="text-xs bg-muted px-2 py-1 rounded font-mono">
                            {country.code}
                          </code>
                        ) : (
                          <span className="text-muted-foreground text-xs">—</span>
                        )}
                      </TableCell>

                      {/* Status badge */}
                      <TableCell>
                        <Badge
                          variant={country.status === 'active' ? 'default' : 'secondary'}
                          className={
                            country.status === 'active'
                              ? 'bg-green-100 text-green-700 hover:bg-green-100'
                              : 'bg-red-100 text-red-600 hover:bg-red-100'
                          }
                        >
                          {country.status}
                        </Badge>
                      </TableCell>

                      {/* Actions */}
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          {/* Toggle Status */}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            title={
                              country.status === 'active'
                                ? 'Deactivate'
                                : 'Activate'
                            }
                            onClick={() => toggleStatus(country._id, country.status)}
                          >
                            {country.status === 'active' ? (
                              <ToggleRight className="w-4 h-4 text-green-600" />
                            ) : (
                              <ToggleLeft className="w-4 h-4 text-muted-foreground" />
                            )}
                          </Button>

                          {/* Edit */}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleOpenEdit(country)}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>

                          {/* Delete */}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                            onClick={() => handleDeleteClick(country)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* ── Modals ───────────────────────────────────────────────────────── */}
      <CountryFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
        submitting={submitting}
        editData={editTarget}
      />

      <CountryDeleteDialog
        open={deleteOpen}
        country={deleteTarget}
        onConfirm={handleDeleteConfirm}
        onCancel={() => {
          setDeleteOpen(false);
          setDeleteTarget(null);
        }}
      />
    </div>
  );
}