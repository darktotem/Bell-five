# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is enabled on this template. See [this documentation](https://react.dev/learn/react-compiler) for more information.

Note: This will impact Vite dev & build performances.
You can also try [the experimental native React Compiler support in plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md#rust-react-compiler) by using `compiler: true` in the plugin options instead of using the Babel plugin.

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])

```

You can also install [eslint-plugin-react-x](https://npmx.dev/package/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://npmx.dev/package/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])

```

# Bell 5 🔔💳

> **Asset-Backed Credit Scoring & Financial Identity Platform**  
> *Empowering underbanked individuals and gig workers with transparent, privacy-safe, alternative credit scoring.*

---

## 🚀 About The Project

Traditional credit bureaus rely heavily on rigid formal payslips and legacy banking histories, locking out millions of young professionals, gig workers, and informal traders. 

**Bell 5** bridges this gap by introducing an **Asset-Backed Credit Score (ranging from 300 to 850)** powered by alternative financial data:
* **Liquid Assets & Cash Flow:** M-Pesa wallets, bank histories, and digital transaction velocities.
* **Secured Investments:** Money Market Funds (MMFs), SACCO shares, and blue-chip equities.
* **Privacy-First Architecture:** Users share a unique **Bell 5 ID** (e.g., `B5-9081-2026`) with financial institutions to prove creditworthiness *without* exposing sensitive personal records like their National ID, KRA PIN, or raw bank balances.

---

## 🛠️ Tech Stack

* **Frontend Framework:** React + Vite (Single Page Application architecture)
* **Language:** TypeScript (Strict type safety across data structures and scoring models)
* **Styling:** Tailwind CSS (Modern, responsive dark-mode fintech interface)
* **Icons:** `lucide-react`

---

## 📂 Project Architecture

The codebase is organized into feature-driven domains to streamline team collaboration and prevent merge conflicts:

```text
bell5-app/
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
├── index.html
│
└── src/
    ├── main.tsx                   # React DOM Entrypoint
    ├── App.tsx                    # Route/View switcher & Auth Guard state
    ├── index.css                  # Global Tailwind styles
    │
    ├── types/                     # TypeScript interfaces (Prevents runtime bugs)
    │   ├── user.ts                # Profile, Bell 5 ID, Auth state
    │   ├── assets.ts              # AUM items, liquidity tiers, yields
    │   ├── credit.ts              # Score pillars, repayment histories
    │   └── budget.ts              # Budgeting goals & savings pools
    │
    ├── data/                      # Initial Mock Data (Typed)
    │   ├── mockUser.ts            # User details, phone, Bell 5 Credit ID
    │   ├── mockAssets.ts          # M-Pesa cash flow, MMFs, SACCO shares
    │   └── mockLoans.ts           # Credit history and repayment tracking
    │
    ├── utils/                     # Business & Calculation Engine
    │   ├── scoreCalculator.ts     # Frontend credit scoring algorithm
    │   ├── formatters.ts          # Currency (KES/USD) & Bell 5 ID formatting
    │   └── storage.ts             # LocalStorage helpers for persistence
    │
    ├── components/                # Shared UI Components
    │   ├── Navbar.tsx             # Top bar with Bell 5 ID badge & quick copy
    │   ├── Sidebar.tsx            # Navigation tabs switcher
    │   ├── ScoreGauge.tsx         # Animated 300–850 credit gauge meter
    │   └── StatCard.tsx           # Quick stat display (AUM, Cashflow, Score)
    │
    └── views/                     # Main Application Views / Tabs
        ├── AuthView.tsx           # Login / Account & Phone Number entry
        ├── DashboardView.tsx      # Minimalist overview (Bell 5 ID, Score, AUM)
        ├── LedgerView.tsx         # Comprehensive assets, graphs, cash flow
        ├── CreditProfileView.tsx  # Deep dive into scoring pillars & loan history
        ├── LiteracyHubView.tsx    # Financial education (Good vs Bad debt, MMFs)
        └── BudgetingView.tsx      # Savings planner & budgeting tools
```