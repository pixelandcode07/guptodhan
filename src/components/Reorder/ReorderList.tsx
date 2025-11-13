'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

type ReorderItem = {
  id: string;
  label: string;
  extra?: React.ReactNode;
};

type ReorderListProps = {
  title?: string;
  description?: string;
  /** GET endpoint to fetch items */
  fetchUrl: string;
  /** PATCH endpoint that accepts { orderedIds: string[] } */
  patchUrl: string;
  /** Map raw item to { id, label } */
  mapItem: (raw: unknown) => ReorderItem | null;
  /** Optional sort comparator before initial render */
  sortItems?: (a: ReorderItem, b: ReorderItem) => number;
  /** Optional: wrapper around fetch for custom headers (fallback to session auth) */
  buildHeaders?: (token?: string, role?: string) => Record<string, string>;
};

export default function ReorderList({
  title,
  description,
  fetchUrl,
  patchUrl,
  mapItem,
  sortItems,
  buildHeaders,
}: ReorderListProps) {
  const { data: session } = useSession();
  const s = session as (undefined | { accessToken?: string; user?: { role?: string } });
  const token = s?.accessToken;
  const role = s?.user?.role;

  const [items, setItems] = useState<ReorderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const dragIndexRef = useRef<number | null>(null);

  const headers = useMemo(() => {
    const base: Record<string, string> = buildHeaders
      ? buildHeaders(token, role)
      : {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...(role ? { 'x-user-role': role } : {}),
        };
    return base;
  }, [token, role, buildHeaders]);

  const fetchItems = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(fetchUrl, { headers: { ...headers, 'Cache-Control': 'no-store' } });
      const json = await res.json().catch(() => ({} as unknown));
      const raw = (json as { data?: unknown[] })?.data || [];
      const mapped = raw
        .map(mapItem)
        .filter(Boolean) as ReorderItem[];
      const sorted = sortItems ? mapped.sort(sortItems) : mapped;
      setItems(sorted);
    } catch (e: unknown) {
      const err = e as { message?: string };
      toast.error(err?.message || 'Failed to load items');
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [fetchUrl, headers, mapItem, sortItems]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const onDragStart = (idx: number) => {
    dragIndexRef.current = idx;
  };

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const onDrop = (idx: number) => {
    const from = dragIndexRef.current;
    dragIndexRef.current = null;
    if (from === null || from === idx) return;
    setItems((prev) => {
      const next = [...prev];
      const [moved] = next.splice(from, 1);
      next.splice(idx, 0, moved);
      return next;
    });
  };

  const saveOrder = async () => {
    if (role !== 'admin') {
      toast.error('Access denied: Admin privileges required');
      return;
    }
    try {
      setSaving(true);
      const orderedIds = items.map((i) => i.id);
      const res = await fetch(patchUrl, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
        body: JSON.stringify({ orderedIds }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(json?.message || 'Failed to save new order');
      }
      toast.success(json?.message || 'Order saved');
    } catch (e: unknown) {
      const err = e as { message?: string };
      toast.error(err?.message || 'Failed to save new order');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-3 py-4 sm:px-4 sm:py-6 lg:px-8 space-y-4 sm:space-y-6">
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                {title || 'Rearrange Items'}
              </h1>
              {description && (
                <p className="text-sm text-gray-600 mt-1">{description}</p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button onClick={saveOrder} disabled={loading || saving}>
                {saving ? 'Saving...' : 'Save Order'}
              </Button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-3 sm:p-4">
          {loading ? (
            <div className="py-10 text-center text-gray-500">Loading...</div>
          ) : items.length === 0 ? (
            <div className="py-10 text-center text-gray-500">No items found.</div>
          ) : (
            <div className="space-y-2">
              {items.map((item, idx) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 border border-gray-200 rounded-lg cursor-move"
                  draggable
                  onDragStart={() => onDragStart(idx)}
                  onDragOver={onDragOver}
                  onDrop={() => onDrop(idx)}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="select-none text-gray-400">≡</span>
                    <span className="truncate font-medium text-gray-900">{item.label}</span>
                  </div>
                  {item.extra && <div className="ml-3 shrink-0">{item.extra}</div>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


