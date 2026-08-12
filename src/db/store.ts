import {
  User,
  Product,
  IntakeItem,
  Quote,
  Order,
  OrderStatus,
  PaymentTerms,
  ShippingMethod
} from '../types';
import { INITIAL_PRODUCTS } from '../data/mockProducts';

// Simulated B2B Accounts
export const DEMO_USERS: User[] = [
  {
    id: 'usr-001',
    name: 'Sarah Lin (Procurement Lead)',
    email: 'sarah.lin@woodcraftmfg.com',
    companyName: 'WoodCraft Modular Furniture Mfg',
    taxExemptNo: 'TX-8849201-EX',
    accountTier: 'Tier 2 Enterprise (-18%)',
    creditLimit: 75000,
    creditAvailable: 58200,
    phone: '+1 (800) 555-0192',
    address: {
      street: '420 Industrial Parkway, Suite 100',
      city: 'Grand Rapids',
      state: 'MI',
      zip: '49512',
      country: 'USA'
    }
  },
  {
    id: 'usr-002',
    name: 'Marcus Vance (Plant Manager)',
    email: 'marcus@nordicdesigns.co',
    companyName: 'Nordic Designs & Joinery',
    taxExemptNo: 'TX-1102934-EX',
    accountTier: 'Tier 1 Wholesale (-10%)',
    creditLimit: 30000,
    creditAvailable: 22400,
    phone: '+1 (800) 555-0144',
    address: {
      street: '880 Millwright Way',
      city: 'High Point',
      state: 'NC',
      zip: '27260',
      country: 'USA'
    }
  },
  {
    id: 'usr-003',
    name: 'David Miller (Custom Shop)',
    email: 'david@apexjoinery.com',
    companyName: 'Apex Artisan Furniture Studio',
    taxExemptNo: 'TX-9938102-EX',
    accountTier: 'Standard B2B',
    creditLimit: 15000,
    creditAvailable: 15000,
    phone: '+1 (800) 555-0188',
    address: {
      street: '12 Timberline Drive',
      city: 'Portland',
      state: 'OR',
      zip: '97201',
      country: 'USA'
    }
  }
];

// Initial In-Memory State
let productsStore: Product[] = [...INITIAL_PRODUCTS];
let currentUserStore: User = DEMO_USERS[0]; // Default logged in as WoodCraft
let currentIntakeStore: IntakeItem[] = [
  {
    id: 'item-init-1',
    productId: 'prod-001',
    sku: 'HNG-110-SC',
    name: '110° Soft-Close European Concealed Cabinet Hinge',
    category: 'Hinges',
    unitOfMeasure: 'Box of 100',
    selectedFinish: 'Satin Nickel',
    quantity: 15,
    unitPrice: 68.00,
    totalPrice: 1020.00,
    totalWeightKg: 168.0,
    customNotes: 'For Q3 Kitchen Cabinetry Line'
  },
  {
    id: 'item-init-2',
    productId: 'prod-008',
    sku: 'SCR-M4-POZI',
    name: 'Deep-Thread Pozi-Drive Cabinet Assembly Screws M4x30mm',
    category: 'Nails & Screws',
    unitOfMeasure: 'Box of 1000',
    selectedFinish: 'Zinc Coated',
    quantity: 20,
    unitPrice: 22.00,
    totalPrice: 440.00,
    totalWeightKg: 58.0,
    customNotes: 'M4x30 assembly stock'
  }
];

let quotesStore: Quote[] = [
  {
    id: 'qte-9021',
    quoteNumber: 'APX-Q-2026-9021',
    userId: 'usr-001',
    companyName: 'WoodCraft Modular Furniture Mfg',
    items: [...currentIntakeStore],
    subtotal: 1460.00,
    volumeDiscountPercent: 18,
    volumeDiscountAmount: 262.80,
    shippingCost: 120.00,
    estimatedTax: 0, // Tax exempt
    grandTotal: 1317.20,
    paymentTerms: 'Net 30',
    shippingMethod: 'Standard Freight (3-5 Days)',
    leadTimeDays: 4,
    status: 'Generated',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    validUntil: new Date(Date.now() + 86400000 * 28).toISOString(),
    salesNotes: 'Tier 2 Enterprise account pricing applied automatically. Free pallet staging.'
  }
];

let ordersStore: Order[] = [
  {
    id: 'ord-1001',
    orderNumber: 'APX-ORD-2026-1001',
    quoteId: 'qte-8812',
    userId: 'usr-001',
    companyName: 'WoodCraft Modular Furniture Mfg',
    items: [
      {
        id: 'ord-item-1',
        productId: 'prod-004',
        sku: 'SLD-FULL-100',
        name: '100lb Full-Extension Ball Bearing Soft-Close Drawer Slide',
        category: 'Drawer Slides',
        unitOfMeasure: 'Box of 10 Pairs',
        selectedFinish: 'Zinc Coated',
        quantity: 50,
        unitPrice: 84.00,
        totalPrice: 4200.00,
        totalWeightKg: 640.0
      },
      {
        id: 'ord-item-2',
        productId: 'prod-010',
        sku: 'PIN-DOWEL-840',
        name: 'Spiral Fluted Hardwood Joinery Dowel Pins 8x40mm',
        category: 'Pins & Inserts',
        unitOfMeasure: 'Bag of 500',
        selectedFinish: 'Natural Wood',
        quantity: 30,
        unitPrice: 11.90,
        totalPrice: 357.00,
        totalWeightKg: 42.0
      }
    ],
    subtotal: 4557.00,
    discountAmount: 820.26,
    shippingCost: 280.00,
    tax: 0,
    total: 4016.74,
    paymentTerms: 'Net 30',
    shippingAddress: '420 Industrial Parkway, Suite 100, Grand Rapids, MI 49512',
    trackingNumber: '1Z9999999999999999',
    status: 'In Production',
    statusHistory: [
      {
        status: 'Submitted',
        timestamp: new Date(Date.now() - 86400000 * 3).toISOString(),
        note: 'B2B order placed via automated intake approval'
      },
      {
        status: 'Credit Approved',
        timestamp: new Date(Date.now() - 86400000 * 2.5).toISOString(),
        note: 'Net 30 Credit term verified ($4,016.74 allocated)'
      },
      {
        status: 'In Production',
        timestamp: new Date(Date.now() - 86400000 * 1).toISOString(),
        note: 'Pallet staging and bulk sorting in Warehouse Bay 4'
      }
    ],
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    estimatedDelivery: new Date(Date.now() + 86400000 * 2).toISOString()
  }
];

// Helper database functions
export const db = {
  getProducts: () => productsStore,
  getProductBySkuOrId: (query: string) => {
    const q = query.trim().toLowerCase();
    return productsStore.find(
      p => p.sku.toLowerCase() === q || p.id.toLowerCase() === q || p.name.toLowerCase().includes(q)
    );
  },
  
  // User Auth
  getCurrentUser: () => currentUserStore,
  setUser: (user: User) => {
    currentUserStore = user;
    return currentUserStore;
  },
  switchDemoUser: (userId: string) => {
    const found = DEMO_USERS.find(u => u.id === userId);
    if (found) {
      currentUserStore = found;
    }
    return currentUserStore;
  },

  // Intake List (Cart)
  getIntakeList: () => currentIntakeStore,
  addToIntake: (item: Omit<IntakeItem, 'id' | 'totalPrice' | 'totalWeightKg'>) => {
    const product = productsStore.find(p => p.id === item.productId || p.sku === item.sku);
    let unitPrice = item.unitPrice;

    // Calculate volume tier price if available
    if (product) {
      const tier = [...product.tierPricing].reverse().find(t => item.quantity >= t.minQty);
      if (tier) {
        unitPrice = tier.unitPrice;
      }
    }

    const weightKgPerUnit = product ? product.weightKgPerUnit : 5;
    const totalPrice = unitPrice * item.quantity;
    const totalWeightKg = weightKgPerUnit * item.quantity;

    // Check if item already exists in intake
    const existingIndex = currentIntakeStore.findIndex(
      i => i.productId === item.productId && i.selectedFinish === item.selectedFinish
    );

    if (existingIndex >= 0) {
      const existing = currentIntakeStore[existingIndex];
      const newQty = existing.quantity + item.quantity;
      let newUnitPrice = existing.unitPrice;
      if (product) {
        const tier = [...product.tierPricing].reverse().find(t => newQty >= t.minQty);
        if (tier) newUnitPrice = tier.unitPrice;
      }
      currentIntakeStore[existingIndex] = {
        ...existing,
        quantity: newQty,
        unitPrice: newUnitPrice,
        totalPrice: newUnitPrice * newQty,
        totalWeightKg: weightKgPerUnit * newQty,
        customNotes: item.customNotes ? `${existing.customNotes || ''} | ${item.customNotes}` : existing.customNotes
      };
    } else {
      const newItem: IntakeItem = {
        ...item,
        id: `intake-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        unitPrice,
        totalPrice,
        totalWeightKg
      };
      currentIntakeStore.push(newItem);
    }
    return currentIntakeStore;
  },

  updateIntakeItemQty: (id: string, quantity: number) => {
    if (quantity <= 0) {
      currentIntakeStore = currentIntakeStore.filter(i => i.id !== id);
    } else {
      currentIntakeStore = currentIntakeStore.map(i => {
        if (i.id === id) {
          const product = productsStore.find(p => p.id === i.productId || p.sku === i.sku);
          let unitPrice = i.unitPrice;
          if (product) {
            const tier = [...product.tierPricing].reverse().find(t => quantity >= t.minQty);
            if (tier) unitPrice = tier.unitPrice;
          }
          const weightKgPerUnit = product ? product.weightKgPerUnit : 5;
          return {
            ...i,
            quantity,
            unitPrice,
            totalPrice: unitPrice * quantity,
            totalWeightKg: weightKgPerUnit * quantity
          };
        }
        return i;
      });
    }
    return currentIntakeStore;
  },

  removeIntakeItem: (id: string) => {
    currentIntakeStore = currentIntakeStore.filter(i => i.id !== id);
    return currentIntakeStore;
  },

  clearIntakeList: () => {
    currentIntakeStore = [];
    return currentIntakeStore;
  },

  // Automated Quote Generator
  generateQuote: (params: {
    paymentTerms: PaymentTerms;
    shippingMethod: ShippingMethod;
    salesNotes?: string;
  }) => {
    if (currentIntakeStore.length === 0) {
      throw new Error('Intake list is empty. Add products before generating a quote.');
    }

    const subtotal = currentIntakeStore.reduce((acc, item) => acc + item.totalPrice, 0);
    const totalWeight = currentIntakeStore.reduce((acc, item) => acc + item.totalWeightKg, 0);

    // Apply Tier Account Discount
    let volumeDiscountPercent = 0;
    if (currentUserStore.accountTier.includes('Tier 2')) {
      volumeDiscountPercent = 18;
    } else if (currentUserStore.accountTier.includes('Tier 1')) {
      volumeDiscountPercent = 10;
    }
    const volumeDiscountAmount = (subtotal * volumeDiscountPercent) / 100;

    // Freight Shipping Calculation based on weight & method
    let baseRate = totalWeight * 0.45; // $0.45 per kg
    if (params.shippingMethod.includes('Expedited')) baseRate *= 1.75;
    if (params.shippingMethod.includes('White Glove')) baseRate += 150;
    const shippingCost = Math.max(75, Math.round(baseRate * 100) / 100);

    // Tax exempt calculation
    const estimatedTax = currentUserStore.taxExemptNo ? 0 : Math.round((subtotal - volumeDiscountAmount) * 0.06 * 100) / 100;
    const grandTotal = Math.round((subtotal - volumeDiscountAmount + shippingCost + estimatedTax) * 100) / 100;

    const leadTimeDays = totalWeight > 500 ? 7 : 3;

    const newQuote: Quote = {
      id: `qte-${Date.now()}`,
      quoteNumber: `APX-Q-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      userId: currentUserStore.id,
      companyName: currentUserStore.companyName,
      items: JSON.parse(JSON.stringify(currentIntakeStore)),
      subtotal,
      volumeDiscountPercent,
      volumeDiscountAmount,
      shippingCost,
      estimatedTax,
      grandTotal,
      paymentTerms: params.paymentTerms,
      shippingMethod: params.shippingMethod,
      leadTimeDays,
      status: 'Generated',
      createdAt: new Date().toISOString(),
      validUntil: new Date(Date.now() + 86400000 * 30).toISOString(),
      salesNotes: params.salesNotes || `Automated B2B intake quote for ${currentUserStore.companyName}`
    };

    quotesStore.unshift(newQuote);
    return newQuote;
  },

  getQuotes: () => quotesStore,
  getQuoteById: (id: string) => quotesStore.find(q => q.id === id),

  // Orders Engine
  createOrderFromQuote: (quoteId: string) => {
    const quote = quotesStore.find(q => q.id === quoteId);
    if (!quote) throw new Error('Quote not found');

    const newOrderNumber = `APX-ORD-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: newOrderNumber,
      quoteId: quote.id,
      userId: currentUserStore.id,
      companyName: currentUserStore.companyName,
      items: quote.items,
      subtotal: quote.subtotal,
      discountAmount: quote.volumeDiscountAmount,
      shippingCost: quote.shippingCost,
      tax: quote.estimatedTax,
      total: quote.grandTotal,
      paymentTerms: quote.paymentTerms,
      shippingAddress: `${currentUserStore.address.street}, ${currentUserStore.address.city}, ${currentUserStore.address.state} ${currentUserStore.address.zip}`,
      trackingNumber: `APX-TRK-${Math.floor(100000000 + Math.random() * 900000000)}`,
      status: 'Submitted',
      statusHistory: [
        {
          status: 'Submitted',
          timestamp: new Date().toISOString(),
          note: `Official B2B order converted from Quote ${quote.quoteNumber}`
        }
      ],
      createdAt: new Date().toISOString(),
      estimatedDelivery: new Date(Date.now() + 86400000 * quote.leadTimeDays).toISOString()
    };

    quote.status = 'Converted To Order';
    ordersStore.unshift(newOrder);

    // Deduct available credit if Net 30/60
    if (quote.paymentTerms.startsWith('Net')) {
      currentUserStore.creditAvailable = Math.max(0, currentUserStore.creditAvailable - quote.grandTotal);
    }

    // Clear current intake
    currentIntakeStore = [];

    return newOrder;
  },

  getOrders: () => ordersStore,
  getOrderById: (id: string) => ordersStore.find(o => o.id === id),

  // Direct database status update for real-time tracking demonstration
  updateOrderStatus: (orderId: string, newStatus: OrderStatus, note?: string) => {
    const order = ordersStore.find(o => o.id === orderId);
    if (!order) throw new Error('Order not found');

    order.status = newStatus;
    order.statusHistory.push({
      status: newStatus,
      timestamp: new Date().toISOString(),
      note: note || `Status updated to ${newStatus}`
    });

    return order;
  }
};
