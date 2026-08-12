export type UserAccountTier = 'Standard B2B' | 'Tier 1 Wholesale (-10%)' | 'Tier 2 Enterprise (-18%)';

export interface User {
  id: string;
  name: string;
  email: string;
  companyName: string;
  taxExemptNo: string;
  accountTier: UserAccountTier;
  creditLimit: number;
  creditAvailable: number;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
}

export type ProductCategory =
  | 'Hinges'
  | 'Drawer Slides'
  | 'Brackets & Connectors'
  | 'Nails & Screws'
  | 'Pins & Inserts'
  | 'Structural Fasteners';

export interface TierPrice {
  minQty: number;
  unitPrice: number;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  category: ProductCategory;
  subCategory: string;
  description: string;
  material: string;
  intendedUse: string; // e.g., "Cabinetry & Casegoods", "Heavy-Duty Doors", "Tables & Frames", "Flat-Pack Assembly", "Trim & Molding"
  sizeCategory?: 'Small (<50mm)' | 'Medium (50-200mm)' | 'Large (>200mm)';
  finishOptions: string[];
  dimensions: string;
  unitOfMeasure: string; // e.g. "Box of 1000", "Bag of 500"
  baseUnitPrice: number;
  weightKgPerUnit: number;
  stockAvailable: number;
  tierPricing: TierPrice[];
  specs: Record<string, string>;
  imageUrl: string;
}

export interface IntakeItem {
  id: string;
  productId: string;
  sku: string;
  name: string;
  category: ProductCategory;
  unitOfMeasure: string;
  selectedFinish: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  totalWeightKg: number;
  customNotes?: string;
}

export type PaymentTerms = 'Net 30' | 'Net 60' | 'Pre-paid Credit Card' | 'Wire Transfer';
export type ShippingMethod = 'Standard Freight (3-5 Days)' | 'Expedited Freight (1-2 Days)' | 'White Glove LTL Delivery';
export type QuoteStatus = 'Draft' | 'Generated' | 'Approved' | 'Converted To Order' | 'Expired';

export interface Quote {
  id: string;
  quoteNumber: string;
  userId: string;
  companyName: string;
  items: IntakeItem[];
  subtotal: number;
  volumeDiscountPercent: number;
  volumeDiscountAmount: number;
  shippingCost: number;
  estimatedTax: number;
  grandTotal: number;
  paymentTerms: PaymentTerms;
  shippingMethod: ShippingMethod;
  leadTimeDays: number;
  status: QuoteStatus;
  createdAt: string;
  validUntil: string;
  salesNotes: string;
}

export type OrderStatus =
  | 'Submitted'
  | 'Credit Approved'
  | 'In Production'
  | 'Quality Check'
  | 'Shipped'
  | 'Delivered';

export interface OrderStatusLog {
  status: OrderStatus;
  timestamp: string;
  note: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  quoteId: string;
  userId: string;
  companyName: string;
  items: IntakeItem[];
  subtotal: number;
  discountAmount: number;
  shippingCost: number;
  tax: number;
  total: number;
  paymentTerms: PaymentTerms;
  shippingAddress: string;
  trackingNumber: string;
  status: OrderStatus;
  statusHistory: OrderStatusLog[];
  createdAt: string;
  estimatedDelivery: string;
}

export interface AIAgentMessage {
  id: string;
  sender: 'user' | 'agent' | 'system';
  text: string;
  timestamp: string;
  extractedItems?: {
    sku: string;
    name: string;
    quantity: number;
    finish?: string;
    unitPrice?: number;
    reason?: string;
  }[];
  suggestedAction?: 'add_to_intake' | 'generate_quote' | 'view_product';
}
