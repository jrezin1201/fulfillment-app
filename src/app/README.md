# Dot Fulfillment - Kit Manufacturing & Fulfillment Management

A Next.js 15+ application for managing kit-based manufacturing and fulfillment, built with the **Vertical Slice Architecture**.

## 🎯 What This App Does

Manages the complete lifecycle of kit-based fulfillment projects:

1. **Component Library** - Track inventory, sourcing types, pricing, MOQ, lead times
2. **Kit Management** - Define kit types with Bills of Materials (BOMs)
3. **Project/Quote Creation** - Configure kits, quantities, and generate pricing
4. **Decision Tree Logic** - Handles complex sourcing decisions
5. **Pricing Engine** - Automatic cost calculations for quotes/SOWs

---

## 🚀 Quick Start

```bash
npm install
npm run dev
```

Visit `http://localhost:3000`

**The app works immediately** with localStorage (no database setup needed for demo).

---

## ✅ What's Working Now (No Database Required)

All pages are **fully functional** using localStorage:

### 1. Components Library (`/components-library`)
- Add/edit components with full details
- Track sourcing type, pricing, MOQ, lead times
- Mark at-risk components
- View stats and table of all components

### 2. Kit Management (`/kits`)
- Create kit types (Bulk Fit, DTC A1c, etc.)
- Configure distribution and fulfillment models
- Click kit to edit Bill of Materials
- Add components with quantities and buffer %

### 3. Projects (`/projects`)
- Create projects/quotes
- Add multiple kit types with quantities
- View pricing summaries
- All data persists between page reloads

---

## 📖 Usage Guide

### Step 1: Build Component Library
1. Go to `/components-library`
2. Click "+ New Component"
3. Fill in details:
   - Name: "Polymedco Blood Collection Tube"
   - Sourcing: Dot Sourced / Dot Manufactured / Customer Provided
   - Unit Cost, MOQ, Lead Time
4. Add more components (tubes, labels, packaging, etc.)

### Step 2: Define Kit Types
1. Go to `/kits`
2. Click "+ New Kit Type"
3. Create "Bulk Fit" or "DTC A1c"
4. Click the kit card to open BOM editor
5. Add components with quantities per kit
6. Set buffer % for scrap/overbuild

### Step 3: Create a Project
1. Go to `/projects`
2. Click "+ New Project"
3. Enter project name, customer, ship date
4. On project detail, add kit types
5. Configure quantities
6. View automatic pricing

---

## 🏗️ Architecture

Built with **Vertical Slice Architecture** - each feature is self-contained:

```
src/
├── app/
│   ├── components-library/  # Inventory management
│   ├── kits/[id]/           # BOM editor
│   ├── projects/[id]/       # Project configuration
│   └── api/                 # API routes (ready for DB)
├── lib/
│   ├── prisma.ts            # Database client
│   └── pricing.ts           # Pricing engine ⭐
└── config/
    └── site-config.ts       # Feature flags
```

---

## 💰 Pricing Engine (`src/lib/pricing.ts`)

Implements the SOW decision tree:

### The Logic:
```
1. Is component customer-provided?
   YES → Exclude from sourcing costs
         Include receiving/QA costs only
   NO  → Calculate with Dot sourcing

2. Calculate order quantity:
   (units per kit × total kits) + buffer %
   Check MOQ
   Optimize for print efficiency

3. Apply lead time & risk adjustments
```

### Functions Available:
- `calculateOrderQuantity()` - With buffer and MOQ optimization
- `calculateComponentCost()` - Per sourcing type
- `calculateProjectPricing()` - Full project totals
- `generateCustomerFurnishedClause()` - SOW text
- `generateDotSourcingClause()` - SOW text

---

## 🔌 Database (Optional)

The app works without a database, but API routes are ready:

### Available Endpoints:
- `POST/GET /api/components`
- `POST/GET /api/kits`
- `POST /api/bom-line-items`
- `POST/GET /api/projects`

### To Connect Database:

1. Set up PostgreSQL:
```bash
# Add to .env
DATABASE_URL="postgresql://..."

# Run migrations
npx prisma migrate dev
npx prisma generate
```

2. Replace `localStorage` with API calls in components

---

## 🎯 The Decision Tree (From SOW Requirements)

### Customer-Provided Components:
- ✅ Excluded from "Manufacture & Source" costs
- ✅ Include receiving, inspection, QA handling
- ✅ Flag dependency: "Production timeline dependent on delivery"
- ✅ Require delivery date in SOW

### Dot-Sourced Components:
- ✅ Calculate with unit cost
- ✅ Apply buffer for scrap/QA
- ✅ Check MOQ and optimize order quantities
- ✅ Track lead times and at-risk components

### Pricing Structure:
```
Manufacture & Source = Component costs (Dot-sourced only)
Assembly & Fulfillment = Kitting + QA + Packaging
Extended Kit Total = Per-kit × Quantity
Total Program Cost = Sum all kits
```

---

## 📊 Database Schema

**Core Models:**
- `Kit` - Kit types (Bulk Fit, DTC A1c, etc.)
- `Component` - Parts with sourcing, pricing, MOQ
- `BomLineItem` - Links components to kits
- `Project` - Quote/SOW projects
- `ProjectKit` - Links kits to projects with quantities

See `prisma/schema.prisma` for full schema.

---

## 🚧 Next Steps

To make production-ready:

1. **Connect Database** - Replace localStorage with fetch()
2. **Add Pricing Calculations** - Import functions from `pricing.ts`
3. **Build SOW Generator** - PDF export with pricing breakdown
4. **Add Authentication** - NextAuth.js (User model ready)
5. **Deploy** - Vercel + Neon PostgreSQL

---

## 🛠️ Tech Stack

- Next.js 15 (App Router)
- TypeScript (strict)
- Tailwind CSS
- Prisma + PostgreSQL
- Vertical Slice Architecture

---

## 📁 Key Files

| File | Purpose |
|------|---------|
| `CLAUDE.md` | Project documentation & memory |
| `src/lib/pricing.ts` | ⭐ Pricing calculation engine |
| `prisma/schema.prisma` | Database schema |
| `src/app/api/` | API routes (ready for DB) |

---

## 🎨 Features

- ✅ Component inventory with sourcing types
- ✅ Kit BOM management
- ✅ Multi-kit project configuration
- ✅ Decision tree pricing logic
- ✅ Customer-provided component handling
- ✅ MOQ and buffer calculations
- ✅ Lead time tracking
- ✅ Risk flags
- 🚧 SOW PDF generation (coming soon)
- 🚧 Authentication (schema ready)

---

**Built with ❤️ using Next.js 15 and Vertical Slice Architecture**
