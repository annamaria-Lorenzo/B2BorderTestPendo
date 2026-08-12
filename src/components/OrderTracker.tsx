import React, { useState, useEffect } from "react";
import { Order, OrderStatus, IntakeItem } from "../types";
import {
  PackageCheck,
  Truck,
  CheckCircle2,
  Clock,
  Building2,
  RefreshCw,
  FileText,
  Layers,
  ArrowRight,
  ShieldCheck,
  RotateCcw,
  AlertCircle,
} from "lucide-react";

interface OrderTrackerProps {
  onReorder: (items: IntakeItem[]) => void;
  onNavigateTab: (tab: "voice" | "catalog" | "intake" | "orders") => void;
}

export const OrderTracker: React.FC<OrderTrackerProps> = ({
  onReorder,
  onNavigateTab,
}) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const statusPipeline: OrderStatus[] = [
    "Submitted",
    "Credit Approved",
    "In Production",
    "Quality Check",
    "Shipped",
    "Delivered",
  ];

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/orders");
      const data = await res.json();
      setOrders(data.orders || []);
      if (data.orders && data.orders.length > 0) {
        setSelectedOrder(data.orders[0]);
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateOrderStatus = async (
    orderId: string,
    newStatus: OrderStatus,
  ) => {
    setIsUpdatingStatus(true);
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: newStatus,
          note: `Real-time database status sync update to ${newStatus}`,
        }),
      });

      const data = await res.json();
      if (!res.ok)
        throw new Error(data.error || "Failed to update order status");

      // Track order status update
      if ((window as any).pendo && data.order) {
        (window as any).pendo.track("order_status_updated", {
          order_id: data.order.id,
          order_number: data.order.orderNumber,
          previous_status: selectedOrder?.status || "",
          new_status: newStatus,
          company_name: data.order.companyName,
          order_total: data.order.total,
          item_count: (data.order.items || []).length,
        });
      }

      // Refresh list
      await fetchOrders();
      setSelectedOrder(data.order);
    } catch (err: any) {
      alert(`Status update error: ${err.message}`);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const filteredOrders = orders.filter((o) => {
    if (statusFilter === "All") return true;
    return o.status === statusFilter;
  });

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Banner */}
      <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold px-2 py-0.5 rounded flex items-center gap-1">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
              </span>
              Direct Database Sync
            </span>
            <span className="text-xs text-slate-500">
              Order History & Real-Time Tracking
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-1 flex items-center gap-2">
            <PackageCheck className="w-5 h-5 text-slate-700" /> Commercial Order
            Fulfillment Tracker
          </h2>
        </div>

        <button
          onClick={fetchOrders}
          className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold px-4 py-2 rounded-xl border border-slate-200 flex items-center gap-2 transition-all"
        >
          <RefreshCw className="w-4 h-4 text-slate-700" /> Refresh DB Sync
        </button>
      </div>

      {loading ? (
        <div className="py-20 text-center text-slate-500 text-xs">
          Syncing order database records...
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-500 space-y-3 shadow-sm">
          <PackageCheck className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="font-bold text-slate-800">
            No active commercial orders found
          </h3>
          <p className="text-xs text-slate-500">
            Create your first hardware intake list to generate a quote and
            submit an order.
          </p>
          <button
            onClick={() => onNavigateTab("catalog")}
            className="mt-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold px-4 py-2 rounded-xl text-xs"
          >
            Start Order Intake
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 1 Col: Orders Master List */}
          <div className="space-y-4">
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-slate-900">
                  Order History ({orders.length})
                </h3>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-200"
                >
                  <option value="All">All Statuses</option>
                  {statusPipeline.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2 max-h-[550px] overflow-y-auto pr-1">
                {filteredOrders.map((order) => {
                  const isSelected = selectedOrder?.id === order.id;
                  return (
                    <div
                      key={order.id}
                      onClick={() => setSelectedOrder(order)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer space-y-1.5 ${
                        isSelected
                          ? "bg-slate-100/80 border-slate-900 shadow-xs"
                          : "bg-slate-50/50 border-slate-200 hover:bg-slate-100/80"
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-mono font-bold text-slate-900">
                          {order.orderNumber}
                        </span>
                        <span className="text-[10px] bg-slate-100 text-slate-700 font-medium px-2 py-0.5 rounded border border-slate-200">
                          {order.status}
                        </span>
                      </div>

                      <div className="text-xs text-slate-900 font-semibold">
                        {order.companyName}
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-500">
                        <span>{order.items.length} SKUs</span>
                        <strong className="text-emerald-700 font-mono">
                          ${order.total.toFixed(2)}
                        </strong>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right 2 Cols: Selected Order Visual Timeline & DB Controls */}
          {selectedOrder && (
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
                  <div>
                    <span className="text-xs text-slate-500 font-mono">
                      Order Ref: {selectedOrder.orderNumber}
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                      {selectedOrder.companyName}
                    </h3>
                    <p className="text-xs text-slate-500">
                      Tracking #:{" "}
                      <span className="text-slate-800 font-mono">
                        {selectedOrder.trackingNumber}
                      </span>{" "}
                      | Payment: {selectedOrder.paymentTerms}
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      onReorder(selectedOrder.items);
                      onNavigateTab("intake");
                    }}
                    className="bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 text-xs font-semibold px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all shrink-0"
                  >
                    <RotateCcw className="w-4 h-4 text-amber-700" /> Reorder All
                    Items
                  </button>
                </div>

                {/* Interactive Status Pipeline */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                    <span>Fulfillment Stage Pipeline:</span>
                    <span className="text-emerald-700 font-mono">
                      Status: {selectedOrder.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                    {statusPipeline.map((step, idx) => {
                      const currentIdx = statusPipeline.indexOf(
                        selectedOrder.status,
                      );
                      const isCompleted = idx <= currentIdx;
                      const isCurrent = idx === currentIdx;

                      return (
                        <div
                          key={step}
                          className={`p-2.5 rounded-xl border text-center transition-all ${
                            isCurrent
                              ? "bg-slate-900 border-slate-900 text-white font-bold shadow-xs"
                              : isCompleted
                                ? "bg-emerald-50 border-emerald-200 text-emerald-800 font-medium"
                                : "bg-slate-50 border-slate-200 text-slate-400"
                          }`}
                        >
                          <div className="text-[10px] uppercase tracking-wider block font-mono">
                            Stage {idx + 1}
                          </div>
                          <div className="text-[11px] mt-0.5 truncate">
                            {step}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Direct Real-time DB Status Switcher for Demo */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-amber-800 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-amber-700" /> Live
                      Warehouse DB Simulator
                    </span>
                    <span className="text-[10px] text-slate-500">
                      Click to update status in database:
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-1">
                    {statusPipeline.map((st) => (
                      <button
                        key={st}
                        disabled={
                          isUpdatingStatus || selectedOrder.status === st
                        }
                        onClick={() =>
                          handleUpdateOrderStatus(selectedOrder.id, st)
                        }
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                          selectedOrder.status === st
                            ? "bg-slate-900 text-white shadow-xs"
                            : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
                        }`}
                      >
                        Set: {st}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Itemized Table in Order */}
                <div className="space-y-2">
                  <h4 className="font-bold text-xs text-slate-800">
                    Order Items:
                  </h4>
                  <div className="bg-slate-50 border border-slate-200 rounded-xl overflow-hidden text-xs">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b border-slate-200 text-slate-500 uppercase font-bold text-[10px]">
                          <th className="p-2.5">SKU</th>
                          <th className="p-2.5">Item</th>
                          <th className="p-2.5 text-center">Finish</th>
                          <th className="p-2.5 text-center">Qty</th>
                          <th className="p-2.5 text-right">Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 text-slate-800">
                        {selectedOrder.items.map((item, idx) => (
                          <tr key={idx}>
                            <td className="p-2.5 font-mono text-slate-900 font-bold">
                              {item.sku}
                            </td>
                            <td className="p-2.5">{item.name}</td>
                            <td className="p-2.5 text-center">
                              {item.selectedFinish}
                            </td>
                            <td className="p-2.5 text-center font-bold">
                              {item.quantity}
                            </td>
                            <td className="p-2.5 text-right font-mono font-bold">
                              ${item.totalPrice.toFixed(2)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Status History Audit Log */}
                <div className="space-y-2 pt-2 border-t border-slate-200">
                  <h4 className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-700" /> Database
                    Audit Logs & Warehouse History
                  </h4>
                  <div className="space-y-2 bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
                    {selectedOrder.statusHistory.map((log, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-2.5 text-slate-700 border-b border-slate-200 pb-2 last:border-none last:pb-0"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                        <div>
                          <div className="font-bold text-slate-900">
                            {log.status}
                          </div>
                          <div className="text-[11px] text-slate-600">
                            {log.note}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            {new Date(log.timestamp).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
