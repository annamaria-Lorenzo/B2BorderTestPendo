import React, { useState, useEffect } from "react";
import { User, IntakeItem } from "./types";
import { DEMO_USERS } from "./db/store";
import { Navbar } from "./components/Navbar";
import { CustomerAuthModal } from "./components/CustomerAuthModal";
import { AIVoiceIntake } from "./components/AIVoiceIntake";
import { ProductCatalog } from "./components/ProductCatalog";
import { IntakeAndQuoteGenerator } from "./components/IntakeAndQuoteGenerator";
import { OrderTracker } from "./components/OrderTracker";

export default function App() {
  const [currentUser, setCurrentUser] = useState<User>(DEMO_USERS[0]);
  const [activeTab, setActiveTab] = useState<
    "voice" | "catalog" | "intake" | "orders"
  >("voice");
  const [intakeList, setIntakeList] = useState<IntakeItem[]>([]);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    fetchUserDataAndCart();
  }, []);

  const fetchUserDataAndCart = async () => {
    try {
      const res = await fetch("/api/cart");
      const data = await res.json();
      if (data.user) setCurrentUser(data.user);
      if (data.items) setIntakeList(data.items);
    } catch (err) {
      console.error("Error fetching initial cart/user state:", err);
    }
  };

  const handleSwitchUser = async (userId: string) => {
    const previousAccountTier = currentUser.accountTier;
    try {
      const res = await fetch("/api/auth/switch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      const data = await res.json();
      if (data.user) {
        setCurrentUser(data.user);

        // Track account switch
        if ((window as any).pendo) {
          (window as any).pendo.track("b2b_account_switched", {
            new_user_id: data.user.id,
            new_company_name: data.user.companyName,
            new_account_tier: data.user.accountTier,
            previous_account_tier: previousAccountTier,
          });
        }
      }
    } catch (err) {
      console.error("Error switching user:", err);
    }
  };

  const handleSignUpUser = async (userData: Partial<User>) => {
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });
      const data = await res.json();
      if (data.user) setCurrentUser(data.user);
    } catch (err) {
      console.error("Error signing up user:", err);
    }
  };

  const handleAddToIntake = async (
    item: Omit<IntakeItem, "id" | "totalPrice" | "totalWeightKg">,
  ) => {
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item),
      });
      const data = await res.json();
      if (data.items) setIntakeList(data.items);
    } catch (err) {
      console.error("Error adding to intake list:", err);
    }
  };

  const handleUpdateQty = async (id: string, quantity: number) => {
    try {
      const res = await fetch(`/api/cart/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity }),
      });
      const data = await res.json();
      if (data.items) setIntakeList(data.items);
    } catch (err) {
      console.error("Error updating quantity:", err);
    }
  };

  const handleRemoveItem = async (id: string) => {
    try {
      const res = await fetch(`/api/cart/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.items) setIntakeList(data.items);
    } catch (err) {
      console.error("Error removing item:", err);
    }
  };

  const handleClearList = async () => {
    const clearedCount = intakeList.length;
    const clearedValue = intakeList.reduce(
      (acc, item) => acc + item.totalPrice,
      0,
    );
    try {
      const res = await fetch("/api/cart", {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.items) setIntakeList(data.items);

      // Track intake list cleared
      if ((window as any).pendo) {
        (window as any).pendo.track("intake_list_cleared", {
          items_cleared_count: clearedCount,
          total_value_cleared: clearedValue,
          company_name: currentUser.companyName,
          account_tier: currentUser.accountTier,
        });
      }
    } catch (err) {
      console.error("Error clearing intake list:", err);
    }
  };

  const handleReorder = (items: IntakeItem[]) => {
    // Track reorder event once before adding items
    if ((window as any).pendo) {
      const reorderedSkus = items
        .map((item) => item.sku)
        .join(", ")
        .substring(0, 100);
      const estimatedTotal = items.reduce(
        (acc, item) => acc + item.unitPrice * item.quantity,
        0,
      );
      (window as any).pendo.track("order_items_reordered", {
        reordered_item_count: items.length,
        reordered_skus: reorderedSkus,
        estimated_reorder_total: estimatedTotal,
        company_name: currentUser.companyName,
      });
    }

    items.forEach((item) => {
      handleAddToIntake({
        productId: item.productId,
        sku: item.sku,
        name: item.name,
        category: item.category,
        unitOfMeasure: item.unitOfMeasure,
        selectedFinish: item.selectedFinish,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        customNotes: `Reordered from previous production run`,
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
        {activeTab === "voice" && (
          <AIVoiceIntake
            currentUser={currentUser}
            onIntakeUpdated={(newList) => setIntakeList(newList)}
            onNavigateTab={setActiveTab}
          />
        )}

        {activeTab === "catalog" && (
          <ProductCatalog
            onAddToIntake={handleAddToIntake}
            onNavigateTab={setActiveTab}
          />
        )}

        {activeTab === "intake" && (
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

        {activeTab === "orders" && (
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
