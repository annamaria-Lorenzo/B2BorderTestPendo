import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import { db, DEMO_USERS } from './src/db/store';
import { OrderStatus, PaymentTerms, ShippingMethod } from './src/types';

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini Client (server-side only)
const aiApiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (aiApiKey) {
  ai = new GoogleGenAI({
    apiKey: aiApiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build'
      }
    }
  });
}

// REST API ENDPOINTS

// 1. Auth & User Profile
app.get('/api/auth/me', (req, res) => {
  res.json({
    user: db.getCurrentUser(),
    demoUsers: DEMO_USERS
  });
});

app.post('/api/auth/switch', (req, res) => {
  const { userId } = req.body;
  const user = db.switchDemoUser(userId);
  res.json({ user });
});

app.post('/api/auth/signup', (req, res) => {
  const { name, email, companyName, taxExemptNo, accountTier } = req.body;
  const newUser = {
    id: `usr-${Date.now()}`,
    name: name || 'B2B Purchaser',
    email: email || 'purchasing@company.com',
    companyName: companyName || 'New Manufacturing Corp',
    taxExemptNo: taxExemptNo || 'PENDING-TAX-EXEMPT',
    accountTier: accountTier || 'Standard B2B',
    creditLimit: 25000,
    creditAvailable: 25000,
    phone: '+1 (800) 555-0199',
    address: {
      street: '100 Enterprise Way',
      city: 'Industrial City',
      state: 'IL',
      zip: '60601',
      country: 'USA'
    }
  };
  db.setUser(newUser);
  res.json({ user: newUser });
});

// 2. Products Catalog
app.get('/api/products', (req, res) => {
  let products = db.getProducts();
  const { category, search, finish, material, intendedUse, sizeCategory } = req.query;

  if (category && category !== 'All') {
    products = products.filter(p => p.category === category);
  }

  if (finish && finish !== 'All') {
    products = products.filter(p => p.finishOptions.includes(finish as string));
  }

  if (material && material !== 'All') {
    products = products.filter(p => p.material.toLowerCase().includes((material as string).toLowerCase()));
  }

  if (intendedUse && intendedUse !== 'All') {
    products = products.filter(p => p.intendedUse?.toLowerCase() === (intendedUse as string).toLowerCase());
  }

  if (sizeCategory && sizeCategory !== 'All') {
    products = products.filter(p => p.sizeCategory === sizeCategory);
  }

  if (search && typeof search === 'string') {
    const q = search.toLowerCase();
    products = products.filter(
      p =>
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.material.toLowerCase().includes(q) ||
        (p.intendedUse && p.intendedUse.toLowerCase().includes(q))
    );
  }

  res.json({ products });
});

app.get('/api/products/:skuOrId', (req, res) => {
  const product = db.getProductBySkuOrId(req.params.skuOrId);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.json({ product });
});

// 3. Cart / Intake List
app.get('/api/cart', (req, res) => {
  res.json({
    items: db.getIntakeList(),
    user: db.getCurrentUser()
  });
});

app.post('/api/cart', (req, res) => {
  const { productId, sku, name, category, unitOfMeasure, selectedFinish, quantity, unitPrice, customNotes } = req.body;
  if (!quantity || quantity <= 0) {
    return res.status(400).json({ error: 'Valid quantity required' });
  }
  const updatedList = db.addToIntake({
    productId: productId || 'prod-001',
    sku: sku || 'HNG-110-SC',
    name: name || 'Hardware Item',
    category: category || 'Hinges',
    unitOfMeasure: unitOfMeasure || 'Box of 100',
    selectedFinish: selectedFinish || 'Standard',
    quantity: Number(quantity),
    unitPrice: Number(unitPrice) || 50,
    customNotes
  });
  res.json({ items: updatedList });
});

app.put('/api/cart/:id', (req, res) => {
  const { quantity } = req.body;
  const updatedList = db.updateIntakeItemQty(req.params.id, Number(quantity));
  res.json({ items: updatedList });
});

app.delete('/api/cart/:id', (req, res) => {
  const updatedList = db.removeIntakeItem(req.params.id);
  res.json({ items: updatedList });
});

app.delete('/api/cart', (req, res) => {
  const updatedList = db.clearIntakeList();
  res.json({ items: updatedList });
});

// 4. Automated Quote Generation
app.get('/api/quotes', (req, res) => {
  res.json({ quotes: db.getQuotes() });
});

app.get('/api/quotes/:id', (req, res) => {
  const quote = db.getQuoteById(req.params.id);
  if (!quote) return res.status(404).json({ error: 'Quote not found' });
  res.json({ quote });
});

app.post('/api/quotes/generate', (req, res) => {
  try {
    const { paymentTerms, shippingMethod, salesNotes } = req.body;
    const newQuote = db.generateQuote({
      paymentTerms: (paymentTerms as PaymentTerms) || 'Net 30',
      shippingMethod: (shippingMethod as ShippingMethod) || 'Standard Freight (3-5 Days)',
      salesNotes
    });
    res.json({ quote: newQuote });
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Failed to generate quote' });
  }
});

// 5. Orders Engine & Direct DB Status Sync
app.get('/api/orders', (req, res) => {
  res.json({ orders: db.getOrders() });
});

app.get('/api/orders/:id', (req, res) => {
  const order = db.getOrderById(req.params.id);
  if (!order) return res.status(404).json({ error: 'Order not found' });
  res.json({ order });
});

app.post('/api/orders/from-quote', (req, res) => {
  try {
    const { quoteId } = req.body;
    const order = db.createOrderFromQuote(quoteId);
    res.json({ order });
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Failed to convert quote to order' });
  }
});

app.put('/api/orders/:id/status', (req, res) => {
  try {
    const { status, note } = req.body;
    const updatedOrder = db.updateOrderStatus(req.params.id, status as OrderStatus, note);
    res.json({ order: updatedOrder });
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Failed to update order status' });
  }
});

// 6. Gemini AI Sales Agent & Voice Intake Engine
app.post('/api/ai/chat', async (req, res) => {
  try {
    const { message, conversationHistory = [] } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message text is required' });
    }

    const products = db.getProducts();
    const currentIntake = db.getIntakeList();
    const user = db.getCurrentUser();

    // If Gemini API Key is available, process with Gemini 3.6 Flash
    if (ai) {
      const systemInstruction = `You are "Apex Sales AI", an expert B2B Technical Intake Specialist for Apex Hardware Manufacturing.
You assist commercial furniture manufacturers, cabinetmakers, and industrial clients with component selection, bulk pricing, technical specifications, and intake list generation.

Current Customer: ${user.companyName} (Account Tier: ${user.accountTier})
Catalog Products Available:
${products.map(p => `- SKU: ${p.sku} | Name: ${p.name} | Category: ${p.category} | UOM: ${p.unitOfMeasure} | Base Price: $${p.baseUnitPrice} | Finishes: ${p.finishOptions.join(', ')} | Stock: ${p.stockAvailable}`).join('\n')}

Current Intake List in Cart:
${currentIntake.length === 0 ? 'Empty' : currentIntake.map(i => `${i.quantity}x ${i.name} (SKU: ${i.sku}, Finish: ${i.selectedFinish})`).join(', ')}

Your task:
1. Provide a professional, concise, helpful response to the user query.
2. Search the catalog for products mentioned or implied in the user's speech/text.
3. If the user mentions quantities or wants to order/add items (e.g. "I need 20 boxes of soft close hinges in satin nickel" or "add 500 dowel pins"), extract the exact SKU, quantity, finish, and unitPrice.
4. If they ask to generate a quote or place an order, indicate in suggestedAction ('generate_quote' or 'add_to_intake').

Respond strictly in structured JSON matching this schema:
{
  "replyText": "your polite technical and helpful answer to the user",
  "extractedItems": [
    {
      "sku": "SKU_STRING",
      "name": "PRODUCT_NAME",
      "quantity": 10,
      "finish": "Satin Nickel",
      "unitPrice": 68.00,
      "reason": "Extracted from user query for 10 boxes of hinges"
    }
  ],
  "suggestedAction": "add_to_intake" or "generate_quote" or "view_product" or "none"
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: [
          ...conversationHistory.map((h: any) => ({
            role: h.sender === 'user' ? 'user' : 'model',
            parts: [{ text: h.text }]
          })),
          { role: 'user', parts: [{ text: message }] }
        ],
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          temperature: 0.2
        }
      });

      const jsonText = response.text || '{}';
      let parsed: any = {};
      try {
        parsed = JSON.parse(jsonText);
      } catch (e) {
        parsed = {
          replyText: response.text || 'I analyzed your request. Let me know how else I can assist with your hardware quote.',
          extractedItems: [],
          suggestedAction: 'none'
        };
      }

      // Automatically add extracted items to database intake list if user requested addition
      let updatedIntake = currentIntake;
      if (parsed.extractedItems && Array.isArray(parsed.extractedItems) && parsed.extractedItems.length > 0) {
        for (const item of parsed.extractedItems) {
          const product = products.find(p => p.sku === item.sku || p.name.toLowerCase().includes(item.name?.toLowerCase()));
          if (product) {
            db.addToIntake({
              productId: product.id,
              sku: product.sku,
              name: product.name,
              category: product.category,
              unitOfMeasure: product.unitOfMeasure,
              selectedFinish: item.finish || product.finishOptions[0] || 'Standard',
              quantity: Number(item.quantity) || 1,
              unitPrice: Number(item.unitPrice) || product.baseUnitPrice,
              customNotes: 'Added via Voice/AI Intake Agent'
            });
          }
        }
        updatedIntake = db.getIntakeList();
      }

      return res.json({
        replyText: parsed.replyText,
        extractedItems: parsed.extractedItems || [],
        suggestedAction: parsed.suggestedAction || 'none',
        currentIntakeList: updatedIntake
      });
    } else {
      // Rule-based fallback if no GEMINI_API_KEY is present
      const lowerMsg = message.toLowerCase();
      let matchedItems: any[] = [];
      let replyText = `I've processed your input: "${message}".`;

      if (lowerMsg.includes('hinge') || lowerMsg.includes('soft close')) {
        const prod = products.find(p => p.sku === 'HNG-110-SC');
        if (prod) {
          matchedItems.push({
            sku: prod.sku,
            name: prod.name,
            quantity: 10,
            finish: 'Satin Nickel',
            unitPrice: 68.00,
            reason: 'Matched soft close cabinet hinge query'
          });
          db.addToIntake({
            productId: prod.id,
            sku: prod.sku,
            name: prod.name,
            category: prod.category,
            unitOfMeasure: prod.unitOfMeasure,
            selectedFinish: 'Satin Nickel',
            quantity: 10,
            unitPrice: 68.00,
            customNotes: 'Added via AI Voice Assistant'
          });
          replyText = `Found ${prod.name} (SKU: ${prod.sku}). Added 10 boxes (${prod.unitOfMeasure}) in Satin Nickel to your B2B intake list at $68.00/box.`;
        }
      } else if (lowerMsg.includes('screw') || lowerMsg.includes('nail')) {
        const prod = products.find(p => p.sku === 'SCR-M4-POZI');
        if (prod) {
          matchedItems.push({
            sku: prod.sku,
            name: prod.name,
            quantity: 15,
            finish: 'Zinc Coated',
            unitPrice: 22.00,
            reason: 'Matched furniture assembly screws'
          });
          db.addToIntake({
            productId: prod.id,
            sku: prod.sku,
            name: prod.name,
            category: prod.category,
            unitOfMeasure: prod.unitOfMeasure,
            selectedFinish: 'Zinc Coated',
            quantity: 15,
            unitPrice: 22.00,
            customNotes: 'Added via AI Voice Assistant'
          });
          replyText = `Found ${prod.name} (SKU: ${prod.sku}). Added 15 boxes (${prod.unitOfMeasure}) to your intake list at $22.00/box.`;
        }
      } else if (lowerMsg.includes('slide') || lowerMsg.includes('drawer')) {
        const prod = products.find(p => p.sku === 'SLD-FULL-100');
        if (prod) {
          matchedItems.push({
            sku: prod.sku,
            name: prod.name,
            quantity: 8,
            finish: 'Zinc Coated',
            unitPrice: 98.00,
            reason: 'Matched drawer slides query'
          });
          db.addToIntake({
            productId: prod.id,
            sku: prod.sku,
            name: prod.name,
            category: prod.category,
            unitOfMeasure: prod.unitOfMeasure,
            selectedFinish: 'Zinc Coated',
            quantity: 8,
            unitPrice: 98.00,
            customNotes: 'Added via AI Voice Assistant'
          });
          replyText = `Added 8 boxes of ${prod.name} (${prod.unitOfMeasure}) to your B2B intake list.`;
        }
      } else if (lowerMsg.includes('quote') || lowerMsg.includes('generate')) {
        replyText = `Your intake list currently contains ${currentIntake.reduce((a, b) => a + b.quantity, 0)} packages. Click 'Generate Official B2B Quote' to produce your formal PDF/document quote with Tier 2 discounts!`;
      } else {
        replyText = `I can help search our hardware database for hinges, drawer slides, fasteners, and joinery pins. Try asking for "20 boxes of 110-degree soft-close hinges in satin nickel" or "5000 M4x30mm assembly screws".`;
      }

      res.json({
        replyText,
        extractedItems: matchedItems,
        suggestedAction: matchedItems.length > 0 ? 'add_to_intake' : 'none',
        currentIntakeList: db.getIntakeList()
      });
    }
  } catch (error: any) {
    console.error('AI Chat endpoint error:', error);
    res.status(500).json({ error: error.message || 'Failed to process AI intake request' });
  }
});

// START SERVER (Vite integration for dev, static serving for prod)
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Apex B2B Sales Intake Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
