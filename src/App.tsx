import React, { useState, useEffect } from 'react';
import { User, IntakeItem } from './types';
import { DEMO_USERS } from './db/store';
import { Navbar } from './components/Navbar';
import { CustomerAuthModal } from './components/CustomerAuthModal';
import { AIVoiceIntake } from './components/AIVoiceIntake';
import { ProductCatalog } from './components/ProductCatalog';
import { IntakeAndQuoteGenerator } from './components/IntakeAndQuoteGenerator';
import { OrderTracker } from './components/OrderTracker';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User>(DEMO_USERS[0]);
  const [activeTab, setActiveTab] = useState<'voice' | 'catalog' | 'intake' | 'orders'>('voice');
  const [intakeList, setIntakeList] = useState<IntakeItem[]>([]);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    fetchUserDataAndCart();
  }, []);

  const fetchUserDataAndCart = async () => {
    try {
      const res = await fetch('/api/cart');
      const data = await res.json();
      if (data.user) setCurrentUser(data.user);
      if (data.items) setIntakeList(data.items);
    } catch (err) {
      console.error('Error fetching initial cart/user state:', err);
    }
  };

  const handleSwitchUser = async (userId: string) => {
    try {
      const res = await fetch('/api/auth/switch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      });
      const data = await res.json();
      if (data.user) setCurrentUser(data.user);
    } catch (err) {
      console.error('Error switching user:', err);
    }
  };

  const handleSignUpUser = async (userData: Partial<User>) => {
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      const data = await res.json();
      if (data.user) setCurrentUser(data.user);
    } catch (err) {
      console.error('Error signing up user:', err);
    }
  };

  const handleAddToIntake = async (item: Omit<IntakeItem, 'id' | 'totalPrice' | 'totalWeightKg'>) => {
    try {
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item)
      });
      const data = await res.json();
      if (data.items) setIntakeList(data.items);
    } catch (err) {
      console.error('Error adding to intake list:', err);
    }
  };

  const handleUpdateQty = async (id: string, quantity: number) => {
    try {
      const res = await fetch(`/api/cart/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity })
      });
      const data = await res.json();
      if (data.items) setIntakeList(data.items);
    } catch (err) {
      console.error('Error updating quantity:', err);
    }
  };

  const handleRemoveItem = async (id: string) => {
    try {
      const res = await fetch(`/api/cart/${id}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.items) setIntakeList(data.items);
    } catch (err) {
      console.error('Error removing item:', err);
    }
  };

  const handleClearList = async () => {
    try {
      const res = await fetch('/api/cart', {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.items) setIntakeList(data.items);
    } catch (err) {
      console.error('Error clearing intake list:', err);
    }
  };

  const handleReorder = (items: IntakeItem[]) => {
    items.forEach(item => {
      handleAddToIntake({
        productId: item.productId,
        sku: item.sku,
        name: item.name,
        category: item.category,
        unitOfMeasure: item.unitOfMeasure,
        selectedFinish: item.selectedFinish,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        customNotes: `Reordered from previous production run`
      });
    });
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-slate-900 selection:text-white">
      {/* Header & Navigation */}
      <Navbar
        currentUser={currentUser}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        intakeCount={intakeList.length}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
      />

      {/* Main Tab Views */}
      <main className="pb-16 pt-4">
        {activeTab === 'voice' && (
          <AIVoiceIntake
            currentUser={currentUser}
            onIntakeUpdated={newList => setIntakeList(newList)}
            onNavigateTab={setActiveTab}
          />
        )}

        {activeTab === 'catalog' && (
          <ProductCatalog
            onAddToIntake={handleAddToIntake}
            onNavigateTab={setActiveTab}
          />
        )}

        {activeTab === 'intake' && (
          <IntakeAndQuoteGenerator
            intakeList={intakeList}
            currentUser={currentUser}
            onUpdateQty={handleUpdateQty}
            onRemoveItem={handleRemoveItem}
            onClearList={handleClearList}
            onNavigateTab={setActiveTab}
            onOrderSubmitted={() => setIntakeList([])}
          />
        )}

        {activeTab === 'orders' && (
          <OrderTracker
            onReorder={handleReorder}
            onNavigateTab={setActiveTab}
          />
        )}
      </main>

      {/* Customer Auth & Account Modal */}
      <CustomerAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        currentUser={currentUser}
        onSwitchUser={handleSwitchUser}
        onSignUp={handleSignUpUser}
      />
    </div>
  );
}
