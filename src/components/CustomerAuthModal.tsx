import React, { useState } from 'react';
import { User, UserAccountTier } from '../types';
import { DEMO_USERS } from '../db/store';
import { Building2, UserPlus, CheckCircle2, ShieldCheck, X } from 'lucide-react';

interface CustomerAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  onSwitchUser: (userId: string) => void;
  onSignUp: (userData: Partial<User>) => void;
}

export const CustomerAuthModal: React.FC<CustomerAuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onSwitchUser,
  onSignUp
}) => {
  const [activeMode, setActiveMode] = useState<'switch' | 'signup'>('switch');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    companyName: '',
    taxExemptNo: '',
    accountTier: 'Tier 1 Wholesale (-10%)' as UserAccountTier
  });

  if (!isOpen) return null;

  const handleSubmitSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.companyName) return;
    onSignUp(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-lg overflow-hidden shadow-xl text-slate-900">
        {/* Modal Header */}
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-slate-100 text-slate-800 flex items-center justify-center font-bold">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-base text-slate-900">B2B Customer Authentication</h2>
              <p className="text-xs text-slate-500">Select account profile or register commercial account</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Switcher */}
        <div className="p-2 bg-slate-50 flex border-b border-slate-200 text-xs">
          <button
            onClick={() => setActiveMode('switch')}
            className={`flex-1 py-2 font-semibold rounded-lg text-center transition-all ${
              activeMode === 'switch'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Switch Existing B2B Account
          </button>
          <button
            onClick={() => setActiveMode('signup')}
            className={`flex-1 py-2 font-semibold rounded-lg text-center transition-all ${
              activeMode === 'signup'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5 inline mr-1" />
            Register New B2B Account
          </button>
        </div>

        <div className="p-6">
          {activeMode === 'switch' ? (
            <div className="space-y-4">
              <p className="text-xs text-slate-500">
                Choose a pre-configured B2B account profile to test custom volume tier pricing, Net 30 credit limits, and tax-exempt order processing:
              </p>

              <div className="space-y-3">
                {DEMO_USERS.map(user => {
                  const isSelected = user.id === currentUser.id;
                  return (
                    <div
                      key={user.id}
                      onClick={() => {
                        onSwitchUser(user.id);
                        onClose();
                      }}
                      className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                        isSelected
                          ? 'bg-slate-50 border-slate-900 shadow-xs'
                          : 'bg-slate-50/50 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-sm text-slate-900">{user.companyName}</h3>
                          {isSelected && (
                            <span className="bg-slate-200 text-slate-800 text-[10px] font-bold px-2 py-0.5 rounded border border-slate-300 flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3 text-emerald-700" /> Active
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">{user.name} ({user.email})</p>
                        <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-700">
                          <span className="bg-amber-50 text-amber-900 border border-amber-200 px-1.5 py-0.5 rounded font-medium">
                            {user.accountTier}
                          </span>
                          <span>Net 30 Credit: <strong className="text-emerald-700">${user.creditLimit.toLocaleString()}</strong></span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmitSignUp} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-medium mb-1">Company / Organization Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Apex Custom Cabinetry Mfg"
                  value={formData.companyName}
                  onChange={e => setFormData({ ...formData, companyName: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Contact Name</label>
                  <input
                    type="text"
                    placeholder="Purchasing Manager"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Commercial Email</label>
                  <input
                    type="email"
                    placeholder="orders@company.com"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-slate-700" /> Reseller / State Tax Exemption Certificate #
                </label>
                <input
                  type="text"
                  placeholder="e.g. TX-992019-EX"
                  value={formData.taxExemptNo}
                  onChange={e => setFormData({ ...formData, taxExemptNo: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-200"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Requested Commercial Volume Tier</label>
                <select
                  value={formData.accountTier}
                  onChange={e => setFormData({ ...formData, accountTier: e.target.value as UserAccountTier })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-200"
                >
                  <option value="Standard B2B">Standard B2B (MSRP Pricing)</option>
                  <option value="Tier 1 Wholesale (-10%)">Tier 1 Wholesale (10% Off Catalog + Net 30)</option>
                  <option value="Tier 2 Enterprise (-18%)">Tier 2 Enterprise (18% Off Catalog + $75k Credit)</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-2.5 rounded-xl shadow-xs text-xs transition-all mt-2"
              >
                Create Commercial B2B Profile
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
