# FiReAd Design Guidelines

## Design Approach

**Hybrid System-Reference Approach**: Drawing from trusted fintech platforms (Stripe, Razorpay) combined with emergency alert systems (FEMA, weather apps) and Material Design principles. The design must convey urgency, trust, and clarity while remaining approachable for vulnerable populations with varying digital literacy.

## Core Design Elements

### A. Color Palette

**Primary Colors (Trust & Stability)**
- Primary Blue: 210 85% 45% - conveys trust, security, financial stability
- Deep Navy: 215 25% 20% - for headers, important text, grounding elements

**Alert System Colors (Severity-Based)**
- High Risk Red: 0 75% 50% - critical alerts, immediate action required
- Medium Risk Orange: 35 85% 55% - warnings, preparation needed  
- Low Risk Yellow: 45 90% 60% - advisory, monitoring status
- Safe Green: 145 65% 45% - protected status, successful actions

**Supporting Colors**
- Sky Blue: 200 75% 65% - weather visualization, water-related risks
- Warm Gray: 30 5% 45% - secondary text, borders
- Light background: 210 15% 97% - page backgrounds
- White: for cards, primary surfaces

### B. Typography

**Font Family**: Inter (primary), Noto Sans Devanagari (Hindi support)

**Scale & Hierarchy**
- Hero Headlines: text-5xl font-bold (emergency alerts, dashboard headers)
- Section Headers: text-3xl font-semibold 
- Card Titles: text-xl font-semibold
- Body Text: text-base font-normal leading-relaxed
- Alert Messages: text-lg font-medium (enhanced readability)
- Small Labels: text-sm font-medium
- Captions/Metadata: text-xs text-gray-500

### C. Layout System

**Spacing Primitives**: Use tailwind units of 2, 4, 6, 8, 12, 16, 20 for consistent rhythm
- Micro spacing: p-2, gap-2 (within components)
- Standard spacing: p-4, gap-4, m-6 (cards, lists)
- Section spacing: py-12, py-16 (between major sections)
- Large spacing: py-20 (hero sections, major separations)

**Grid System**
- Dashboard: 12-column grid with gap-6
- Cards: 2-column on tablet (md:grid-cols-2), 3-column on desktop (lg:grid-cols-3)
- Risk zones map: Full-width with overlay controls
- Mobile: Always single column with full-width cards

### D. Component Library

**Navigation**
- Top navbar with FiReAd logo, user location indicator, notification bell with badge count
- Mobile: Bottom navigation bar with Home, Alerts, Dashboard, Profile icons
- Admin sidebar with collapsible sections for different data views

**Alert Cards**
- Large prominent cards with colored left border (4px) indicating risk level
- Icon + Risk level badge + Location + Timestamp in header
- Weather condition details with icons (rain, wind, temperature)
- Expandable "Recommended Actions" section with checkboxes for user confirmation
- "View Details" and "Take Action" CTAs with appropriate urgency styling

**Risk Dashboard Widgets**
- Real-time weather map with risk zone overlays using color-coded regions
- Risk score gauge (circular progress indicator) with 0-100 scale
- Timeline chart showing 7-day risk forecast with gradient area fills
- Affected users counter with trending indicators
- Recent alerts feed with timestamp and status

**Financial Action Cards**
- Iconography for each action type (shield for insurance, lock for fund protection, pause for EMI)
- Clear before/after states showing simulated outcomes
- Status badges: "Recommended", "Triggered", "Completed", "Cancelled"
- Explanatory text in simple language with Hindi translations

**Forms & Inputs**
- Generous padding (p-4) with clear labels above inputs
- Location picker with map preview and autocomplete
- Financial profile inputs with helper text explaining why data is needed
- Language toggle switch (English/Hindi) prominent in header
- Large touch targets (min h-12) for mobile accessibility

**Data Visualization**
- Chart.js line charts for risk trends with gradient fills
- Bar charts comparing regions with color-coded severity
- Donut charts for user distribution by risk category
- Geographic heat maps with legend and zoom controls

**Admin Dashboard**
- KPI cards in 4-column grid showing: Total users, Active alerts, Protected families, Avg response time
- Filterable data table with location, risk level, action status columns
- Export functionality for reports
- Real-time update indicator with pulse animation

### E. Visual Patterns

**Cards & Surfaces**
- Elevated cards with shadow-md for primary content
- Rounded corners: rounded-lg for cards, rounded-xl for modals
- Border treatment: border border-gray-200 for subtle separation
- Hover states: slight scale transform (hover:scale-[1.02]) with shadow-lg

**Icons & Imagery**
- Weather icons: Line-style from Heroicons for consistency
- Risk indicators: Filled icons for high urgency, outline for informational
- Financial actions: Custom illustrative icons in brand colors
- Hero section: Large impactful image of resilient community or protective umbrella metaphor over family/farmland

**Responsive Behavior**
- Desktop (lg): Multi-column dashboards, side-by-side comparisons
- Tablet (md): 2-column grids, collapsible sidebar
- Mobile: Stacked layouts, bottom sheet modals, full-width alerts

**Images**
- Hero image: Hopeful imagery of families/farmers protected during weather events (warm, human-centric)
- Dashboard: Weather condition icons, location pins on maps
- About/How it Works: Illustrative diagrams showing data flow and protection process
- Testimonials: Real user photos (if available) or silhouettes with quotes

## Page-Specific Guidelines

**Landing Page**: Hero with impactful protective imagery + headline "Shield Your Future From Climate Risk" + CTA "Get Protected Now" | Trust indicators (users protected, alerts sent) | 3-column How It Works with icons | Risk map preview | 2-column Benefits for Families vs Businesses | Testimonials grid | Partner logos | Strong CTA section

**Dashboard**: Persistent header with location + current risk level | Priority alerts at top (full width if high risk) | 3-column KPI cards | Risk forecast chart (full width) | Recommended actions section | Recent activity feed

**Alerts Page**: Filter tabs (All, Active, Past, By Risk Level) | Alert cards in descending chronological order with clear visual hierarchy by urgency | Batch action controls | Archived alerts collapsible section

**User Profile**: Location settings with map | Financial profile form with privacy explanation | Notification preferences (SMS, WhatsApp, App) | Language selection | Connected accounts display

**Admin Dashboard**: Sidebar navigation | Full-width interactive risk map | Metrics grid | Data tables with sorting/filtering | Export and reporting tools | Real-time activity monitor