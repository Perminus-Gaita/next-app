File Structure:

./
```
└── .gitignore
└── README.md
├── app
│   ├── (app)
│   │   ├── auth
│   │   │   ├── [path]
│   │   │   │   └── page.tsx
│   │   │   ├── sign-in
│   │   │   │   └── page.tsx
│   │   ├── jackpots
│   │   │   └── client.tsx
│   │   │   └── page.tsx
│   │   └── layout.tsx
│   │   ├── nyumbani
│   │   │   └── client.jsx
│   │   │   ├── components
│   │   │   │   └── BellCurve.jsx
│   │   │   │   └── WinningPatternsStats.jsx
│   │   │   │   └── WinningPicksDistribution.jsx
│   │   │   ├── outcomes
│   │   │   │   └── page.jsx
│   │   │   └── page.jsx
│   │   │   ├── patterns
│   │   │   │   └── page.jsx
│   │   ├── profile
│   │   │   └── page.tsx
│   │   ├── settings
│   │   │   └── page.tsx
│   │   ├── strategies
│   │   │   └── client.tsx
│   │   │   ├── components
│   │   │   │   └── StrategyStudio.jsx
│   │   │   │   └── YourStrategies.jsx
│   │   │   └── page.tsx
│   │   ├── support
│   │   │   └── page.tsx
│   ├── (landing)
│   │   └── layout.tsx
│   │   └── page.tsx
│   ├── api
│   │   ├── auth
│   │   │   ├── [...path]
│   │   │   │   └── route.ts
│   │   │   ├── telegram
│   │   │   │   ├── callback
│   │   │   │   │   └── route.ts
│   └── globals.css
│   └── layout.tsx
├── components
│   ├── auth
│   │   └── AuthModal.tsx
│   │   └── TelegramLoginWidget.tsx
│   ├── layouts
│   │   └── AppLayout.tsx
│   ├── navigation
│   │   └── BottomNavigation.tsx
│   │   └── LeftSideBar.tsx
│   │   └── LeftSideBar.tsx.backup
│   │   └── MainNavbar.tsx
│   │   ├── chats
│   │   │   └── ChatsView.tsx
│   │   ├── main-navbar
│   │   │   └── index.tsx
│   │   │   ├── main-navbar-dropdown
│   │   │   │   └── index.tsx
│   ├── ui
│   │   └── avatar.tsx
│   │   └── badge.tsx
│   │   └── button.tsx
│   │   └── scroll-area.tsx
│   │   └── sheet.tsx
│   │   └── switch.tsx
│   │   └── tabs.tsx
│   │   └── tooltip.tsx
└── components.json
├── features
│   ├── jackpots
│   │   ├── components
│   │   │   └── JackpotDetails.tsx
│   │   │   ├── Tabs
│   │   │   │   ├── Comments
│   │   │   │   │   └── CommentItem.tsx
│   │   │   │   │   └── index.tsx
│   │   │   │   ├── Matches
│   │   │   │   │   └── MatchCard.tsx
│   │   │   │   │   └── index.tsx
│   │   │   │   ├── Predictions
│   │   │   │   │   └── PredictionItem.tsx
│   │   │   │   │   └── index.tsx
│   │   │   │   ├── Stats
│   │   │   │   │   └── BellCurve.tsx
│   │   │   │   │   └── index.tsx
│   │   │   └── TabsHeader.tsx
│   │   ├── types
│   │   │   └── index.ts
│   │   ├── utils
│   │   │   └── constants.ts
│   │   │   └── helpers.ts
│   └── placeholder
├── hooks
│   └── useMediaQuery.ts
├── lib
│   ├── auth
│   │   └── client.ts
│   │   └── nonce-store.ts
│   └── prisma.ts
│   ├── stores
│   │   └── auth-modal-store.ts
│   │   └── sidebar-store.tsx
│   └── utils.ts
└── package.json
├── prisma
│   ├── migrations
│   │   ├── 20260124111340_init
│   │   │   └── migration.sql
│   │   ├── 20260126085847_add_telegram_nonce
│   │   │   └── migration.sql
│   │   └── migration_lock.toml
│   └── schema.prisma
├── scripts
│   └── claude.sh
└── tsconfig.json

```
