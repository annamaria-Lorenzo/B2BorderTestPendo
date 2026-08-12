import React, { useState } from "react";
import {
  IntakeItem,
  User,
  Quote,
  PaymentTerms,
  ShippingMethod,
} from "../types";
import { QuoteDocumentModal } from "./QuoteDocumentModal";
import {
  ShoppingCart,
  Trash2,
  FileText,
  Calculator,
  Truck,
  ShieldCheck,
  Send,
  Zap,
  Package,
  Plus,
  Grid,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

interface IntakeAndQuoteGeneratorProps {
  intakeList: IntakeItem[];
  currentUser: User;
  onUpdateQty: (id: string, qty: number) => void;
  onRemoveItem: (id: string) => void;
  onClearList: () => void;
  onNavigateTab: (tab: "voice" | "catalog" | "intake" | "orders") => void;
  onOrderSubmitted: () => void;
}

export const IntakeAndQuoteGenerator: React.FC<
  IntakeAndQuoteGeneratorProps
> = ({
  intakeList,
  currentUser,
  onUpdateQty,
  onRemoveItem,
  onClearList,
  onNavigateTab,
  onOrderSubmitted,
}) => {
  const [paymentTerms, setPaymentTerms] = useState<PaymentTerms>("Net 30");
  const [shippingMethod, setShippingMethod] = useState<ShippingMethod>(
    "Standard Freight (3-5 Days)",
  );
  const [salesNotes, setSalesNotes] = useState("");
  const [generatedQuote, setGeneratedQuote] = useState<Quote | null>(null);
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);

  // Real-time calculations
  const subtotal = intakeList.reduce((acc, item) => acc + item.totalPrice, 0);
  const totalWeightKg = intakeList.reduce(
    (acc, item) => acc + item.totalWeightKg,
    0,
  );

  let discountPercent = 0;
  if (currentUser.accountTier.includes("Tier 2")) discountPercent = 18;
  else if (currentUser.accountTier.includes("Tier 1")) discountPercent = 10;

  const discountAmount = (subtotal * discountPercent) / 100;

  let baseRate = totalWeightKg * 0.45;
  if (shippingMethod.includes("Expedited")) baseRate *= 1.75;
  if (shippingMethod.includes("White Glove")) baseRate += 150;
  const shippingCost = Math.max(75, Math.round(baseRate * 100) / 100);

  const estimatedTax = currentUser.taxExemptNo
    ? 0
    : Math.round((subtotal - discountAmount) * 0.06 * 100) / 100;
  const grandTotal =
    Math.round(
      (subtotal - discountAmount + shippingCost + estimatedTax) * 100,
    ) / 100;

  const handleGenerateQuote = async () => {
    if (intakeList.length === 0) {
      setErrorNotice(
        "Intake list is empty. Please add hardware items before generating a quote.",
      );
      return;
    }

    setIsGenerating(true);
    setErrorNotice(null);

    try {
      const res = await fetch("/api/quotes/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentTerms,
          shippingMethod,
          salesNotes,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to generate quote");

      setGeneratedQuote(data.quote);
      setShowQuoteModal(true);

      // Track quote generation
      if ((window as any).pendo && data.quote) {
        (window as any).pendo.track("quote_generated", {
          quote_id: data.quote.id,
          quote_number: data.quote.quoteNumber,
          item_count: (data.quote.items || []).length,
          subtotal: data.quote.subtotal,
          volume_discount_pct: data.quote.volumeDiscountPercent,
          volume_discount_amt: data.quote.volumeDiscountAmount,
          shipping_cost: data.quote.shippingCost,
          estimated_tax: data.quote.estimatedTax,
          grand_total: data.quote.grandTotal,
          payment_terms: data.quote.paymentTerms,
          shipping_method: data.quote.shippingMethod,
          lead_time_days: data.quote.leadTimeDays,
          account_tier: currentUser.accountTier,
          company_name: currentUser.companyName,
        });
      }
    } catch (err: any) {
      setErrorNotice(err.message || "Error creating official quote");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmitOrderFromQuote = async (quoteId: string) => {
    try {
      const res = await fetch("/api/orders/from-quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quoteId }),
      });

      const data = await res.json();
      if (!res.ok)
        throw new Error(data.error || "Failed to convert quote to order");

      // Track order submitted from quote
      if ((window as any).pendo && data.order) {
        (window as any).pendo.track("order_submitted_from_quote", {
          order_id: data.order.id,
          order_number: data.order.orderNumber,
          quote_id: data.order.quoteId,
          item_count: (data.order.items || []).length,
          order_total: data.order.total,
          discount_amount: data.order.discountAmount,
          shipping_cost: data.order.shippingCost,
          tax: data.order.tax,
          payment_terms: data.order.paymentTerms,
          company_name: data.order.companyName,
          account_tier: currentUser.accountTier,
          tracking_number: data.order.trackingNumber,
        });
      }

      onOrderSubmitted();
      onNavigateTab("orders");
    } catch (err: any) {
      alert(`Order submission error: ${err.message}`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Document Header Banner */}
      <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-amber-50 text-amber-900 border border-amber-200 text-xs font-semibold px-2 py-0.5 rounded">
              {currentUser.companyName}
            </span>
            <span className="text-xs text-slate-500">
              Tax Exempt Ref: {currentUser.taxExemptNo}
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-1 flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-slate-700" /> B2B Purchase
            Intake List & Automated Quote Generator
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigateTab("catalog")}
            className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold px-3.5 py-2 rounded-xl border border-slate-200 transition-all flex items-center gap-1.5"
          >
            <Grid className="w-4 h-4" /> Add More Items
          </button>
          {intakeList.length > 0 && (
            <button
              onClick={onClearList}
              className="text-rose-600 hover:text-rose-800 text-xs font-semibold px-3 py-2 rounded-xl hover:bg-rose-50 transition-all"
            >
              Clear List
            </button>
          )}
        </div>
      </div>

      {errorNotice && (
        <div className="bg-rose-50 border border-rose-200 p-4 rounded-xl text-rose-800 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {errorNotice}
        </div>
      )}

      {intakeList.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-500 space-y-4 shadow-sm">
          <ShoppingCart className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">
            Your B2B intake list is currently empty
          </h3>
          <p className="text-xs max-w-md mx-auto text-slate-500">
            Select items from our commercial hardware catalog or use our AI
            Voice Agent to talk about what you need for your furniture assembly
            projects.
          </p>
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={() => onNavigateTab("voice")}
              className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xs"
            >
              Talk to AI Voice Agent
            </button>
            <button
              onClick={() => onNavigateTab("catalog")}
              className="bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 text-xs font-semibold px-4 py-2.5 rounded-xl"
            >
              Browse Catalog
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Cols: Intake Items Table */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
              <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                  <Package className="w-4 h-4 text-slate-700" /> Itemized
                  Component Intake ({intakeList.length} SKUs)
                </h3>
                <span className="text-xs text-slate-500">
                  Total Weight:{" "}
                  <strong className="text-slate-800">
                    {totalWeightKg.toFixed(1)} kg
                  </strong>
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 uppercase font-bold text-[10px]">
                      <th className="p-3">SKU</th>
                      <th className="p-3">Component / Spec</th>
                      <th className="p-3">Finish</th>
                      <th className="p-3 text-center">Packages</th>
                      <th className="p-3 text-right">Unit Price</th>
                      <th className="p-3 text-right">Line Total</th>
                      <th className="p-3 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-800">
                    {intakeList.map((item) => (
                      <tr
                        key={item.id}
                        className="hover:bg-slate-50 transition-colors"
                      >
                        <td className="p-3 font-mono font-bold text-slate-900">
                          {item.sku}
                        </td>
                        <td className="p-3">
                          <div className="font-semibold text-slate-900">
                            {item.name}
                          </div>
                          <div className="text-[10px] text-slate-500">
                            UOM: {item.unitOfMeasure}
                          </div>
                          {item.customNotes && (
                            <div className="text-[10px] text-amber-800 italic mt-0.5">
                              Note: {item.customNotes}
                            </div>
                          )}
                        </td>
                        <td className="p-3 font-medium text-slate-700">
                          {item.selectedFinish}
                        </td>
                        <td className="p-3 text-center">
                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) =>
                              onUpdateQty(item.id, Number(e.target.value))
                            }
                            className="w-16 bg-slate-50 border border-slate-200 rounded-lg p-1 text-center font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-200"
                          />
                        </td>
                        <td className="p-3 text-right font-mono">
                          ${item.unitPrice.toFixed(2)}
                        </td>
                        <td className="p-3 text-right font-mono font-bold text-emerald-700">
                          ${item.totalPrice.toFixed(2)}
                        </td>
                        <td className="p-3 text-center">
                          <button
                            onClick={() => onRemoveItem(item.id)}
                            className="text-slate-400 hover:text-rose-600 p-1.5 rounded hover:bg-slate-100 transition-colors"
                            title="Remove item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Quote Terms Configuration Form */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Truck className="w-4 h-4 text-slate-700" /> Commercial
                Logistics & Payment Configuration
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">
                    Select Commercial Payment Terms:
                  </label>
                  <select
                    value={paymentTerms}
                    onChange={(e) =>
                      setPaymentTerms(e.target.value as PaymentTerms)
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-200"
                  >
                    <option value="Net 30">
                      Net 30 (Approved Commercial Credit)
                    </option>
                    <option value="Net 60">
                      Net 60 (Enterprise Line of Credit)
                    </option>
                    <option value="Pre-paid Credit Card">
                      Pre-paid Commercial Card
                    </option>
                    <option value="Wire Transfer">
                      ACH / Bank Wire Transfer
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-1">
                    Select Freight Shipping Method:
                  </label>
                  <select
                    value={shippingMethod}
                    onChange={(e) =>
                      setShippingMethod(e.target.value as ShippingMethod)
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-200"
                  >
                    <option value="Standard Freight (3-5 Days)">
                      Standard Commercial Freight (3-5 Days)
                    </option>
                    <option value="Expedited Freight (1-2 Days)">
                      Expedited Air Freight (1-2 Days)
                    </option>
                    <option value="White Glove LTL Delivery">
                      White Glove LTL Liftgate Delivery
                    </option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-medium text-xs mb-1">
                  Custom Sales & Production Notes:
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Please arrange pallet delivery at Loading Dock 4 between 8 AM and 2 PM."
                  value={salesNotes}
                  onChange={(e) => setSalesNotes(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-200"
                ></textarea>
              </div>
            </div>
          </div>

          {/* Right 1 Col: Automated Real-time Calculation Summary */}
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
              <h3 className="font-bold text-sm text-slate-900 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Calculator className="w-4 h-4 text-emerald-700" /> Real-time
                  Automated Pricing
                </span>
                <span className="text-[11px] text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Live Calculator
                </span>
              </h3>

              <div className="space-y-2.5 text-xs border-y border-slate-200 py-4 text-slate-600">
                <div className="flex justify-between">
                  <span>Gross Catalog Subtotal:</span>
                  <span className="font-mono font-bold text-slate-900">
                    ${subtotal.toFixed(2)}
                  </span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-amber-900 font-semibold bg-amber-50 p-2 rounded-lg border border-amber-200">
                    <span className="flex items-center gap-1">
                      <Zap className="w-3.5 h-3.5 text-amber-600" /> Tier
                      Account Discount ({discountPercent}%):
                    </span>
                    <span className="font-mono">
                      -${discountAmount.toFixed(2)}
                    </span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Calculated Freight Shipping:</span>
                  <span className="font-mono">${shippingCost.toFixed(2)}</span>
                </div>

                <div className="flex justify-between">
                  <span>State Sales Tax:</span>
                  <span className="font-mono text-slate-800">
                    {currentUser.taxExemptNo
                      ? "$0.00 (Exempt)"
                      : `$${estimatedTax.toFixed(2)}`}
                  </span>
                </div>

                <div className="pt-3 border-t border-slate-200 flex justify-between items-center text-sm font-bold text-slate-900">
                  <span>Quote Grand Total:</span>
                  <span className="text-emerald-700 font-mono text-base">
                    ${grandTotal.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-2">
                <button
                  disabled={isGenerating}
                  onClick={handleGenerateQuote}
                  className="w-full bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-semibold py-3 rounded-xl shadow-xs text-xs flex items-center justify-center gap-2 transition-all"
                >
                  <FileText className="w-4 h-4" />
                  {isGenerating
                    ? "Generating Official Quote..."
                    : "Generate Official B2B Quote PDF"}
                </button>

                <button
                  disabled={isGenerating}
                  onClick={async () => {
                    await handleGenerateQuote();
                  }}
                  className="w-full bg-emerald-800 hover:bg-emerald-700 disabled:opacity-50 text-white font-semibold py-3 rounded-xl shadow-xs text-xs flex items-center justify-center gap-2 transition-all"
                >
                  <Send className="w-4 h-4" />
                  Convert to Order & Process Real-Time
                </button>
              </div>

              <div className="text-[11px] text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1">
                <div className="flex items-center gap-1 text-slate-800 font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5 text-slate-700" /> Net 30
                  Credit Verification
                </div>
                <p>
                  Available Credit:{" "}
                  <strong className="text-emerald-700">
                    ${currentUser.creditAvailable.toLocaleString()}
                  </strong>
                  . Standard lead time: 3-5 business days.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quote Document Modal */}
      {showQuoteModal && generatedQuote && (
        <QuoteDocumentModal
          quote={generatedQuote}
          currentUser={currentUser}
          onClose={() => setShowQuoteModal(false)}
          onSubmitOrder={handleSubmitOrderFromQuote}
        />
      )}
    </div>
  );
};
