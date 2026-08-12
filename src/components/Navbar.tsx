import React from 'react';
import { User } from '../types';
import {
  ShieldCheck,
  Building2,
  ShoppingCart,
  Mic,
  Grid,
  FileText,
  PackageCheck,
  UserCheck,
  Zap,
  RefreshCw
} from 'lucide-react';

interface NavbarProps {
  currentUser: User;
  activeTab: 'voice' | 'catalog' | 'intake' | 'orders';
  setActiveTab: (tab: 'voice' | 'catalog' | 'intake' | 'orders') => void;
  intakeCount: number;
  onOpenAuthModal: () => void;
  isSyncing?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  activeTab,
  setActiveTab,
  intakeCount,
  onOpenAuthModal,
  isSyncing = false
}) => {
  return (
    <header className="bg-white text-slate-900 border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      {/* Top Banner for B2B Live DB Sync & Tier Status */}
      <div className="bg-slate-50 px-4 py-1.5 text-xs border-b border-slate-200 flex flex-wrap items-center justify-between gap-2 text-slate-600">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-emerald-700 font-semibold">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
            </span>
            Direct Database Sync Active
          </span>
          <span className="hidden sm:inline text-slate-300">|</span>
          <span className="hidden sm:inline-flex items-center gap-1 text-slate-500">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" /> Tax-Exempt Ref: <strong className="text-slate-800">{currentUser.taxExemptNo}</strong>
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 text-amber-800 bg-amber-50 border border-amber-200/80 px-2 py-0.5 rounded text-[11px] font-semibold">
            <Zap className="w-3 h-3 text-amber-600" /> {currentUser.accountTier}
          </div>
          <div className="text-slate-600">
            Net 30 Credit: <strong className="text-emerald-700">${currentUser.creditAvailable.toLocaleString()}</strong> / ${currentUser.creditLimit.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Main Header Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-slate-900 text-white rounded flex items-center justify-center font-bold text-xs shadow-xs">
            APX
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-semibold text-base tracking-tight text-slate-900">
                APEX HARDWARE <span className="text-slate-400 font-normal">| SUPPLY PORTAL</span>
              </h1>
              <span className="bg-slate-100 text-slate-700 border border-slate-200 text-[10px] font-semibold px-2 py-0.5 rounded uppercase tracking-wider">
                B2B Portal
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block">
              Industrial Hardware Sales Intake & Automated Quote Platform
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button
            onClick={() => setActiveTab('voice')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'voice'
                ? 'bg-slate-900 text-white shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Mic className="w-3.5 h-3.5" />
            AI Voice Agent
          </button>

          <button
            onClick={() => setActiveTab('catalog')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'catalog'
                ? 'bg-slate-900 text-white shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Grid className="w-3.5 h-3.5" />
            Hardware Catalog
          </button>

          <button
            onClick={() => setActiveTab('intake')}
            className={`relative flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'intake'
                ? 'bg-slate-900 text-white shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            Intake List & Quote
            {intakeCount > 0 && (
              <span className="ml-1 bg-amber-500 text-white font-bold text-[10px] px-1.5 py-0.2 rounded-full">
                {intakeCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'orders'
                ? 'bg-slate-900 text-white shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <PackageCheck className="w-3.5 h-3.5" />
            Order History & Tracking
          </button>
        </nav>

        {/* User Profile & Account Switcher Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenAuthModal}
            className="flex items-center gap-2.5 bg-white hover:bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-xs text-left transition-all text-slate-800 shadow-xs"
          >
            <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-700 border border-slate-200 flex items-center justify-center font-bold text-xs">
              <Building2 className="w-3.5 h-3.5 text-slate-800" />
            </div>
            <div className="hidden lg:block">
              <div className="font-semibold text-slate-900 text-xs truncate max-w-[140px]">
                {currentUser.companyName}
              </div>
              <div className="text-[10px] text-slate-500 truncate max-w-[140px]">
                {currentUser.name}
              </div>
            </div>
            <UserCheck className="w-3.5 h-3.5 text-slate-400 ml-1" />
          </button>
        </div>
      </div>

      {/* Mobile Tab Navigation */}
      <div className="md:hidden flex items-center justify-around bg-white border-t border-slate-200 p-2 text-xs">
        <button
          onClick={() => setActiveTab('voice')}
          className={`flex flex-col items-center gap-1 p-1.5 rounded ${
            activeTab === 'voice' ? 'text-slate-900 font-bold' : 'text-slate-500'
          }`}
        >
          <Mic className="w-4 h-4" />
          Voice AI
        </button>
        <button
          onClick={() => setActiveTab('catalog')}
          className={`flex flex-col items-center gap-1 p-1.5 rounded ${
            activeTab === 'catalog' ? 'text-slate-900 font-bold' : 'text-slate-500'
          }`}
        >
          <Grid className="w-4 h-4" />
          Catalog
        </button>
        <button
          onClick={() => setActiveTab('intake')}
          className={`relative flex flex-col items-center gap-1 p-1.5 rounded ${
            activeTab === 'intake' ? 'text-slate-900 font-bold' : 'text-slate-500'
          }`}
        >
          <ShoppingCart className="w-4 h-4" />
          Intake ({intakeCount})
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`flex flex-col items-center gap-1 p-1.5 rounded ${
            activeTab === 'orders' ? 'text-slate-900 font-bold' : 'text-slate-500'
          }`}
        >
          <PackageCheck className="w-4 h-4" />
          Orders
        </button>
      </div>
    </header>
  );
};
