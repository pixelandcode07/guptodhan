"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { DataTable } from "@/components/TableHelper/data-table";
import { wishlist_columns, Wishlist } from "@/components/TableHelper/wishlist_columns";
import WishlistHeader from "./WishlistHeader";
import WishlistFilters from "./WishlistFilters";
import { useSession } from "next-auth/react";
import axios from "axios";

export default function WishlistClient({ initialRows }: { initialRows: Wishlist[] }) {
  const [rows, setRows] = useState<Wishlist[]>(initialRows || []);
  const [searchText, setSearchText] = useState("");
  const { data: session } = useSession();

  type Session = {
    user?: { role?: string; id?: string };
    accessToken?: string;
  };
  const s = session as Session | null;
  const token = s?.accessToken;
  const userRole = s?.user?.role;
  const userId = s?.user?.id;

  useEffect(() => {
    setRows(initialRows || []);
  }, [initialRows]);

  const fetchWishlists = useCallback(async () => {
    try {
      console.log("Fetching wishlists with:", { token: !!token, userRole, userId });
      
      const response = await axios.get("/api/v1/wishlist", {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...(userRole ? { "x-user-role": userRole } : {}),
        },
      });

      console.log("API Response:", response.data);

      type ApiWishlist = {
        _id?: string;
        wishlistID?: string;
        userName?: string;
        userEmail?: string;
        userID?: string;
        productID?: string;
        createdAt?: string;
      };

      const items: ApiWishlist[] = Array.isArray(response.data?.data)
        ? response.data.data
        : [];

      console.log("Items found:", items.length, items);

      const mapped: Wishlist[] = items.map((w, index) => ({
        id: index + 1,
        category: "",
        image: "",
        product: String(w.productID ?? ""),
        customer_name: String(w.userName ?? ""),
        email: String(w.userEmail ?? ""),
        contact: "",
        created_at: w.createdAt
          ? new Date(w.createdAt).toLocaleString()
          : "",
      }));

      console.log("Mapped wishlists:", mapped);
      setRows(mapped);
    } catch (error) {
      console.error("Failed to fetch wishlists", error);
    }
  }, [token, userRole]);

  useEffect(() => {
    fetchWishlists();
  }, [fetchWishlists]);

  const columns = useMemo(() => wishlist_columns, []);

  const filtered = useMemo(() => {
    const bySearch = (r: Wishlist) => {
      if (!searchText.trim()) return true;
      const search = searchText.toLowerCase();
      return r.product.toLowerCase().includes(search) || 
             r.customer_name.toLowerCase().includes(search) ||
             r.email.toLowerCase().includes(search) ||
             r.category.toLowerCase().includes(search);
    };

    return rows.filter(r => bySearch(r));
  }, [rows, searchText]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-pink-50">
      <div className="container mx-auto px-3 py-4 sm:px-4 sm:py-6 lg:px-8 space-y-4 sm:space-y-6">
        <WishlistHeader />
        <WishlistFilters
          searchText={searchText}
          setSearchText={setSearchText}
        />
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <DataTable columns={columns} data={filtered} />
        </div>
      </div>
    </div>
  );
}
