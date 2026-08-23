"use client";

import { useState, useMemo } from "react";
import {
  ShoppingBag,
  Search,
  CheckCircle2,
  Clock,
  Truck,
  PackageCheck,
  XCircle,
  CreditCard,
  Phone,
  Mail,
  MapPin,
  Sparkles,
  AlertCircle,
} from "lucide-react";

export interface AdminOrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  price: number;
  product: {
    name: string;
    slug: string;
    image: string | null;
  };
}

export interface AdminOrder {
  id: string;
  orderNumber: string;
  fullName: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string | null;
  city: string;
  state: string;
  pincode: string;
  totalPrice: number;
  status: "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  paymentStatus: "UNPAID" | "PAID" | "REFUNDED";
  createdAt: string | Date;
  updatedAt: string | Date;
  items: AdminOrderItem[];
}

interface OrdersTabProps {
  orders: AdminOrder[];
  onOrdersUpdated: (orders: AdminOrder[]) => void;
}

export function OrdersTab({ orders, onOrdersUpdated }: OrdersTabProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [paymentFilter, setPaymentFilter] = useState("ALL");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [updateError, setUpdateError] = useState<string | null>(null);

  // Filtered orders
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const q = searchTerm.toLowerCase().trim();
      const matchesSearch =
        !q ||
        order.orderNumber.toLowerCase().includes(q) ||
        order.fullName.toLowerCase().includes(q) ||
        order.email.toLowerCase().includes(q) ||
        order.phone.includes(q) ||
        order.city.toLowerCase().includes(q);

      const matchesStatus = statusFilter === "ALL" || order.status === statusFilter;
      const matchesPayment =
        paymentFilter === "ALL" || order.paymentStatus === paymentFilter;

      return matchesSearch && matchesStatus && matchesPayment;
    });
  }, [orders, searchTerm, statusFilter, paymentFilter]);

  // Order stats
  const totalRevenue = useMemo(() => {
    return orders.reduce((sum, o) => sum + (o.status !== "CANCELLED" ? o.totalPrice : 0), 0);
  }, [orders]);

  const pendingCount = useMemo(() => {
    return orders.filter((o) => o.status === "PENDING").length;
  }, [orders]);

  const handleStatusChange = async (
    id: string,
    status?: AdminOrder["status"],
    paymentStatus?: AdminOrder["paymentStatus"]
  ) => {
    setUpdatingId(id);
    setUpdateError(null);

    try {
      const res = await fetch(`/api/admin/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, paymentStatus }),
      });

      if (!res.ok) {
        const data = await res.json();
        setUpdateError(data.error || "Failed to update order");
        setUpdatingId(null);
        return;
      }

      const updated = await res.json();
      onOrdersUpdated(orders.map((o) => (o.id === id ? updated : o)));
    } catch (err) {
      console.error("Update order error:", err);
      setUpdateError("Network error occurred while updating order status");
    } finally {
      setUpdatingId(null);
    }
  };

  const getOrderStatusBadge = (status: AdminOrder["status"]) => {
    switch (status) {
      case "DELIVERED":
        return "bg-emerald-950/60 border-emerald-500/30 text-emerald-400";
      case "SHIPPED":
        return "bg-sky-950/60 border-sky-500/30 text-sky-400";
      case "PROCESSING":
        return "bg-indigo-950/60 border-indigo-500/30 text-indigo-400";
      case "CANCELLED":
        return "bg-rose-950/60 border-rose-500/30 text-rose-400";
      default:
        return "bg-amber-950/60 border-amber-500/30 text-amber-400";
    }
  };

  const getPaymentStatusBadge = (status: AdminOrder["paymentStatus"]) => {
    switch (status) {
      case "PAID":
        return "bg-emerald-950/60 border-emerald-500/30 text-emerald-400";
      case "REFUNDED":
        return "bg-rose-950/60 border-rose-500/30 text-rose-400";
      default:
        return "bg-amber-950/60 border-amber-500/30 text-amber-400";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Stats Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-heading text-h5 font-semibold text-white">
            Customer Orders
          </h3>
          <p className="text-xs text-navy-300">
            {orders.length} total orders recorded in the live database · {pendingCount} pending confirmation
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 rounded-base border border-gold-400/30 bg-navy-900 text-xs text-navy-200">
            <span className="text-navy-400 mr-1.5">Net Volume:</span>
            <span className="font-mono font-bold text-gold-400">
              ₹{totalRevenue.toLocaleString("en-IN")}
            </span>
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-navy-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by order #, customer name, phone, city..."
            className="w-full h-10 rounded-base border border-navy-700 bg-navy-900/90 pl-10 pr-4 text-xs text-white placeholder:text-navy-400 focus:border-gold-400 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-10 rounded-base border border-navy-700 bg-navy-900/90 px-3 text-xs text-navy-200 focus:border-gold-400 focus:outline-none"
          >
            <option value="ALL">All Order Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="PROCESSING">Processing</option>
            <option value="SHIPPED">Shipped</option>
            <option value="DELIVERED">Delivered</option>
            <option value="CANCELLED">Cancelled</option>
          </select>

          {/* Payment Filter */}
          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="h-10 rounded-base border border-navy-700 bg-navy-900/90 px-3 text-xs text-navy-200 focus:border-gold-400 focus:outline-none"
          >
            <option value="ALL">All Payments</option>
            <option value="UNPAID">Unpaid (COD)</option>
            <option value="PAID">Paid</option>
            <option value="REFUNDED">Refunded</option>
          </select>
        </div>
      </div>

      {updateError && (
        <div className="flex items-center gap-2 rounded-base border border-rose-500/30 bg-rose-950/40 p-3 text-xs text-rose-300">
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
          <span>{updateError}</span>
        </div>
      )}

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="rounded-xl border border-navy-800 bg-navy-900/60 p-12 text-center">
          <ShoppingBag className="mx-auto h-12 w-12 text-navy-400 mb-3" />
          <h4 className="font-heading text-body font-medium text-white">
            {orders.length === 0 ? "No Orders Recorded Yet" : "No Orders Match Your Filters"}
          </h4>
          <p className="text-xs text-navy-300 mt-1 max-w-sm mx-auto">
            {orders.length === 0
              ? "When customers place orders on the Shop checkout, their live order details will appear here."
              : "Try adjusting your search query or status filters."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="rounded-xl border border-navy-800 bg-navy-900/80 p-6 shadow-md transition-all hover:border-navy-700"
            >
              {/* Top Row: Order Number, Customer, Date, Badges & Controls */}
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-navy-800">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-small font-bold text-gold-400">
                      {order.orderNumber}
                    </span>
                    <span className="text-xs text-navy-400">
                      · {new Date(order.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] font-semibold tracking-wide ${getOrderStatusBadge(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] font-semibold tracking-wide ${getPaymentStatusBadge(
                        order.paymentStatus
                      )}`}
                    >
                      {order.paymentStatus}
                    </span>
                  </div>

                  <p className="text-xs text-navy-200 mt-1 font-medium truncate">
                    {order.fullName} ({order.email} · {order.phone})
                  </p>
                </div>

                {/* Right: Total Value & Selectors */}
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-semibold text-navy-400 block">
                      Total
                    </span>
                    <span className="font-mono text-small font-bold text-white">
                      ₹{order.totalPrice.toLocaleString("en-IN")}
                    </span>
                  </div>

                  {/* Status Selectors */}
                  <div className="flex items-center gap-2">
                    <select
                      value={order.status}
                      disabled={updatingId === order.id}
                      onChange={(e) =>
                        handleStatusChange(
                          order.id,
                          e.target.value as AdminOrder["status"]
                        )
                      }
                      className="rounded-base border border-navy-700 bg-navy-950 px-2.5 py-1 text-xs text-white focus:border-gold-400 focus:outline-none disabled:opacity-50 cursor-pointer"
                      title="Update Order Processing Status"
                    >
                      <option value="PENDING">PENDING</option>
                      <option value="PROCESSING">PROCESSING</option>
                      <option value="SHIPPED">SHIPPED</option>
                      <option value="DELIVERED">DELIVERED</option>
                      <option value="CANCELLED">CANCELLED</option>
                    </select>

                    <select
                      value={order.paymentStatus}
                      disabled={updatingId === order.id}
                      onChange={(e) =>
                        handleStatusChange(
                          order.id,
                          undefined,
                          e.target.value as AdminOrder["paymentStatus"]
                        )
                      }
                      className="rounded-base border border-navy-700 bg-navy-950 px-2.5 py-1 text-xs text-emerald-400 focus:border-gold-400 focus:outline-none disabled:opacity-50 cursor-pointer"
                      title="Update Payment Status"
                    >
                      <option value="UNPAID">UNPAID</option>
                      <option value="PAID">PAID</option>
                      <option value="REFUNDED">REFUNDED</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Order Details & Shipping */}
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {/* Shipping info */}
                <div>
                  <span className="text-navy-400 font-semibold uppercase tracking-wider text-[10px] block mb-1.5 flex items-center gap-1">
                    <MapPin className="h-3 w-3 text-gold-400" />
                    <span>Shipping Address</span>
                  </span>
                  <p className="text-navy-200">
                    {order.addressLine1}
                    {order.addressLine2 ? `, ${order.addressLine2}` : ""}
                  </p>
                  <p className="text-navy-300 mt-0.5">
                    {order.city}, {order.state} - {order.pincode}
                  </p>
                </div>

                {/* Items info */}
                <div>
                  <span className="text-navy-400 font-semibold uppercase tracking-wider text-[10px] block mb-1.5 flex items-center gap-1">
                    <ShoppingBag className="h-3 w-3 text-gold-400" />
                    <span>Purchased Items ({order.items.length})</span>
                  </span>
                  <div className="space-y-1">
                    {order.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between text-navy-200"
                      >
                        <span className="truncate max-w-[240px]">
                          {item.product?.name || item.productId} × {item.quantity}
                        </span>
                        <span className="font-mono text-gold-400 shrink-0 ml-2">
                          ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
