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
│   │   └── layout.tsx
│   │   ├── support
│   │   │   └── page.tsx
│   ├── (info)
│   │   ├── i
│   │   │   ├── [slug]
│   │   │   │   └── page.tsx
│   │   │   ├── category
│   │   │   │   ├── [category]
│   │   │   │   │   └── page.tsx
│   │   │   ├── components
│   │   │   │   └── client.tsx
│   │   │   │   └── page.tsx
│   │   │   └── layout.tsx
│   │   │   └── page.tsx
│   │   │   ├── tag
│   │   │   │   ├── [tag]
│   │   │   │   │   └── page.tsx
│   │   └── layout.tsx
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
│   └── robots.ts
│   └── sitemap.ts
├── components
│   └── ThemeToggle.tsx
│   ├── auth
│   │   └── AuthModal.tsx
│   │   └── TelegramLoginWidget.tsx
│   ├── blog
│   │   └── BlogLayout.tsx
│   │   └── BlogLeftSideBar.tsx
│   │   └── BlogNavbar.tsx
│   ├── interactive
│   │   ├── common
│   │   │   └── InteractiveWrapper.tsx
│   │   │   └── SiteComparison.tsx
│   │   ├── odds
│   │   │   └── ImpliedProbability.tsx
│   │   │   └── JackpotWinProbability.tsx
│   │   │   └── OutcomePredictor.tsx
│   │   ├── stats
│   │   │   └── DrawCounter.tsx
│   │   │   └── DrawProbabilityCalculator.tsx
│   │   │   └── WinnersShowcase.tsx
│   │   ├── tools
│   │   │   └── FakeWinnerCard.tsx
│   │   │   └── JackpotBonusCalculator.tsx
│   │   │   └── MoneyPlanner.tsx
│   ├── landing
│   │   └── LandingCategoryCarousel.tsx
│   │   └── LandingToolCarousel.tsx
│   ├── layouts
│   │   └── AppLayout.tsx
│   ├── navigation
│   │   └── BottomNavigation.tsx
│   │   └── LeftSideBar.tsx
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
│   │   └── card.tsx
│   │   └── scroll-area.tsx
│   │   └── sheet.tsx
│   │   └── switch.tsx
│   │   └── tabs.tsx
│   │   └── tooltip.tsx
└── components.json
├── hooks
│   └── useMediaQuery.ts
├── lib
│   ├── auth
│   │   └── client.ts
│   │   └── nonce-store.ts
│   ├── mdx
│   │   └── component-map.ts
│   │   └── index.ts
│   │   └── index.ts.backup
│   └── prisma.ts
│   ├── stores
│   │   └── auth-modal-store.ts
│   │   └── picks-store.ts
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
