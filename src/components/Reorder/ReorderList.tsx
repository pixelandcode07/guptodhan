'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { ChevronUp, ChevronDown, GripVertical, Save, RefreshCw } from 'lucide-react';

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
  buildHeaders,
}: ReorderListProps) {
  const { data: session } = useSession();
  const s = session as (undefined | { accessToken?: string; user?: { role?: string } });
  const token = s?.accessToken;
  const role = s?.user?.role;

  const [items, setItems] = useState<ReorderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);

  const dragIndexRef = useRef<number | null>(null);
  const scrollAnimRef = useRef<number | null>(null);

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
      setItems(mapped);
    } catch (e: unknown) {
      const err = e as { message?: string };
      toast.error(err?.message || 'Failed to load items');
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [fetchUrl, headers, mapItem]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const stopAutoScroll = () => {
    if (scrollAnimRef.current) {
      cancelAnimationFrame(scrollAnimRef.current);
      scrollAnimRef.current = null;
    }
  };

  const handleAutoScroll = (clientY: number) => {
    const topEdge = 140;
    const bottomEdge = window.innerHeight - 140;

    stopAutoScroll();

    if (clientY < topEdge) {
      const speed = Math.max(10, Math.min(30, Math.floor((topEdge - clientY) / 3)));
      const step = () => {
        window.scrollBy(0, -speed);
        scrollAnimRef.current = requestAnimationFrame(step);
      };
      scrollAnimRef.current = requestAnimationFrame(step);
    } else if (clientY > bottomEdge) {
      const speed = Math.max(10, Math.min(30, Math.floor((clientY - bottomEdge) / 3)));
      const step = () => {
        window.scrollBy(0, speed);
        scrollAnimRef.current = requestAnimationFrame(step);
      };
      scrollAnimRef.current = requestAnimationFrame(step);
    }
  };

  const onDragStart = (idx: number, e: React.DragEvent<HTMLDivElement>) => {
    dragIndexRef.current = idx;
    setDraggedIdx(idx);
    e.dataTransfer.effectAllowed = 'move';
  };

  const onDragOver = (e: React.DragEvent<HTMLDivElement>, idx: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    handleAutoScroll(e.clientY);

    const from = dragIndexRef.current;
    if (from !== null && from !== idx) {
      dragIndexRef.current = idx;
      setDraggedIdx(idx);
      setItems((prev) => {
        const next = [...prev];
        const [moved] = next.splice(from, 1);
        next.splice(idx, 0, moved);
        return next;
      });
    }
  };

  const onDragEnd = () => {
    stopAutoScroll();
    dragIndexRef.current = null;
    setDraggedIdx(null);
  };

  const moveItem = (idx: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= items.length) return;
    setItems((prev) => {
      const next = [...prev];
      const temp = next[idx];
      next[idx] = next[targetIdx];
      next[targetIdx] = temp;
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
      toast.success(json?.message || 'Order saved successfully!');
    } catch (e: unknown) {
      const err = e as { message?: string };
      toast.error(err?.message || 'Failed to save new order');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-4 sm:py-6">
      <div className="container mx-auto px-3 sm:px-4 lg:px-8 space-y-4 sm:space-y-6 max-w-4xl">
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              {title || 'Rearrange Items'}
            </h1>
            {description && (
              <p className="text-sm text-gray-600 mt-1">{description}</p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={fetchItems}
              disabled={loading || saving}
              className="gap-1.5"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button
              onClick={saveOrder}
              disabled={loading || saving}
              className="bg-blue-600 hover:bg-blue-700 text-white gap-1.5 font-semibold"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Saving...' : 'Save Order'}
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-3 sm:p-4">
          {loading ? (
            <div className="py-12 text-center text-gray-500 font-medium">Loading items...</div>
          ) : items.length === 0 ? (
            <div className="py-12 text-center text-gray-500">No items found.</div>
          ) : (
            <div className="space-y-2">
              {items.map((item, idx) => {
                const isDraggingThis = draggedIdx === idx;
                return (
                  <div
                    key={item.id}
                    draggable
                    onDragStart={(e) => onDragStart(idx, e)}
                    onDragOver={(e) => onDragOver(e, idx)}
                    onDragEnd={onDragEnd}
                    className={`flex items-center justify-between p-3 sm:p-4 rounded-lg border transition-all select-none ${
                      isDraggingThis
                        ? 'bg-blue-100/80 border-blue-400 shadow-md scale-[1.01]'
                        : 'bg-white hover:bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-700 p-1">
                        <GripVertical className="w-5 h-5" />
                      </div>
                      <span className="font-mono text-xs font-semibold text-gray-400 w-6">
                        #{idx + 1}
                      </span>
                      <span className="truncate font-medium text-gray-900 text-sm sm:text-base">
                        {item.label}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 ml-3">
                      {item.extra}
                      <div className="flex items-center gap-0.5 border border-gray-200 rounded-md bg-gray-50">
                        <button
                          type="button"
                          onClick={() => moveItem(idx, 'up')}
                          disabled={idx === 0}
                          className="p-1 hover:bg-gray-200 disabled:opacity-30 rounded-l text-gray-700"
                          title="Move Up"
                        >
                          <ChevronUp className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => moveItem(idx, 'down')}
                          disabled={idx === items.length - 1}
                          className="p-1 hover:bg-gray-200 disabled:opacity-30 rounded-r text-gray-700"
                          title="Move Down"
                        >
                          <ChevronDown className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
