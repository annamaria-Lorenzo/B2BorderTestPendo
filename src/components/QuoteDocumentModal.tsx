import React from 'react';
import { Quote, User } from '../types';
import {
  FileText,
  Printer,
  Download,
  CheckCircle2,
  Building2,
  ShieldCheck,
  Calendar,
  X,
  Send
} from 'lucide-react';

interface QuoteDocumentModalProps {
  quote: Quote;
  currentUser: User;
  onClose: () => void;
  onSubmitOrder: (quoteId: string) => void;
}

export const QuoteDocumentModal: React.FC<QuoteDocumentModalProps> = ({
  quote,
  currentUser,
  onClose,
  onSubmitOrder
}) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-3xl overflow-hidden shadow-xl text-slate-900 my-8">
        {/* Modal Action Bar */}
        <div className="bg-slate-50 px-6 py-3 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Official Automated B2B Quote
            </span>
            <span className="text-slate-500 text-xs font-mono">{quote.quoteNumber}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="bg-white hover:bg-slate-100 text-slate-800 text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all border border-slate-200"
            >
              <Printer className="w-3.5 h-3.5" /> Print / Save PDF
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Official Printable Quote Document Canvas */}
        <div className="p-8 bg-white text-slate-900 print:p-0 print:m-0" id="printable-quote">
          {/* Document Header */}
          <div className="flex items-start justify-between border-b-2 border-slate-900 pb-6">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-slate-900 text-white font-extrabold flex items-center justify-center text-base">
                  APX
                </div>
                <h1 className="text-2xl font-black tracking-tight text-slate-900">APEX HARDWARE MFG</h1>
              </div>
              <p className="text-xs text-slate-600 mt-1">
                Industrial Hardware & Assembly Components Division<br />
                100 Apex Boulevard, Suite 400 | Grand Rapids, MI 49512<br />
                Tel: +1 (800) 555-APEX | orders@apexhardwaremfg.com
              </p>
            </div>

            <div className="text-right">
              <h2 className="text-2xl font-bold text-slate-800 uppercase tracking-wide">QUOTATION</h2>
              <div className="text-xs text-slate-600 font-mono mt-1 space-y-0.5">
                <div>Quote Ref #: <strong>{quote.quoteNumber}</strong></div>
                <div>Date: <strong>{new Date(quote.createdAt).toLocaleDateString()}</strong></div>
                <div>Valid Until: <strong>{new Date(quote.validUntil).toLocaleDateString()}</strong></div>
              </div>
            </div>
          </div>

          {/* Customer & Shipping Meta Info */}
          <div className="grid grid-cols-2 gap-6 py-6 border-b border-slate-200 text-xs">
            <div>
              <span className="font-bold text-slate-400 uppercase tracking-wider block mb-1">Customer / Bill To:</span>
              <strong className="text-sm font-bold text-slate-900 block">{quote.companyName}</strong>
              <div className="text-slate-700 mt-1">
                Attn: {currentUser.name}<br />
                {currentUser.address.street}<br />
                {currentUser.address.city}, {currentUser.address.state} {currentUser.address.zip}<br />
                Email: {currentUser.email} | Phone: {currentUser.phone}
              </div>
            </div>

            <div>
              <span className="font-bold text-slate-400 uppercase tracking-wider block mb-1">Commercial Account Terms:</span>
              <div className="space-y-1 text-slate-700 bg-slate-50 p-3 rounded border border-slate-200">
                <div className="flex justify-between">
                  <span>Volume Account Tier:</span>
                  <strong className="text-slate-900">{currentUser.accountTier}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Reseller Tax Exemption #:</span>
                  <strong className="text-blue-700 font-mono">{currentUser.taxExemptNo || 'Exempt'}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Approved Payment Terms:</span>
                  <strong className="text-slate-900">{quote.paymentTerms}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Shipping Freight:</span>
                  <strong className="text-slate-900">{quote.shippingMethod}</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Itemized Table */}
          <div className="py-6">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b-2 border-slate-900 text-slate-900 uppercase font-bold text-[11px]">
                  <th className="py-2.5">SKU</th>
                  <th className="py-2.5">Component Item Description</th>
                  <th className="py-2.5 text-center">Finish</th>
                  <th className="py-2.5 text-center">Package Qty</th>
                  <th className="py-2.5 text-right">Unit Price</th>
                  <th className="py-2.5 text-right">Total Price</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-800">
                {quote.items.map((item, idx) => (
                  <tr key={idx} className="py-2">
                    <td className="py-2.5 font-mono font-bold text-blue-800">{item.sku}</td>
                    <td className="py-2.5 font-medium">
                      {item.name}
                      <span className="block text-[10px] text-slate-500 font-normal">Package: {item.unitOfMeasure}</span>
                    </td>
                    <td className="py-2.5 text-center font-medium">{item.selectedFinish}</td>
                    <td className="py-2.5 text-center font-bold">{item.quantity}</td>
                    <td className="py-2.5 text-right font-mono">${item.unitPrice.toFixed(2)}</td>
                    <td className="py-2.5 text-right font-mono font-bold">${item.totalPrice.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pricing Calculation Summary */}
          <div className="flex justify-between items-start pt-4 border-t-2 border-slate-900 text-xs">
            <div className="max-w-xs space-y-2">
              <span className="font-bold text-slate-900 block">Sales & Project Notes:</span>
              <p className="text-slate-600 bg-slate-50 p-2.5 rounded border border-slate-200 italic">
                {quote.salesNotes}
              </p>
              <div className="text-[11px] text-slate-500">
                Estimated Production Lead Time: <strong>{quote.leadTimeDays} Business Days</strong>
              </div>
            </div>

            <div className="w-64 space-y-1.5 text-right text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal:</span>
                <span className="font-mono">${quote.subtotal.toFixed(2)}</span>
              </div>
              {quote.volumeDiscountAmount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Tier Discount ({quote.volumeDiscountPercent}%):</span>
                  <span className="font-mono">-${quote.volumeDiscountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-600">
                <span>Freight Shipping:</span>
                <span className="font-mono">${quote.shippingCost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>State Tax (Exempt):</span>
                <span className="font-mono">${quote.estimatedTax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-900 font-bold text-sm border-t border-slate-900 pt-2 mt-2">
                <span>Quote Total:</span>
                <span className="font-mono text-blue-900">${quote.grandTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Signature Footer */}
          <div className="mt-8 pt-6 border-t border-slate-200 grid grid-cols-2 gap-8 text-[11px] text-slate-500">
            <div>
              <p>Authorized Representative Signature:</p>
              <div className="h-10 border-b border-slate-400 mt-2"></div>
              <p className="mt-1">Apex Hardware Sales Manager</p>
            </div>
            <div>
              <p>Customer Acceptance & PO Authorization:</p>
              <div className="h-10 border-b border-slate-400 mt-2"></div>
              <p className="mt-1">Date: ________________________</p>
            </div>
          </div>
        </div>

        {/* Modal Bottom Conversion Footer */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-800 text-xs font-semibold px-4 py-2"
          >
            Close Document
          </button>

          <button
            onClick={() => {
              onSubmitOrder(quote.id);
              onClose();
            }}
            className="bg-emerald-800 hover:bg-emerald-700 text-white font-semibold px-6 py-2.5 rounded-xl shadow-xs text-xs flex items-center gap-2 transition-all"
          >
            <Send className="w-4 h-4" /> Approve Quote & Submit Official Order to Database
          </button>
        </div>
      </div>
    </div>
  );
};
