File Structure:

./
```
└── .gitignore
└── README.md
├── app
│   ├── (app)
│   │   ├── jackpots
│   │   │   └── client.tsx
│   │   │   └── page.tsx
│   │   └── layout.tsx
│   │   ├── lobby
│   │   │   └── page.tsx
│   │   ├── profile
│   │   │   └── page.tsx
│   │   ├── settings
│   │   │   └── page.tsx
│   │   ├── support
│   │   │   └── page.tsx
│   ├── (landing)
│   │   └── layout.tsx
│   │   └── page.tsx
│   └── globals.css
│   └── layout.tsx
├── components
│   ├── layouts
│   │   └── AppLayout.tsx
│   ├── navigation
│   │   └── BottomNavigation.tsx
│   │   └── LeftSideBar.tsx
│   │   └── MainNavbar.tsx
│   ├── ui
│   │   └── avatar.tsx
│   │   └── badge.tsx
│   │   └── button.tsx
│   │   └── scroll-area.tsx
│   │   └── sheet.tsx
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
│   └── prisma.ts
│   └── utils.ts
└── package.json
├── scripts
│   └── claude.sh
└── tsconfig.json

```
