import { Product } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-001',
    sku: 'HNG-110-SC',
    name: '110° Soft-Close European Concealed Cabinet Hinge',
    category: 'Hinges',
    subCategory: 'Concealed Cabinet Hinges',
    description: 'Integrated hydraulic dampener soft-close mechanism for frameless cabinet doors. Quick clip-on mounting plate included.',
    material: 'Cold-Rolled Steel',
    intendedUse: 'Cabinetry & Casegoods',
    sizeCategory: 'Small (<50mm)',
    finishOptions: ['Satin Nickel', 'Matte Black Anodized'],
    dimensions: '35mm Cup Diameter / 11.5mm Depth',
    unitOfMeasure: 'Box of 100',
    baseUnitPrice: 78.00, // $0.78 per hinge
    weightKgPerUnit: 11.2,
    stockAvailable: 2450,
    tierPricing: [
      { minQty: 1, unitPrice: 78.00 },
      { minQty: 10, unitPrice: 68.00 },
      { minQty: 50, unitPrice: 55.00 },
      { minQty: 100, unitPrice: 46.00 }
    ],
    specs: {
      'Opening Angle': '110 Degrees',
      'Door Thickness': '14mm - 24mm',
      'Adjustment': '3D Cam Adjustment (±2mm)',
      'Salt Spray Rating': '48 Hours Grade 9'
    },
    imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'prod-002',
    sku: 'HNG-3D-ADJ',
    name: '3D Adjustable Invisible Heavy-Duty Door Hinge',
    category: 'Hinges',
    subCategory: 'Concealed Architectural Hinges',
    description: 'Heavy load capacity flush mounting hinge for high-end architectural furniture, folding doors, and luxury wardrobes.',
    material: 'Zinc Alloy',
    intendedUse: 'Heavy-Duty Doors',
    sizeCategory: 'Medium (50-200mm)',
    finishOptions: ['Satin Nickel', 'Polished Brass', 'Matte Black Anodized'],
    dimensions: '150mm x 30mm',
    unitOfMeasure: 'Box of 20',
    baseUnitPrice: 185.00,
    weightKgPerUnit: 14.5,
    stockAvailable: 680,
    tierPricing: [
      { minQty: 1, unitPrice: 185.00 },
      { minQty: 5, unitPrice: 165.00 },
      { minQty: 20, unitPrice: 142.00 }
    ],
    specs: {
      'Max Load Capacity': '80kg (176lbs) per pair',
      'Door Min Thickness': '38mm',
      'Rotation Angle': '180 Degrees'
    },
    imageUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'prod-003',
    sku: 'HNG-CONT-PIANO',
    name: 'Heavy-Duty Stainless Steel Continuous Piano Hinge (72")',
    category: 'Hinges',
    subCategory: 'Continuous Hinges',
    description: 'Seamless continuous hinge with pre-drilled countersunk holes for fold-down bench tops, piano lids, and heavy storage chests.',
    material: 'Stainless Steel 304',
    intendedUse: 'Heavy-Duty Doors',
    sizeCategory: 'Large (>200mm)',
    finishOptions: ['Satin Stainless', 'Polished Stainless'],
    dimensions: '2-inch Width x 72-inch Length x 0.060" Pin',
    unitOfMeasure: 'Pack of 10',
    baseUnitPrice: 140.00,
    weightKgPerUnit: 18.0,
    stockAvailable: 420,
    tierPricing: [
      { minQty: 1, unitPrice: 140.00 },
      { minQty: 10, unitPrice: 122.00 },
      { minQty: 50, unitPrice: 105.00 }
    ],
    specs: {
      'Hole Spacing': '2 inches center-to-center',
      'Pin Diameter': '0.120 inch Stainless Steel',
      'Corrosion Resistance': 'Class 3 Outdoor Industrial'
    },
    imageUrl: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'prod-004',
    sku: 'SLD-FULL-100',
    name: '100lb Full-Extension Ball Bearing Soft-Close Drawer Slide',
    category: 'Drawer Slides',
    subCategory: 'Side-Mount Slides',
    description: 'Industrial grade smooth telescopic action drawer slide with anti-rebound rubber buffer and hydraulic soft-closing dampener.',
    material: 'Cold-Rolled Steel',
    intendedUse: 'Cabinetry & Casegoods',
    sizeCategory: 'Large (>200mm)',
    finishOptions: ['Zinc Coated', 'Matte Black Anodized'],
    dimensions: '18-inch Length (450mm) / 45mm Height',
    unitOfMeasure: 'Box of 10 Pairs',
    baseUnitPrice: 115.00,
    weightKgPerUnit: 12.8,
    stockAvailable: 1200,
    tierPricing: [
      { minQty: 1, unitPrice: 115.00 },
      { minQty: 10, unitPrice: 98.00 },
      { minQty: 50, unitPrice: 84.00 }
    ],
    specs: {
      'Load Capacity': '45kg (100lbs)',
      'Cycle Test': '80,000 Open/Close Cycles',
      'Mounting Clearance': '12.7mm (1/2 inch)'
    },
    imageUrl: 'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'prod-005',
    sku: 'SLD-UND-3D',
    name: 'Undermount Synchronized Motion Soft-Close Slide with 3D Clips',
    category: 'Drawer Slides',
    subCategory: 'Concealed Undermount Slides',
    description: 'Concealed undermount slide system for high-end cabinetry. Clean hidden aesthetic with 3-dimensional front locking release clips.',
    material: 'Galvanized Steel',
    intendedUse: 'Cabinetry & Casegoods',
    sizeCategory: 'Large (>200mm)',
    finishOptions: ['Zinc Coated'],
    dimensions: '21-inch Length (533mm)',
    unitOfMeasure: 'Box of 10 Pairs',
    baseUnitPrice: 240.00,
    weightKgPerUnit: 16.5,
    stockAvailable: 550,
    tierPricing: [
      { minQty: 1, unitPrice: 240.00 },
      { minQty: 5, unitPrice: 215.00 },
      { minQty: 25, unitPrice: 188.00 }
    ],
    specs: {
      'Drawer Side Panel Thickness': '16mm - 19mm',
      'Load Capacity': '35kg (77lbs)',
      'Feature': 'Push-to-open or Soft-Close auto'
    },
    imageUrl: 'https://images.unsplash.com/photo-1517646287270-a5a9ca602e5c?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'prod-006',
    sku: 'BRK-CORNER-50',
    name: 'L-Shape Structural Corner Brace Bracket 50x50mm',
    category: 'Brackets & Connectors',
    subCategory: 'Corner Braces',
    description: 'Reinforced 90-degree heavy steel angle bracket with countersunk screw holes. Ideal for bed frames, dining table apron corners, and shelving.',
    material: 'Hardened Carbon Steel',
    intendedUse: 'Tables & Frames',
    sizeCategory: 'Medium (50-200mm)',
    finishOptions: ['Zinc Coated', 'Matte Black Anodized', 'Polished Brass'],
    dimensions: '50mm x 50mm x 20mm x 2.5mm Thickness',
    unitOfMeasure: 'Box of 100',
    baseUnitPrice: 42.00,
    weightKgPerUnit: 5.8,
    stockAvailable: 3100,
    tierPricing: [
      { minQty: 1, unitPrice: 42.00 },
      { minQty: 10, unitPrice: 34.00 },
      { minQty: 50, unitPrice: 26.00 }
    ],
    specs: {
      'Hole Diameter': '5.2mm (fits M5 or #10 screws)',
      'Tensile Yield': '240 MPa',
      'Design': 'Central Stiffening Rib'
    },
    imageUrl: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'prod-007',
    sku: 'BRK-TBL-TOP',
    name: 'Figure-8 Steel Table Top Fastener Expansion Brackets',
    category: 'Brackets & Connectors',
    subCategory: 'Table Connectors',
    description: 'Allows natural solid wood movement across seasonal temperature and humidity changes without table apron cracking or binding.',
    material: 'Cold-Rolled Steel',
    intendedUse: 'Tables & Frames',
    sizeCategory: 'Small (<50mm)',
    finishOptions: ['Zinc Coated', 'Raw Steel'],
    dimensions: '32mm Length x 18mm Width',
    unitOfMeasure: 'Box of 200',
    baseUnitPrice: 38.00,
    weightKgPerUnit: 3.2,
    stockAvailable: 1850,
    tierPricing: [
      { minQty: 1, unitPrice: 38.00 },
      { minQty: 10, unitPrice: 31.00 },
      { minQty: 50, unitPrice: 24.00 }
    ],
    specs: {
      'Screw Hole': '#8 Flat Head Screw',
      'Expansion Offset': 'Up to 3mm lateral movement',
      'Package': '200 pieces bulk pack'
    },
    imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'prod-008',
    sku: 'SCR-M4-POZI',
    name: 'Deep-Thread Pozi-Drive Cabinet Assembly Screws M4x30mm',
    category: 'Nails & Screws',
    subCategory: 'Furniture Screws',
    description: 'Hardened cabinet joinery screws featuring high-cut nibs under head for self-countersinking in MDF, particle board, and hardwoods.',
    material: 'Hardened Steel',
    intendedUse: 'Cabinetry & Casegoods',
    sizeCategory: 'Small (<50mm)',
    finishOptions: ['Zinc Coated', 'Yellow Zinc Passivated'],
    dimensions: 'M4 Diameter x 30mm Thread Length',
    unitOfMeasure: 'Box of 1000',
    baseUnitPrice: 28.00,
    weightKgPerUnit: 2.9,
    stockAvailable: 8500,
    tierPricing: [
      { minQty: 1, unitPrice: 28.00 },
      { minQty: 10, unitPrice: 22.00 },
      { minQty: 50, unitPrice: 17.50 },
      { minQty: 200, unitPrice: 14.00 }
    ],
    specs: {
      'Drive Type': 'PZ2 Pozi Recess',
      'Thread Type': 'Coarse Deep Cut Serrated Thread',
      'Head Type': 'Countersunk Flat Head with Nibs'
    },
    imageUrl: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'prod-009',
    sku: 'NAL-BRAD-18G',
    name: '18-Gauge Galvanized Pneumatic Brad Nails 30mm',
    category: 'Nails & Screws',
    subCategory: 'Pneumatic Framing Nails',
    description: 'Precision collated brad nails for trim molding, upholstery frames, drawer box face panels, and backboard attachment.',
    material: 'Galvanized Steel',
    intendedUse: 'Trim & Molding',
    sizeCategory: 'Small (<50mm)',
    finishOptions: ['Zinc Coated'],
    dimensions: '18 GA / 30mm (1-3/16 inch) Length',
    unitOfMeasure: 'Box of 5000',
    baseUnitPrice: 24.50,
    weightKgPerUnit: 2.1,
    stockAvailable: 9400,
    tierPricing: [
      { minQty: 1, unitPrice: 24.50 },
      { minQty: 10, unitPrice: 19.80 },
      { minQty: 50, unitPrice: 16.20 }
    ],
    specs: {
      'Compatible Tools': 'Standard 18GA Pneumatic Brad Nailers',
      'Collation Type': 'Straight Adhesive Strip',
      'Jam Rate': '<0.01%'
    },
    imageUrl: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'prod-010',
    sku: 'PIN-DOWEL-840',
    name: 'Spiral Fluted Hardwood Joinery Dowel Pins 8x40mm',
    category: 'Pins & Inserts',
    subCategory: 'Wood Dowel Pins',
    description: 'Kiln-dried beechwood dowel pins with chamfered ends and spiral multi-groove geometry for uniform glue distribution.',
    material: 'Beechwood',
    intendedUse: 'Flat-Pack Assembly',
    sizeCategory: 'Small (<50mm)',
    finishOptions: ['Natural Wood'],
    dimensions: '8mm Diameter x 40mm Length',
    unitOfMeasure: 'Bag of 500',
    baseUnitPrice: 18.50,
    weightKgPerUnit: 1.4,
    stockAvailable: 6200,
    tierPricing: [
      { minQty: 1, unitPrice: 18.50 },
      { minQty: 10, unitPrice: 14.80 },
      { minQty: 50, unitPrice: 11.90 }
    ],
    specs: {
      'Moisture Content': '6% - 8%',
      'Tolerance': '±0.1mm Precision Ground',
      'Application': 'Flat-Pack & Modular Casegoods'
    },
    imageUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'prod-011',
    sku: 'INS-THR-M615',
    name: 'Hex-Drive Threaded Inserts for Wood M6x15mm',
    category: 'Pins & Inserts',
    subCategory: 'Threaded Inserts',
    description: 'Flanged external thread insert with internal M6 metric threads. Creates durable reusable metal threads in solid wood and composite boards.',
    material: 'Zinc Alloy',
    intendedUse: 'Flat-Pack Assembly',
    sizeCategory: 'Small (<50mm)',
    finishOptions: ['Zinc Coated', 'Yellow Zinc Passivated'],
    dimensions: 'M6 Internal / 15mm Length / 12mm Outer Dia',
    unitOfMeasure: 'Box of 500',
    baseUnitPrice: 45.00,
    weightKgPerUnit: 2.8,
    stockAvailable: 4300,
    tierPricing: [
      { minQty: 1, unitPrice: 45.00 },
      { minQty: 10, unitPrice: 36.00 },
      { minQty: 50, unitPrice: 29.50 }
    ],
    specs: {
      'Internal Thread': 'M6 x 1.0 Pitch',
      'Installation Tool': '6mm Allen / Hex Key Drive',
      'Pull-Out Force': '3,200 N in Beechwood'
    },
    imageUrl: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'prod-012',
    sku: 'STR-CAM-LOCK',
    name: 'Cam Lock & Connecting Bolt Fittings Kit (15mm Cam)',
    category: 'Structural Fasteners',
    subCategory: 'Knock-Down Connectors',
    description: 'Essential 3-in-1 quick assembly hardware for flat-pack furniture manufacturing. Includes zinc alloy cams, steel connecting pins, and pre-inserted plastic dowels.',
    material: 'Zinc Alloy',
    intendedUse: 'Flat-Pack Assembly',
    sizeCategory: 'Small (<50mm)',
    finishOptions: ['Zinc Coated', 'Black Polymer Sleeve'],
    dimensions: '15mm Cam Height / 34mm Pin Length',
    unitOfMeasure: 'Kit of 250 Sets',
    baseUnitPrice: 62.00,
    weightKgPerUnit: 4.8,
    stockAvailable: 2900,
    tierPricing: [
      { minQty: 1, unitPrice: 62.00 },
      { minQty: 10, unitPrice: 51.00 },
      { minQty: 50, unitPrice: 42.00 }
    ],
    specs: {
      'Board Thickness': '15mm - 18mm',
      'Drive Type': 'Phillips / Flat Screwdriver Lock',
      'Includes': '250 Cams + 250 Connecting Bolts'
    },
    imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'prod-013',
    sku: 'STR-BED-RAIL',
    name: 'Heavy-Duty Hook-in Bed Rail Fitting Connectors',
    category: 'Structural Fasteners',
    subCategory: 'Bed Rail Hardware',
    description: 'Non-mortise or mortise heavy steel bracket system for solid wood bed frames and headboard side rail assembly.',
    material: 'Galvanized Steel',
    intendedUse: 'Tables & Frames',
    sizeCategory: 'Medium (50-200mm)',
    finishOptions: ['Zinc Coated', 'Yellow Zinc Passivated'],
    dimensions: '130mm Height x 30mm Flange Width',
    unitOfMeasure: 'Set of 4 Pairs (1 Bed Set)',
    baseUnitPrice: 32.00,
    weightKgPerUnit: 2.2,
    stockAvailable: 1100,
    tierPricing: [
      { minQty: 1, unitPrice: 32.00 },
      { minQty: 10, unitPrice: 26.50 },
      { minQty: 50, unitPrice: 21.00 }
    ],
    specs: {
      'Assembly Method': 'Hook and Lug Interlock',
      'Load Rating': '500kg Static Load',
      'Includes': 'Mounting Screws Set'
    },
    imageUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'prod-014',
    sku: 'STR-TNUT-M8',
    name: '4-Pronged Zinc Plated T-Nuts M8 for Wooden Frame Legs',
    category: 'Pins & Inserts',
    subCategory: 'T-Nuts',
    description: 'Pronged steel insert nuts that bite firmly into wood structure to receive sofa feet, table legs, and caster wheels.',
    material: 'Low Carbon Steel',
    intendedUse: 'Tables & Frames',
    sizeCategory: 'Small (<50mm)',
    finishOptions: ['Zinc Coated'],
    dimensions: 'M8 Internal Thread / 11mm Barrel Height',
    unitOfMeasure: 'Box of 1000',
    baseUnitPrice: 52.00,
    weightKgPerUnit: 5.1,
    stockAvailable: 3800,
    tierPricing: [
      { minQty: 1, unitPrice: 52.00 },
      { minQty: 10, unitPrice: 42.00 },
      { minQty: 50, unitPrice: 34.00 }
    ],
    specs: {
      'Flange Outer Dia': '22mm',
      'Prong Count': '4 Sharpened Steel Prongs',
      'Thread Class': '6H Metric'
    },
    imageUrl: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'prod-015',
    sku: 'ACC-LEG-M10',
    name: 'Adjustable Heavy-Duty Swivel Furniture Leveler Legs M10',
    category: 'Structural Fasteners',
    subCategory: 'Leveling Feet',
    description: 'Heavy duty swivel base leveling glide with non-marring nylon foot. Solves uneven flooring issues for heavy tables and cabinets.',
    material: 'Hardened Steel',
    intendedUse: 'Tables & Frames',
    sizeCategory: 'Medium (50-200mm)',
    finishOptions: ['Zinc Coated', 'Matte Black Anodized'],
    dimensions: 'M10 Thread x 50mm Stem / 40mm Base Dia',
    unitOfMeasure: 'Box of 100',
    baseUnitPrice: 88.00,
    weightKgPerUnit: 7.2,
    stockAvailable: 1450,
    tierPricing: [
      { minQty: 1, unitPrice: 88.00 },
      { minQty: 10, unitPrice: 74.00 },
      { minQty: 50, unitPrice: 61.00 }
    ],
    specs: {
      'Load Capacity': '150kg per foot',
      'Swivel Angle': '20 Degrees Articulation',
      'Base Protection': 'High Impact Floor Protector'
    },
    imageUrl: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=400&q=80'
  }
];
