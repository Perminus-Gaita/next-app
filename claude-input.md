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
│   │   ├── hooks
│   │   ├── types
│   │   │   └── index.ts
│   │   ├── utils
│   │   │   └── constants.ts
│   │   │   └── helpers.ts
│   └── placeholder
├── hooks
│   └── useMediaQuery.ts
├── lib
│   └── utils.ts
└── package.json
├── scripts
│   └── claude.sh
└── tsconfig.json

```

File Contents:

File: .gitignore
```
# See https://help.github.com/articles/ignoring-files/ for more about ignoring files.

# dependencies
/node_modules
/.pnp
.pnp.*
.yarn/*
!.yarn/patches
!.yarn/plugins
!.yarn/releases
!.yarn/versions

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*
.pnpm-debug.log*

# env files (can opt-in for committing if needed)
.env*

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts

```

File: app/(app)/jackpots/client.tsx
```tsx
"use client";import React,{useState}from "react";import{Loader2,AlertCircle,RefreshCw}from "lucide-react";import JackpotDetails from "@/features/jackpots/components/JackpotDetails";import TabsHeader from "@/features/jackpots/components/TabsHeader";import MatchesTab from "@/features/jackpots/components/Tabs/Matches";import PredictionsTab from "@/features/jackpots/components/Tabs/Predictions";import StatsTab from "@/features/jackpots/components/Tabs/Stats";import CommentsTab from "@/features/jackpots/components/Tabs/Comments";import type{Jackpot,Prediction,Comment,Statistics,TabType,LocalPicks,LocalPick}from "@/features/jackpots/types";const DUMMY_JACKPOT:Jackpot={_id:"jp001",jackpotHumanId:"12345",site:"SportPesa",totalPrizePool:250000000,currencySign:"KSH",jackpotStatus:"Open",isLatest:true,finished:new Date().toISOString(),bettingClosesAt:new Date(Date.now() + 86400000).toISOString(),events:[{eventNumber:1,competitorHome:"Arsenal",competitorAway:"Chelsea",odds:{home:2.1,draw:3.2,away:3.8},kickoffTime:new Date(Date.now() + 3600000).toISOString(),competition:"Premier League",},{eventNumber:2,competitorHome:"Manchester United",competitorAway:"Liverpool",odds:{home:2.5,draw:3.1,away:2.9},kickoffTime:new Date(Date.now() + 7200000).toISOString(),competition:"Premier League",},{eventNumber:3,competitorHome:"Barcelona",competitorAway:"Real Madrid",odds:{home:2.3,draw:3.0,away:3.2},kickoffTime:new Date(Date.now() + 10800000).toISOString(),competition:"La Liga",},{eventNumber:4,competitorHome:"Bayern Munich",competitorAway:"Borussia Dortmund",odds:{home:1.9,draw:3.5,away:4.2},kickoffTime:new Date(Date.now() + 14400000).toISOString(),competition:"Bundesliga",},{eventNumber:5,competitorHome:"Juventus",competitorAway:"AC Milan",odds:{home:2.2,draw:3.0,away:3.5},kickoffTime:new Date(Date.now() + 18000000).toISOString(),competition:"Serie A",},],prizes:[{jackpotType:"17/17",prize:150000000,winners:0},{jackpotType:"16/17",prize:50000000,winners:2},{jackpotType:"15/17",prize:25000000,winners:15},{jackpotType:"14/17",prize:10000000,winners:45},],};const DUMMY_PREDICTIONS:Prediction[]=[{_id:"pred1",jackpotId:"jp001",userId:"user1",username:"JohnDoe",picks:[{gameNumber:1,pick:"1"},{gameNumber:2,pick:"X"},{gameNumber:3,pick:"2"},{gameNumber:4,pick:"1"},{gameNumber:5,pick:"X"},],score:3,createdAt:new Date(Date.now() - 3600000).toISOString(),updatedAt:new Date(Date.now() - 3600000).toISOString(),},{_id:"pred2",jackpotId:"jp001",userId:"user2",username:"JaneSmith",picks:[{gameNumber:1,pick:"1"},{gameNumber:2,pick:"2"},{gameNumber:3,pick:"1"},{gameNumber:4,pick:"1"},{gameNumber:5,pick:"2"},],score:2,createdAt:new Date(Date.now() - 7200000).toISOString(),updatedAt:new Date(Date.now() - 7200000).toISOString(),},{_id:"pred3",jackpotId:"jp001",userId:"user3",username:"MikeJones",picks:[{gameNumber:1,pick:"X"},{gameNumber:2,pick:"1"},{gameNumber:3,pick:"2"},{gameNumber:4,pick:"2"},{gameNumber:5,pick:"1"},],score:4,createdAt:new Date(Date.now() - 10800000).toISOString(),updatedAt:new Date(Date.now() - 10800000).toISOString(),},];const DUMMY_COMMENTS:Comment[]=[{_id:"com1",jackpotId:"jp001",userId:"user1",username:"JohnDoe",text:"Arsenal are looking strong this season! Going with them.",createdAt:new Date(Date.now() - 1800000).toISOString(),updatedAt:new Date(Date.now() - 1800000).toISOString(),},{_id:"com2",jackpotId:"jp001",userId:"user3",username:"MikeJones",text:"The El Clasico will be a draw,I can feel it!",createdAt:new Date(Date.now() - 3600000).toISOString(),updatedAt:new Date(Date.now() - 3600000).toISOString(),},{_id:"com3",jackpotId:"jp001",userId:"user2",username:"JaneSmith",text:"Bayern are unstoppable at home. Easy win for them.",createdAt:new Date(Date.now() - 5400000).toISOString(),updatedAt:new Date(Date.now() - 5400000).toISOString(),},];const DUMMY_STATS:Statistics={homeWins:8,draws:4,awayWins:5,averageHomeOdds:2.1,averageDrawOdds:3.2,averageAwayOdds:3.4,totalMatches:17,};const JackpotSkeleton=()=> ( <div className="min-h-screen bg-background"> <div className="max-w-2xl mx-auto border-x border-border min-h-screen"> <div className="p-4 border-b border-border"> <div className="animate-pulse space-y-3"> <div className="h-6 bg-muted rounded w-1/3" /> <div className="h-8 bg-muted rounded w-2/3" /> <div className="flex gap-4 mt-4"> <div className="h-16 bg-muted rounded flex-1" /> <div className="h-16 bg-muted rounded flex-1" /> </div> </div> </div> <div className="flex border-b border-border">{[1,2,3,4].map((i)=> ( <div key={i}className="flex-1 py-4 flex justify-center"> <div className="h-4 bg-muted rounded w-16 animate-pulse" /> </div> ))}</div> <div className="p-4 space-y-3">{[1,2,3].map((i)=> ( <div key={i}className="h-32 bg-muted rounded-xl animate-pulse" /> ))}</div> </div> </div> );interface JackpotErrorProps{error:string | null;onRetry:()=> void;}const JackpotError:React.FC<JackpotErrorProps>=({error,onRetry})=> ( <div className="min-h-screen bg-background"> <div className="max-w-2xl mx-auto border-x border-border min-h-screen flex items-center justify-center p-8"> <div className="text-center"> <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" /> <h2 className="text-lg font-semibold text-foreground mb-2"> Failed to load jackpot </h2> <p className="text-sm text-muted-foreground mb-4">{error || "Something went wrong. Please try again."}</p> <button onClick={onRetry}className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors" > <RefreshCw className="w-4 h-4" /> Try Again </button> </div> </div> </div> );interface JackpotTrackerProps{jackpotId?:string;}export default function JackpotTracker({jackpotId="latest"}:JackpotTrackerProps){const [activeTab,setActiveTab]=useState<TabType>("matches");const [localPicks,setLocalPicks]=useState<LocalPicks>({});const [predictions,setPredictions]=useState<Prediction[]>(DUMMY_PREDICTIONS);const [comments,setComments]=useState<Comment[]>(DUMMY_COMMENTS);const jackpot=DUMMY_JACKPOT;const stats=DUMMY_STATS;const loading=false;const error=null;const userPicks:LocalPicks={...localPicks};const handlePickSelect=(eventNumber:number,pick:LocalPick)=>{setLocalPicks((prev)=> ({...prev,[eventNumber]:pick,}));};const handleSavePrediction=()=>{console.log("Saving prediction:",localPicks);alert("Prediction saved! (This is dummy data)");setLocalPicks({});};const handleAddComment=(text:string)=>{const newComment:Comment={_id:"12345678",jackpotId:jackpot._id,userId:"currentUser",username:"You",text,createdAt:new Date().toISOString(),updatedAt:new Date().toISOString(),};setComments([newComment,...comments]);};const handleDeleteComment=(commentId:string)=>{setComments(comments.filter((c)=> c._id !==commentId));};const hasUnsavedPicks=Object.keys(localPicks).length > 0;if (loading){return <JackpotSkeleton />;}if (error || !jackpot){return <JackpotError error={error}onRetry={()=> window.location.reload()}/>;}return ( <div className="min-h-screen bg-background"> <div className="max-w-2xl mx-auto border-x border-border min-h-screen"> <JackpotDetails jackpot={jackpot}/> <TabsHeader activeTab={activeTab}setActiveTab={setActiveTab}/> <div className="animate-in fade-in duration-200">{activeTab==="matches" && ( <MatchesTab events={jackpot.events}predictions={userPicks}onSelect={handlePickSelect}hasUnsavedPicks={hasUnsavedPicks}onSavePrediction={handleSavePrediction}isSaving={false}jackpotStatus={jackpot.jackpotStatus}/> )}{activeTab==="predictions" && ( <PredictionsTab predictions={predictions}jackpot={jackpot}loading={false}/> )}{activeTab==="stats" && ( <StatsTab jackpot={jackpot}communityPredictions={predictions}stats={stats}loading={false}/> )}{activeTab==="comments" && ( <CommentsTab comments={comments}loading={false}submitting={false}onAddComment={handleAddComment}onDeleteComment={handleDeleteComment}currentUserId="currentUser" /> )}</div> </div> </div> );}
```

File: app/(app)/jackpots/page.tsx
```tsx
import{Metadata}from 'next';import Client from './client';export const metadata:Metadata={title:"Wufwuf Jackpot Tracker",description:"Track SportPesa Mega Jackpot results,view match outcomes,share predictions with the community,and analyze winning patterns. Free jackpot tracker for Kenya!",keywords:[ "sportpesa jackpot","mega jackpot results","jackpot predictions","sportpesa results","kenya jackpot","jackpot tracker","betting tips kenya","sportpesa mega jackpot","jackpot analysis","football predictions kenya","midweek jackpot","jackpot winners",],openGraph:{title:"SportPesa Jackpot Tracker:Results,Predictions & Analysis | Wufwuf",description:"Never miss a jackpot result! Track SportPesa Mega Jackpot matches,share your predictions,see community picks,and analyze winning patterns on Wufwuf.",type:"website",url:"https:images:[{url:"https:}],siteName:"Wufwuf",},twitter:{card:"summary_large_image",title:"SportPesa Jackpot Tracker:Live Results & Predictions",description:"Track Mega Jackpot results,share predictions & compete with the community! 🎯 #SportPesa #Jackpot #Kenya #BettingTips #Wufwuf",creator:"@Wufwuf",images:["https:},alternates:{canonical:"https:},robots:{index:true,follow:true,nocache:true,googleBot:{index:true,follow:true,"max-video-preview":-1,'max-image-preview':"large",'max-snippet':-1,},},};export default function JackpotsPage(){return <Client />;}
```

File: app/(app)/layout.tsx
```tsx
import{ReactNode}from "react";import AppLayout from "@/components/layouts/AppLayout";interface AppLayoutWrapperProps{children:ReactNode;}export default function AppLayoutWrapper({children}:AppLayoutWrapperProps){return <AppLayout>{children}</AppLayout>;}
```

File: app/(app)/lobby/page.tsx
```tsx
export default function LobbyPage(){return ( <div> <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4"> Lobby </h1> <p className="text-gray-600 dark:text-gray-400"> Welcome to the lobby! This is where your main content goes. </p> </div> );}
```

File: app/(app)/profile/page.tsx
```tsx
export default function ProfilePage(){return ( <div> <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4"> Profile </h1> <p className="text-gray-600 dark:text-gray-400"> Manage your profile settings and information here. </p> </div> );}
```

File: app/(app)/settings/page.tsx
```tsx
export default function SettingsPage(){return ( <div> <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4"> Settings </h1> <p className="text-gray-600 dark:text-gray-400"> Configure your application settings here. </p> </div> );}
```

File: app/(app)/support/page.tsx
```tsx
export default function SupportPage(){return ( <div> <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4"> Support </h1> <p className="text-gray-600 dark:text-gray-400"> Get help and support for using the application. </p> </div> );}
```

File: app/(landing)/layout.tsx
```tsx
import{ReactNode}from "react";import AppLayout from "@/components/layouts/AppLayout";interface AppLayoutWrapperProps{children:ReactNode;}export default function AppLayoutWrapper({children}:AppLayoutWrapperProps){return <AppLayout>{children}</AppLayout>;}
```

File: app/(landing)/page.tsx
```tsx
import Link from "next/link";export default function LandingPage(){return ( <div className="flex items-center justify-center min-h-screen"> <div className="text-center"> <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4"> Welcome to My App </h1> <p className="text-gray-600 dark:text-gray-400 mb-8"> Your app is ready to build! </p> <Link href="/lobby" className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors" > Get Started </Link> </div> </div> );}
```

File: app/globals.css
```css
@import "tailwindcss";@import "tw-animate-css";@custom-variant dark (&:is(.dark *));@theme inline{--color-background:var(--background);--color-foreground:var(--foreground);--font-sans:var(--font-geist-sans);--font-mono:var(--font-geist-mono);--color-sidebar-ring:var(--sidebar-ring);--color-sidebar-border:var(--sidebar-border);--color-sidebar-accent-foreground:var(--sidebar-accent-foreground);--color-sidebar-accent:var(--sidebar-accent);--color-sidebar-primary-foreground:var(--sidebar-primary-foreground);--color-sidebar-primary:var(--sidebar-primary);--color-sidebar-foreground:var(--sidebar-foreground);--color-sidebar:var(--sidebar);--color-chart-5:var(--chart-5);--color-chart-4:var(--chart-4);--color-chart-3:var(--chart-3);--color-chart-2:var(--chart-2);--color-chart-1:var(--chart-1);--color-ring:var(--ring);--color-input:var(--input);--color-border:var(--border);--color-destructive:var(--destructive);--color-accent-foreground:var(--accent-foreground);--color-accent:var(--accent);--color-muted-foreground:var(--muted-foreground);--color-muted:var(--muted);--color-secondary-foreground:var(--secondary-foreground);--color-secondary:var(--secondary);--color-primary-foreground:var(--primary-foreground);--color-primary:var(--primary);--color-popover-foreground:var(--popover-foreground);--color-popover:var(--popover);--color-card-foreground:var(--card-foreground);--color-card:var(--card);--radius-sm:calc(var(--radius) - 4px);--radius-md:calc(var(--radius) - 2px);--radius-lg:var(--radius);--radius-xl:calc(var(--radius) + 4px);--radius-2xl:calc(var(--radius) + 8px);--radius-3xl:calc(var(--radius) + 12px);--radius-4xl:calc(var(--radius) + 16px);}:root{--radius:0.625rem;--background:oklch(1 0 0);--foreground:oklch(0.129 0.042 264.695);--card:oklch(1 0 0);--card-foreground:oklch(0.129 0.042 264.695);--popover:oklch(1 0 0);--popover-foreground:oklch(0.129 0.042 264.695);--primary:oklch(0.208 0.042 265.755);--primary-foreground:oklch(0.984 0.003 247.858);--secondary:oklch(0.968 0.007 247.896);--secondary-foreground:oklch(0.208 0.042 265.755);--muted:oklch(0.968 0.007 247.896);--muted-foreground:oklch(0.554 0.046 257.417);--accent:oklch(0.968 0.007 247.896);--accent-foreground:oklch(0.208 0.042 265.755);--destructive:oklch(0.577 0.245 27.325);--border:oklch(0.929 0.013 255.508);--input:oklch(0.929 0.013 255.508);--ring:oklch(0.704 0.04 256.788);--chart-1:oklch(0.646 0.222 41.116);--chart-2:oklch(0.6 0.118 184.704);--chart-3:oklch(0.398 0.07 227.392);--chart-4:oklch(0.828 0.189 84.429);--chart-5:oklch(0.769 0.188 70.08);--sidebar:oklch(0.984 0.003 247.858);--sidebar-foreground:oklch(0.129 0.042 264.695);--sidebar-primary:oklch(0.208 0.042 265.755);--sidebar-primary-foreground:oklch(0.984 0.003 247.858);--sidebar-accent:oklch(0.968 0.007 247.896);--sidebar-accent-foreground:oklch(0.208 0.042 265.755);--sidebar-border:oklch(0.929 0.013 255.508);--sidebar-ring:oklch(0.704 0.04 256.788);}.dark{--background:oklch(0.129 0.042 264.695);--foreground:oklch(0.984 0.003 247.858);--card:oklch(0.208 0.042 265.755);--card-foreground:oklch(0.984 0.003 247.858);--popover:oklch(0.208 0.042 265.755);--popover-foreground:oklch(0.984 0.003 247.858);--primary:oklch(0.929 0.013 255.508);--primary-foreground:oklch(0.208 0.042 265.755);--secondary:oklch(0.279 0.041 260.031);--secondary-foreground:oklch(0.984 0.003 247.858);--muted:oklch(0.279 0.041 260.031);--muted-foreground:oklch(0.704 0.04 256.788);--accent:oklch(0.279 0.041 260.031);--accent-foreground:oklch(0.984 0.003 247.858);--destructive:oklch(0.704 0.191 22.216);--border:oklch(1 0 0 / 10%);--input:oklch(1 0 0 / 15%);--ring:oklch(0.551 0.027 264.364);--chart-1:oklch(0.488 0.243 264.376);--chart-2:oklch(0.696 0.17 162.48);--chart-3:oklch(0.769 0.188 70.08);--chart-4:oklch(0.627 0.265 303.9);--chart-5:oklch(0.645 0.246 16.439);--sidebar:oklch(0.208 0.042 265.755);--sidebar-foreground:oklch(0.984 0.003 247.858);--sidebar-primary:oklch(0.488 0.243 264.376);--sidebar-primary-foreground:oklch(0.984 0.003 247.858);--sidebar-accent:oklch(0.279 0.041 260.031);--sidebar-accent-foreground:oklch(0.984 0.003 247.858);--sidebar-border:oklch(1 0 0 / 10%);--sidebar-ring:oklch(0.551 0.027 264.364);}@layer base{*{@apply border-border outline-ring/50;}body{@apply bg-background text-foreground;}}
```

File: app/layout.tsx
```tsx
import{ReactNode}from "react";import type{Metadata,Viewport}from "next";import "./globals.css";export const metadata:Metadata={title:"My App",description:"Welcome to my application",};export const viewport:Viewport={width:"device-width",initialScale:1,};interface RootLayoutProps{children:ReactNode;}export default function RootLayout({children}:RootLayoutProps){return ( <html lang="en"> <body className="bg-white dark:bg-gray-900"> <main className="min-h-screen">{children}</main> </body> </html> );}
```

File: components.json
```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "",
    "css": "app/globals.css",
    "baseColor": "slate",
    "cssVariables": true,
    "prefix": ""
  },
  "iconLibrary": "lucide",
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  },
  "registries": {}
}

```

File: components/layouts/AppLayout.tsx
```tsx
"use client";import{useRef,useState,useEffect,ReactNode}from "react";import{useMediaQuery}from "@/hooks/useMediaQuery";import LeftSideBar from "@/components/navigation/LeftSideBar";import MainNavbar from "@/components/navigation/MainNavbar";import BottomNavigation from "@/components/navigation/BottomNavigation";interface SidebarStyles{sidebar:string;content:string;}interface DeviceWidths{open:SidebarStyles;closed:SidebarStyles;}interface SidebarWidths{desktop:DeviceWidths;tablet:DeviceWidths;mobile:DeviceWidths;}const SIDEBAR_WIDTHS:SidebarWidths={desktop:{open:{sidebar:"w-60",content:"ml-60"},closed:{sidebar:"w-16",content:"ml-16"},},tablet:{open:{sidebar:"w-72",content:"ml-0"},closed:{sidebar:"w-0",content:"ml-0"},},mobile:{open:{sidebar:"w-[65%]",content:"ml-0"},closed:{sidebar:"w-0",content:"ml-0"},},};interface AppLayoutProps{children:ReactNode;}export default function AppLayout({children}:AppLayoutProps){const isMobile=useMediaQuery('(max-width:639px)');const isTablet=useMediaQuery('(min-width:640px) and (max-width:1023px)');const [openLeftSidebar,setOpenLeftSidebar]=useState<boolean>(true);const sidebarRef=useRef<HTMLElement>(null);useEffect(()=>{const isDarkMode=localStorage.getItem("theme")==="dark" || (!("theme" in localStorage) && window.matchMedia("(prefers-color-scheme:dark)").matches);document.documentElement.classList.toggle("dark",isDarkMode);},[]);useEffect(()=>{if (!isMobile && !isTablet) return;const handleClickOutside=(event:MouseEvent)=>{if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)){setOpenLeftSidebar(false);}};document.addEventListener("mousedown",handleClickOutside);return ()=> document.removeEventListener("mousedown",handleClickOutside);},[isMobile,isTablet]);const getSidebarStyles=():SidebarStyles=>{const deviceType:keyof SidebarWidths=isMobile ? "mobile":isTablet ? "tablet":"desktop";const state:keyof DeviceWidths=openLeftSidebar ? "open":"closed";return SIDEBAR_WIDTHS[deviceType][state];};return ( <div className="min-h-screen bg-white dark:bg-gray-900"> <MainNavbar openLeftSidebar={openLeftSidebar}onToggleSidebar={()=> setOpenLeftSidebar(!openLeftSidebar)}/> <div className="flex relative">{}{openLeftSidebar && (isMobile || isTablet) && ( <div className="fixed inset-0 bg-black/50 z-20" onClick={()=> setOpenLeftSidebar(false)}/> )}{}<aside ref={sidebarRef}className={` fixed top-12 left-0 h-[calc(100vh-3rem)] z-30 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 transition-all duration-300 ease-in-out ${!openLeftSidebar && (isMobile || isTablet) ? "-translate-x-full":"translate-x-0"}${getSidebarStyles().sidebar}${isMobile || isTablet ? "shadow-xl":""}`}> <LeftSideBar openLeftSidebar={openLeftSidebar}onClose={()=> setOpenLeftSidebar(false)}/> </aside>{}<main className={` flex-1 pt-20 px-4 pb-20 md:pb-4 min-h-screen transition-all duration-300 ${getSidebarStyles().content}`}>{children}</main> </div> <BottomNavigation openLeftSidebar={openLeftSidebar}onToggleSidebar={()=> setOpenLeftSidebar(!openLeftSidebar)}/> </div> );}
```

File: components/navigation/BottomNavigation.tsx
```tsx
"use client";import Link from "next/link";import{usePathname}from "next/navigation";import{Home,User,Menu}from "lucide-react";interface BottomNavigationProps{openLeftSidebar:boolean;onToggleSidebar:()=> void;}export default function BottomNavigation({openLeftSidebar,onToggleSidebar}:BottomNavigationProps){const pathname=usePathname();return ( <div className="fixed bottom-0 left-0 right-0 h-16 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 flex items-center justify-around md:hidden z-10"> <Link href="/lobby" className={`flex flex-col items-center justify-center w-1/3 ${pathname==="/lobby" ? "text-blue-600":"text-gray-600 dark:text-gray-400"}`}> <Home className="h-5 w-5" /> <span className="text-xs mt-1">Lobby</span> </Link> <Link href="/profile" className={`flex flex-col items-center justify-center w-1/3 ${pathname==="/profile" ? "text-blue-600":"text-gray-600 dark:text-gray-400"}`}> <User className="h-5 w-5" /> <span className="text-xs mt-1">Profile</span> </Link> <button onClick={onToggleSidebar}className={`flex flex-col items-center justify-center w-1/3 ${openLeftSidebar ? "text-blue-600":"text-gray-600 dark:text-gray-400"}`}> <Menu className="h-5 w-5" /> <span className="text-xs mt-1">More</span> </button> </div> );}
```

File: components/navigation/LeftSideBar.tsx
```tsx
"use client";import Link from "next/link";import{usePathname}from "next/navigation";import{useMediaQuery}from "@/hooks/useMediaQuery";import{cn}from "@/lib/utils";import{Home,User,Settings,Headset,LucideIcon}from "lucide-react";interface NavItemType{href:string;icon:LucideIcon;label:string;}interface NavItemProps{item:NavItemType;isActive:boolean;openLeftSidebar:boolean;onClose:()=> void;}const NavItem=({item,isActive,openLeftSidebar,onClose}:NavItemProps)=>{const isMobile=useMediaQuery('(max-width:639px)');const isTablet=useMediaQuery('(min-width:640px) and (max-width:1023px)');const Icon=item.icon;const handleClick=()=>{if ((isMobile || isTablet) && onClose){onClose();}};return ( <Link href={item.href}onClick={handleClick}className={cn( "flex items-center px-3 h-12 text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800",isActive ? "bg-gray-100 dark:bg-gray-800 text-blue-600":"text-gray-700 dark:text-gray-300",openLeftSidebar ? "justify-start":"justify-center" )}> <Icon className="h-5 w-5" />{openLeftSidebar && <span className="ml-3">{item.label}</span>}</Link> );};interface LeftSideBarProps{openLeftSidebar:boolean;onClose:()=> void;}export default function LeftSideBar({openLeftSidebar,onClose}:LeftSideBarProps){const pathname=usePathname();const topNavItems:NavItemType[]=[{href:"/lobby",icon:Home,label:"Lobby"},{href:"/profile",icon:User,label:"Profile"},];const bottomNavItems:NavItemType[]=[{href:"/support",icon:Headset,label:"Support"},{href:"/settings",icon:Settings,label:"Settings"},];return ( <aside className="h-full overflow-y-auto"> <div className="flex flex-col h-full">{}<div className="flex-1 py-4">{topNavItems.map((item,index)=> ( <NavItem key={index}item={item}isActive={pathname===item.href}openLeftSidebar={openLeftSidebar}onClose={onClose}/> ))}</div>{}<div className="py-4 border-t border-gray-200 dark:border-gray-800">{bottomNavItems.map((item,index)=> ( <NavItem key={index}item={item}isActive={pathname===item.href}openLeftSidebar={openLeftSidebar}onClose={onClose}/> ))}</div> </div> </aside> );}
```

File: components/navigation/MainNavbar.tsx
```tsx
"use client";import Link from "next/link";import Image from "next/image";import{useMediaQuery}from "@/hooks/useMediaQuery";import{Menu,X,Sun,Moon}from "lucide-react";import{Button}from "@/components/ui/button";import{useState,useEffect}from "react";interface MainNavbarProps{openLeftSidebar:boolean;onToggleSidebar:()=> void;}type Theme="light" | "dark";export default function MainNavbar({openLeftSidebar,onToggleSidebar}:MainNavbarProps){const isMobile=useMediaQuery('(max-width:639px)');const [theme,setTheme]=useState<Theme>("light");useEffect(()=>{const savedTheme=(localStorage.getItem("theme") as Theme) || "light";setTheme(savedTheme);},[]);const toggleTheme=()=>{const newTheme:Theme=theme==="light" ? "dark":"light";setTheme(newTheme);localStorage.setItem("theme",newTheme);document.documentElement.classList.toggle("dark",newTheme==="dark");};return ( <header className="fixed top-0 w-full h-12 flex items-center justify-between px-4 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 z-50"> <div className="flex items-center gap-4"> <Button variant="ghost" size="icon" onClick={onToggleSidebar}className="h-8 w-8" >{openLeftSidebar ? <X className="h-5 w-5" />:<Menu className="h-5 w-5" />}</Button>{!isMobile && ( <Link href="/"> <Image src="/logo.png" alt="Logo" width={32}height={32}/> </Link> )}</div> <h1 className="text-sm font-semibold">My App</h1> <Button variant="ghost" size="icon" onClick={toggleTheme}className="h-8 w-8">{theme==="light" ? <Moon className="h-4 w-4" />:<Sun className="h-4 w-4" />}</Button> </header> );}
```

File: components/ui/avatar.tsx
```tsx
"use client" import * as React from "react" import * as AvatarPrimitive from "@radix-ui/react-avatar" import{cn}from "@/lib/utils" function Avatar({className,...props}:React.ComponentProps<typeof AvatarPrimitive.Root>){return ( <AvatarPrimitive.Root data-slot="avatar" className={cn( "relative flex size-8 shrink-0 overflow-hidden rounded-full",className )}{...props}/> )}function AvatarImage({className,...props}:React.ComponentProps<typeof AvatarPrimitive.Image>){return ( <AvatarPrimitive.Image data-slot="avatar-image" className={cn("aspect-square size-full",className)}{...props}/> )}function AvatarFallback({className,...props}:React.ComponentProps<typeof AvatarPrimitive.Fallback>){return ( <AvatarPrimitive.Fallback data-slot="avatar-fallback" className={cn( "bg-muted flex size-full items-center justify-center rounded-full",className )}{...props}/> )}export{Avatar,AvatarImage,AvatarFallback}
```

File: components/ui/badge.tsx
```tsx
import * as React from "react" import{Slot}from "@radix-ui/react-slot" import{cva,type VariantProps}from "class-variance-authority" import{cn}from "@/lib/utils" const badgeVariants=cva( "inline-flex items-center justify-center rounded-full border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",{variants:{variant:{default:"border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90",secondary:"border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",destructive:"border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",outline:"text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",},},defaultVariants:{variant:"default",},}) function Badge({className,variant,asChild=false,...props}:React.ComponentProps<"span"> & VariantProps<typeof badgeVariants> &{asChild?:boolean}){const Comp=asChild ? Slot:"span" return ( <Comp data-slot="badge" className={cn(badgeVariants({variant}),className)}{...props}/> )}export{Badge,badgeVariants}
```

File: components/ui/button.tsx
```tsx
import * as React from "react" import{Slot}from "@radix-ui/react-slot" import{cva,type VariantProps}from "class-variance-authority" import{cn}from "@/lib/utils" const buttonVariants=cva( "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",{variants:{variant:{default:"bg-primary text-primary-foreground hover:bg-primary/90",destructive:"bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",outline:"border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",secondary:"bg-secondary text-secondary-foreground hover:bg-secondary/80",ghost:"hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",link:"text-primary underline-offset-4 hover:underline",},size:{default:"h-9 px-4 py-2 has-[>svg]:px-3",sm:"h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",lg:"h-10 rounded-md px-6 has-[>svg]:px-4",icon:"size-9","icon-sm":"size-8","icon-lg":"size-10",},},defaultVariants:{variant:"default",size:"default",},}) function Button({className,variant="default",size="default",asChild=false,...props}:React.ComponentProps<"button"> & VariantProps<typeof buttonVariants> &{asChild?:boolean}){const Comp=asChild ? Slot:"button" return ( <Comp data-slot="button" data-variant={variant}data-size={size}className={cn(buttonVariants({variant,size,className}))}{...props}/> )}export{Button,buttonVariants}
```

File: components/ui/scroll-area.tsx
```tsx
"use client" import * as React from "react" import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area" import{cn}from "@/lib/utils" function ScrollArea({className,children,...props}:React.ComponentProps<typeof ScrollAreaPrimitive.Root>){return ( <ScrollAreaPrimitive.Root data-slot="scroll-area" className={cn("relative",className)}{...props}> <ScrollAreaPrimitive.Viewport data-slot="scroll-area-viewport" className="focus-visible:ring-ring/50 size-full rounded-[inherit] transition-[color,box-shadow] outline-none focus-visible:ring-[3px] focus-visible:outline-1" >{children}</ScrollAreaPrimitive.Viewport> <ScrollBar /> <ScrollAreaPrimitive.Corner /> </ScrollAreaPrimitive.Root> )}function ScrollBar({className,orientation="vertical",...props}:React.ComponentProps<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>){return ( <ScrollAreaPrimitive.ScrollAreaScrollbar data-slot="scroll-area-scrollbar" orientation={orientation}className={cn( "flex touch-none p-px transition-colors select-none",orientation==="vertical" && "h-full w-2.5 border-l border-l-transparent",orientation==="horizontal" && "h-2.5 flex-col border-t border-t-transparent",className )}{...props}> <ScrollAreaPrimitive.ScrollAreaThumb data-slot="scroll-area-thumb" className="bg-border relative flex-1 rounded-full" /> </ScrollAreaPrimitive.ScrollAreaScrollbar> )}export{ScrollArea,ScrollBar}
```

File: components/ui/sheet.tsx
```tsx
"use client" import * as React from "react" import * as SheetPrimitive from "@radix-ui/react-dialog" import{XIcon}from "lucide-react" import{cn}from "@/lib/utils" function Sheet({...props}:React.ComponentProps<typeof SheetPrimitive.Root>){return <SheetPrimitive.Root data-slot="sheet"{...props}/>}function SheetTrigger({...props}:React.ComponentProps<typeof SheetPrimitive.Trigger>){return <SheetPrimitive.Trigger data-slot="sheet-trigger"{...props}/>}function SheetClose({...props}:React.ComponentProps<typeof SheetPrimitive.Close>){return <SheetPrimitive.Close data-slot="sheet-close"{...props}/>}function SheetPortal({...props}:React.ComponentProps<typeof SheetPrimitive.Portal>){return <SheetPrimitive.Portal data-slot="sheet-portal"{...props}/>}function SheetOverlay({className,...props}:React.ComponentProps<typeof SheetPrimitive.Overlay>){return ( <SheetPrimitive.Overlay data-slot="sheet-overlay" className={cn( "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50",className )}{...props}/> )}function SheetContent({className,children,side="right",...props}:React.ComponentProps<typeof SheetPrimitive.Content> &{side?:"top" | "right" | "bottom" | "left"}){return ( <SheetPortal> <SheetOverlay /> <SheetPrimitive.Content data-slot="sheet-content" className={cn( "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out fixed z-50 flex flex-col gap-4 shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500",side==="right" && "data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm",side==="left" && "data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm",side==="top" && "data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top inset-x-0 top-0 h-auto border-b",side==="bottom" && "data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom inset-x-0 bottom-0 h-auto border-t",className )}{...props}>{children}<SheetPrimitive.Close className="ring-offset-background focus:ring-ring data-[state=open]:bg-secondary absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none"> <XIcon className="size-4" /> <span className="sr-only">Close</span> </SheetPrimitive.Close> </SheetPrimitive.Content> </SheetPortal> )}function SheetHeader({className,...props}:React.ComponentProps<"div">){return ( <div data-slot="sheet-header" className={cn("flex flex-col gap-1.5 p-4",className)}{...props}/> )}function SheetFooter({className,...props}:React.ComponentProps<"div">){return ( <div data-slot="sheet-footer" className={cn("mt-auto flex flex-col gap-2 p-4",className)}{...props}/> )}function SheetTitle({className,...props}:React.ComponentProps<typeof SheetPrimitive.Title>){return ( <SheetPrimitive.Title data-slot="sheet-title" className={cn("text-foreground font-semibold",className)}{...props}/> )}function SheetDescription({className,...props}:React.ComponentProps<typeof SheetPrimitive.Description>){return ( <SheetPrimitive.Description data-slot="sheet-description" className={cn("text-muted-foreground text-sm",className)}{...props}/> )}export{Sheet,SheetTrigger,SheetClose,SheetContent,SheetHeader,SheetFooter,SheetTitle,SheetDescription,}
```

File: components/ui/tooltip.tsx
```tsx
"use client" import * as React from "react" import * as TooltipPrimitive from "@radix-ui/react-tooltip" import{cn}from "@/lib/utils" function TooltipProvider({delayDuration=0,...props}:React.ComponentProps<typeof TooltipPrimitive.Provider>){return ( <TooltipPrimitive.Provider data-slot="tooltip-provider" delayDuration={delayDuration}{...props}/> )}function Tooltip({...props}:React.ComponentProps<typeof TooltipPrimitive.Root>){return ( <TooltipProvider> <TooltipPrimitive.Root data-slot="tooltip"{...props}/> </TooltipProvider> )}function TooltipTrigger({...props}:React.ComponentProps<typeof TooltipPrimitive.Trigger>){return <TooltipPrimitive.Trigger data-slot="tooltip-trigger"{...props}/>}function TooltipContent({className,sideOffset=0,children,...props}:React.ComponentProps<typeof TooltipPrimitive.Content>){return ( <TooltipPrimitive.Portal> <TooltipPrimitive.Content data-slot="tooltip-content" sideOffset={sideOffset}className={cn( "bg-foreground text-background animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-fit origin-(--radix-tooltip-content-transform-origin) rounded-md px-3 py-1.5 text-xs text-balance",className )}{...props}>{children}<TooltipPrimitive.Arrow className="bg-foreground fill-foreground z-50 size-2.5 translate-y-[calc(-50%_-_2px)] rotate-45 rounded-[2px]" /> </TooltipPrimitive.Content> </TooltipPrimitive.Portal> )}export{Tooltip,TooltipTrigger,TooltipContent,TooltipProvider}
```

File: features/jackpots/components/JackpotDetails.tsx
```tsx
"use client";import React from 'react';import{formatDate}from '../utils/helpers';import type{Jackpot}from '../types';interface JackpotDetailsProps{jackpot:Jackpot;}const JackpotDetails:React.FC<JackpotDetailsProps>=({jackpot})=>{const isOpen=jackpot.jackpotStatus==='Open';const formatFullAmount=(amount:number)=>{return new Intl.NumberFormat('en-KE').format(Math.round(amount));};return ( <div className="p-4 border-b border-border"> <div className="text-xs text-muted-foreground mb-3 text-center"> Jackpot #{jackpot.jackpotHumanId}•{formatDate(jackpot.finished)}</div> <div className="bg-gradient-to-br from-green-500/15 to-green-600/5 border border-green-500/30 rounded-xl p-6 text-center"> <div className="text-sm text-green-500/80 font-medium mb-2">{jackpot.site}MEGA Jackpot Pro{jackpot.events.length}</div> <div className="text-2xl md:text-3xl font-bold text-green-500">{jackpot.currencySign}{formatFullAmount(jackpot.totalPrizePool)}</div> </div> <div className="flex items-center justify-center gap-2 flex-wrap mt-3"> <span className={`px-3 py-1 rounded text-xs font-semibold ${isOpen ? 'bg-green-500/20 text-green-500':'bg-muted text-muted-foreground'}`}>{jackpot.jackpotStatus.toUpperCase()}</span>{jackpot.isLatest && ( <span className="bg-primary/20 text-primary px-3 py-1 rounded text-xs font-semibold"> LATEST </span> )}</div> </div> );};export default JackpotDetails;
```

File: features/jackpots/components/Tabs/Comments/CommentItem.tsx
```tsx
"use client";import React from 'react';import{Trash2}from 'lucide-react';import type{Comment}from '../../../types';interface CommentItemProps{comment:Comment;onDelete?:(commentId:string)=> void;canDelete?:boolean;}const CommentItem:React.FC<CommentItemProps>=({comment,onDelete,canDelete=false,})=>{const formatTime=(dateString:string)=>{const date=new Date(dateString);const now=new Date();const diffInMs=now.getTime() - date.getTime();const diffInMinutes=Math.floor(diffInMs / (1000 * 60));const diffInHours=Math.floor(diffInMs / (1000 * 60 * 60));const diffInDays=Math.floor(diffInMs / (1000 * 60 * 60 * 24));if (diffInMinutes < 1) return 'Just now';if (diffInMinutes < 60) return `${diffInMinutes}m ago`;if (diffInHours < 24) return `${diffInHours}h ago`;if (diffInDays < 7) return `${diffInDays}d ago`;return date.toLocaleDateString();};return ( <div className="bg-card border border-border rounded-xl p-4"> <div className="flex items-start justify-between gap-3"> <div className="flex items-start gap-3 flex-1"> <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0"> <span className="text-sm font-bold text-primary">{comment.username?.[0]?.toUpperCase() || 'U'}</span> </div> <div className="flex-1 min-w-0"> <div className="flex items-center gap-2 mb-1"> <span className="text-sm font-semibold text-foreground">{comment.username || 'Anonymous'}</span> <span className="text-xs text-muted-foreground">{formatTime(comment.createdAt)}</span> </div> <p className="text-sm text-foreground whitespace-pre-wrap break-words">{comment.text}</p> </div> </div>{canDelete && onDelete && ( <button onClick={()=> onDelete(comment._id)}className="text-muted-foreground hover:text-red-500 transition-colors p-1" aria-label="Delete comment" > <Trash2 className="w-4 h-4" /> </button> )}</div> </div> );};export default CommentItem;
```

File: features/jackpots/components/Tabs/Comments/index.tsx
```tsx
"use client";import React,{useState}from 'react';import{Loader2,Send}from 'lucide-react';import CommentItem from './CommentItem';import type{Comment}from '../../../types';import{MAX_COMMENT_LENGTH}from '../../../utils/constants';interface CommentsTabProps{comments:Comment[];loading?:boolean;submitting?:boolean;onAddComment?:(text:string)=> void;onDeleteComment?:(commentId:string)=> void;currentUserId?:string;}const CommentsTab:React.FC<CommentsTabProps>=({comments,loading=false,submitting=false,onAddComment,onDeleteComment,currentUserId,})=>{const [commentText,setCommentText]=useState('');const handleSubmit=(e:React.FormEvent)=>{e.preventDefault();if (commentText.trim() && onAddComment){onAddComment(commentText.trim());setCommentText('');}};const canDelete=(comment:Comment):boolean=>{return Boolean(currentUserId && comment.userId===currentUserId);};return ( <div className="p-4 space-y-4">{onAddComment && ( <form onSubmit={handleSubmit}className="bg-card border border-border rounded-xl p-4"> <textarea value={commentText}onChange={(e)=> setCommentText(e.target.value.slice(0,MAX_COMMENT_LENGTH))}placeholder="Share your thoughts..." className="w-full bg-background border border-border rounded-lg p-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none" rows={3}maxLength={MAX_COMMENT_LENGTH}disabled={submitting}/> <div className="flex items-center justify-between mt-2"> <span className="text-xs text-muted-foreground">{commentText.length}/{MAX_COMMENT_LENGTH}</span> <button type="submit" disabled={!commentText.trim() || submitting}className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" >{submitting ? ( <> <Loader2 className="w-4 h-4 animate-spin" /> Posting... </> ):( <> <Send className="w-4 h-4" /> Post </> )}</button> </div> </form> )}{loading ? ( <div className="flex items-center justify-center p-12"> <Loader2 className="w-8 h-8 animate-spin text-primary" /> </div> ):comments.length===0 ? ( <div className="flex flex-col items-center justify-center p-12 text-center"> <div className="text-muted-foreground mb-2">No comments yet</div> <div className="text-sm text-muted-foreground"> Be the first to share your thoughts! </div> </div> ):( <div className="space-y-3"> <div className="text-sm text-muted-foreground mb-2">{comments.length}{comments.length===1 ? 'comment':'comments'}</div>{comments.map((comment)=> ( <CommentItem key={comment._id}comment={comment}onDelete={onDeleteComment}canDelete={canDelete(comment)}/> ))}</div> )}</div> );};export default CommentsTab;
```

File: features/jackpots/components/Tabs/Matches/index.tsx
```tsx
"use client";import React from 'react';import{Loader2}from 'lucide-react';import MatchCard from './MatchCard';import type{JackpotEvent,LocalPicks,LocalPick}from '../../../types';interface MatchesTabProps{events:JackpotEvent[];predictions?:LocalPicks;onSelect?:(eventNumber:number,pick:LocalPick)=> void;hasUnsavedPicks?:boolean;onSavePrediction?:()=> void;isSaving?:boolean;jackpotStatus?:string;}const MatchesTab:React.FC<MatchesTabProps>=({events,predictions={},onSelect,hasUnsavedPicks=false,onSavePrediction,isSaving=false,jackpotStatus='Open',})=>{const isFinished=jackpotStatus==='Finished' || jackpotStatus==='Closed';return ( <div className="p-4 space-y-4">{hasUnsavedPicks && !isFinished && ( <div className="sticky top-16 z-10 bg-background/95 backdrop-blur-sm p-3 rounded-xl border border-border shadow-lg"> <button onClick={onSavePrediction}disabled={isSaving}className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors disabled:opacity-50" >{isSaving ? ( <> <Loader2 className="w-4 h-4 animate-spin" /> Saving... </> ):( 'Save Prediction' )}</button> </div> )}{events.map((event)=> ( <MatchCard key={event.eventNumber}event={event}prediction={predictions[event.eventNumber]}onSelect={onSelect}isFinished={isFinished}/> ))}</div> );};export default MatchesTab;
```

File: features/jackpots/components/Tabs/Matches/MatchCard.tsx
```tsx
"use client";import React from 'react';import type{JackpotEvent,LocalPick}from '../../../types';interface MatchCardProps{event:JackpotEvent;prediction?:LocalPick;onSelect?:(eventNumber:number,pick:LocalPick)=> void;isFinished?:boolean;}const MatchCard:React.FC<MatchCardProps>=({event,prediction,onSelect,isFinished=false,})=>{const getButtonStyle=(pick:LocalPick)=>{const isSelected=prediction===pick;const baseStyle="flex flex-col items-center justify-center p-2 rounded-lg transition-all";if (isFinished){if (event.result){const resultMap:Record<'1' | 'X' | '2',LocalPick>={'1':'Home','X':'Draw','2':'Away'};const correctPick=resultMap[event.result];if (pick===correctPick){return `${baseStyle}bg-green-500/20 border-2 border-green-500 text-green-500`;}}return `${baseStyle}bg-muted/50 text-muted-foreground cursor-not-allowed`;}if (isSelected){return `${baseStyle}bg-primary text-primary-foreground border-2 border-primary`;}return `${baseStyle}bg-muted hover:bg-muted/70 text-foreground border-2 border-transparent`;};return ( <div className="bg-card border border-border rounded-xl p-4"> <div className="flex items-center justify-between mb-3"> <span className="bg-primary/15 text-primary px-2 py-1 rounded text-xs font-semibold"> #{event.eventNumber}</span> <span className="text-xs text-muted-foreground">{event.competition}</span> </div> <div className="mb-4"> <div className="text-sm font-semibold text-foreground mb-1">{event.competitorHome}</div> <div className="text-xs text-muted-foreground mb-1">vs</div> <div className="text-sm font-semibold text-foreground">{event.competitorAway}</div> </div>{isFinished && event.score && ( <div className="mb-3 text-center"> <div className="text-xs text-muted-foreground mb-1">Final Score</div> <div className="text-lg font-bold text-primary">{event.score.home}-{event.score.away}</div> </div> )}<div className="grid grid-cols-3 gap-2">{(['Home','Draw','Away'] as LocalPick[]).map((pick)=>{const odds=event.odds[pick.toLowerCase() as keyof typeof event.odds] || '-';return ( <button key={pick}onClick={()=> !isFinished && onSelect?.(event.eventNumber,pick)}disabled={isFinished}className={getButtonStyle(pick)}> <span className="text-xs font-medium uppercase opacity-70">{pick==='Home' ? '1':pick==='Draw' ? 'X':'2'}</span> <span className="text-base font-bold">{odds}</span> </button> );})}</div> <div className="mt-3 text-xs text-muted-foreground text-center">{new Date(event.kickoffTime).toLocaleString()}</div> </div> );};export default MatchCard;
```

File: features/jackpots/components/Tabs/Predictions/index.tsx
```tsx
"use client";import React from 'react';import{Loader2}from 'lucide-react';import PredictionItem from './PredictionItem';import type{Prediction,Jackpot}from '../../../types';interface PredictionsTabProps{predictions:Prediction[];jackpot:Jackpot;loading?:boolean;}const PredictionsTab:React.FC<PredictionsTabProps>=({predictions,jackpot,loading=false,})=>{if (loading){return ( <div className="flex items-center justify-center p-12"> <Loader2 className="w-8 h-8 animate-spin text-primary" /> </div> );}if (predictions.length===0){return ( <div className="flex flex-col items-center justify-center p-12 text-center"> <div className="text-muted-foreground mb-2">No predictions yet</div> <div className="text-sm text-muted-foreground"> Be the first to make a prediction! </div> </div> );}return ( <div className="p-4 space-y-4"> <div className="text-sm text-muted-foreground mb-2">{predictions.length}{predictions.length===1 ? 'prediction':'predictions'}</div>{predictions.map((prediction)=> ( <PredictionItem key={prediction._id}prediction={prediction}events={jackpot.events}/> ))}</div> );};export default PredictionsTab;
```

File: features/jackpots/components/Tabs/Predictions/PredictionItem.tsx
```tsx
"use client";import React from 'react';import{Trophy}from 'lucide-react';import type{Prediction,JackpotEvent}from '../../../types';interface PredictionItemProps{prediction:Prediction;events:JackpotEvent[];}const PredictionItem:React.FC<PredictionItemProps>=({prediction,events})=>{const calculateScore=()=>{if (!prediction.picks) return 0;let correct=0;prediction.picks.forEach((pick)=>{const event=events.find(e=> e.eventNumber===pick.gameNumber);if (event?.result===pick.pick){correct++;}});return correct;};const score=prediction.score ?? calculateScore();const totalMatches=events.length;return ( <div className="bg-card border border-border rounded-xl p-4"> <div className="flex items-center justify-between mb-3"> <div className="flex items-center gap-2"> <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center"> <span className="text-sm font-bold text-primary">{prediction.username?.[0]?.toUpperCase() || 'U'}</span> </div> <div> <div className="text-sm font-semibold text-foreground">{prediction.username || 'Anonymous'}</div> <div className="text-xs text-muted-foreground">{new Date(prediction.createdAt).toLocaleDateString()}</div> </div> </div> <div className="text-right"> <div className="flex items-center gap-1 text-primary"> <Trophy className="w-4 h-4" /> <span className="text-lg font-bold">{score}/{totalMatches}</span> </div> <div className="text-xs text-muted-foreground">Correct</div> </div> </div> <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">{prediction.picks.map((pick)=>{const event=events.find(e=> e.eventNumber===pick.gameNumber);const isCorrect=event?.result===pick.pick;const hasResult=!!event?.result;return ( <div key={pick.gameNumber}className={`text-center p-2 rounded-lg ${hasResult ? isCorrect ? 'bg-green-500/20 border border-green-500/30 text-green-500':'bg-red-500/20 border border-red-500/30 text-red-500':'bg-muted/50 border border-border text-muted-foreground'}`}> <div className="text-xs opacity-70">#{pick.gameNumber}</div> <div className="text-sm font-bold">{pick.pick}</div> </div> );})}</div> </div> );};export default PredictionItem;
```

File: features/jackpots/components/Tabs/Stats/BellCurve.tsx
```tsx
"use client";import React from 'react';import type{Statistics}from '../../../types';interface BellCurveProps{stats:Statistics;}const BellCurve:React.FC<BellCurveProps>=({stats})=>{const total=stats.homeWins + stats.draws + stats.awayWins;const homePercent=(stats.homeWins / total) * 100;const drawPercent=(stats.draws / total) * 100;const awayPercent=(stats.awayWins / total) * 100;return ( <div className="space-y-3"> <div> <div className="flex justify-between text-xs mb-1"> <span className="text-green-500 font-medium">Home Wins</span> <span className="text-foreground font-bold">{stats.homeWins}({homePercent.toFixed(1)}%)</span> </div> <div className="h-8 bg-muted rounded-lg overflow-hidden"> <div className="h-full bg-green-500 transition-all duration-500" style={{width:`${homePercent}%`}}/> </div> </div> <div> <div className="flex justify-between text-xs mb-1"> <span className="text-yellow-500 font-medium">Draws</span> <span className="text-foreground font-bold">{stats.draws}({drawPercent.toFixed(1)}%)</span> </div> <div className="h-8 bg-muted rounded-lg overflow-hidden"> <div className="h-full bg-yellow-500 transition-all duration-500" style={{width:`${drawPercent}%`}}/> </div> </div> <div> <div className="flex justify-between text-xs mb-1"> <span className="text-blue-500 font-medium">Away Wins</span> <span className="text-foreground font-bold">{stats.awayWins}({awayPercent.toFixed(1)}%)</span> </div> <div className="h-8 bg-muted rounded-lg overflow-hidden"> <div className="h-full bg-blue-500 transition-all duration-500" style={{width:`${awayPercent}%`}}/> </div> </div> <div className="pt-3 border-t border-border"> <div className="grid grid-cols-3 gap-2 text-center text-xs"> <div> <div className="text-muted-foreground">Avg Home</div> <div className="font-bold text-foreground">{stats.averageHomeOdds.toFixed(2)}</div> </div> <div> <div className="text-muted-foreground">Avg Draw</div> <div className="font-bold text-foreground">{stats.averageDrawOdds.toFixed(2)}</div> </div> <div> <div className="text-muted-foreground">Avg Away</div> <div className="font-bold text-foreground">{stats.averageAwayOdds.toFixed(2)}</div> </div> </div> </div> </div> );};export default BellCurve;
```

File: features/jackpots/components/Tabs/Stats/index.tsx
```tsx
"use client";import React from 'react';import{Loader2,TrendingUp,Trophy}from 'lucide-react';import BellCurve from './BellCurve';import type{Jackpot,Prediction,Statistics}from '../../../types';import{formatCurrency}from '../../../utils/helpers';interface StatsTabProps{jackpot:Jackpot;communityPredictions:Prediction[];stats?:Statistics | null;loading?:boolean;}const StatsTab:React.FC<StatsTabProps>=({jackpot,communityPredictions,stats,loading=false,})=>{if (loading){return ( <div className="flex items-center justify-center p-12"> <Loader2 className="w-8 h-8 animate-spin text-primary" /> </div> );}return ( <div className="p-4 space-y-4">{stats && ( <div className="bg-card border border-border rounded-xl p-4"> <div className="flex items-center gap-2 mb-4"> <TrendingUp className="w-5 h-5 text-primary" /> <h3 className="font-semibold text-foreground">Outcome Distribution</h3> </div> <BellCurve stats={stats}/> </div> )}<div className="bg-card border border-border rounded-xl p-4"> <div className="flex items-center gap-2 mb-4"> <Trophy className="w-5 h-5 text-primary" /> <h3 className="font-semibold text-foreground">Prize Breakdown</h3> </div> <div className="space-y-3">{jackpot.prizes.map((prize)=>{const isGrand=prize.jackpotType==='17/17';return ( <div key={prize.jackpotType}className={`rounded-lg p-3 ${isGrand ? 'bg-gradient-to-r from-yellow-500/20 to-yellow-600/10 border border-yellow-500/30':'bg-muted/50'}`}> <div className="flex justify-between items-center"> <div> <div className={`text-xs font-medium mb-0.5 ${isGrand ? 'text-yellow-500':'text-muted-foreground'}`}>{isGrand ? '🏆 GRAND JACKPOT':`${prize.jackpotType}Correct`}</div> <div className={`text-base font-bold ${isGrand ? 'text-yellow-500':'text-foreground'}`}> KSH{formatCurrency(prize.prize)}</div> </div> <div className={`px-3 py-1.5 rounded-lg text-center ${isGrand ? 'bg-yellow-500/20':'bg-background'}`}> <div className={`text-base font-bold ${isGrand ? 'text-yellow-500':'text-foreground'}`}>{prize.winners}</div> <div className={`text-[10px] ${isGrand ? 'text-yellow-500/70':'text-muted-foreground'}`}>{prize.winners===1 ? 'Winner':'Winners'}</div> </div> </div> </div> );})}</div> </div> <div className="grid grid-cols-2 gap-3"> <div className="bg-card border border-border rounded-xl p-4 text-center"> <div className="text-2xl font-bold text-foreground">{jackpot.events.length}</div> <div className="text-xs text-muted-foreground mt-1">Total Matches</div> </div> <div className="bg-card border border-border rounded-xl p-4 text-center"> <div className="text-2xl font-bold text-foreground">{communityPredictions.length}</div> <div className="text-xs text-muted-foreground mt-1">Predictions</div> </div> </div> </div> );};export default StatsTab;
```

File: features/jackpots/components/TabsHeader.tsx
```tsx
"use client";import React from 'react';import type{TabType}from '../types';interface TabsHeaderProps{activeTab:TabType;setActiveTab:(tab:TabType)=> void;}const TabsHeader:React.FC<TabsHeaderProps>=({activeTab,setActiveTab})=>{const tabs:{id:TabType;label:string}[]=[{id:'matches',label:'Matches'},{id:'predictions',label:'Predictions'},{id:'stats',label:'Stats'},{id:'comments',label:'Comments'}];return ( <div className="flex border-b border-border bg-card sticky top-0 z-10">{tabs.map(tab=> ( <button key={tab.id}onClick={()=> setActiveTab(tab.id)}className={`flex-1 py-4 text-sm font-medium transition-colors relative \${activeTab===tab.id ? 'text-foreground':'text-muted-foreground hover:text-foreground'}`}>{tab.label}{activeTab===tab.id && ( <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-14 h-1 bg-primary rounded-t-full" /> )}</button> ))}</div> );};export default TabsHeader;
```

File: features/jackpots/types/index.ts
```ts
export interface JackpotEvent{eventNumber:number;competitorHome:string;competitorAway:string;odds:{home:number;draw:number;away:number};result?:'1' | 'X' | '2';score?:{home:number;away:number};kickoffTime:string;competition:string;}export interface JackpotPrize{jackpotType:string;prize:number;winners:number;}export interface Jackpot{_id:string;jackpotHumanId:string;site:string;totalPrizePool:number;currencySign:string;jackpotStatus:'Open' | 'Closed' | 'Finished';isLatest:boolean;finished:string;bettingClosesAt:string;events:JackpotEvent[];prizes:JackpotPrize[];}export interface PredictionPick{gameNumber:number;pick:'1' | 'X' | '2';}export interface Prediction{_id:string;jackpotId:string;userId:string;username?:string;picks:PredictionPick[];score?:number;createdAt:string;updatedAt:string;}export interface Comment{_id:string;jackpotId:string;userId:string;username?:string;text:string;createdAt:string;updatedAt:string;}export interface Statistics{homeWins:number;draws:number;awayWins:number;averageHomeOdds:number;averageDrawOdds:number;averageAwayOdds:number;totalMatches:number;}export type LocalPick='Home' | 'Draw' | 'Away';export interface LocalPicks{[eventNumber:number]:LocalPick;}export type TabType='matches' | 'predictions' | 'stats' | 'comments';
```

File: features/jackpots/utils/constants.ts
```ts
import type{TabType}from '../types';export const TABS:{id:TabType;label:string}[]=[{id:'matches',label:'Matches'},{id:'predictions',label:'Predictions'},{id:'stats',label:'Stats'},{id:'comments',label:'Comments'},];export const MAX_COMMENT_LENGTH=500;
```

File: features/jackpots/utils/helpers.ts
```ts
import type{Jackpot}from '../types';export function formatDate(dateString:string):string{const date=new Date(dateString);const now=new Date();const diffInMs=now.getTime() - date.getTime();const diffInDays=Math.floor(diffInMs / (1000 * 60 * 60 * 24));if (diffInDays===0) return "Today";if (diffInDays===1) return "Yesterday";if (diffInDays < 7) return `${diffInDays}days ago`;return date.toLocaleDateString('en-US',{month:'short',day:'numeric',year:date.getFullYear() !==now.getFullYear() ? 'numeric':undefined,});}export function formatCurrency(amount:number):string{return new Intl.NumberFormat('en-KE').format(Math.round(amount));}
```

File: features/placeholder
```

```

File: hooks/useMediaQuery.ts
```ts
import{useState,useEffect}from 'react';export function useMediaQuery(query:string):boolean{const [matches,setMatches]=useState<boolean>(false);useEffect(()=>{const media=window.matchMedia(query);setMatches(media.matches);const listener=()=> setMatches(media.matches);media.addEventListener('change',listener);return ()=> media.removeEventListener('change',listener);},[query]);return matches;}
```

File: lib/utils.ts
```ts
import{clsx,type ClassValue}from "clsx" import{twMerge}from "tailwind-merge" export function cn(...inputs:ClassValue[]){return twMerge(clsx(inputs))}
```

File: package.json
```json
{
  "name": "my-app",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint"
  },
  "dependencies": {
    "@radix-ui/react-avatar": "^1.1.11",
    "@radix-ui/react-dialog": "^1.1.15",
    "@radix-ui/react-scroll-area": "^1.2.10",
    "@radix-ui/react-slot": "^1.2.4",
    "@radix-ui/react-tooltip": "^1.2.8",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "lucide-react": "^0.563.0",
    "next": "16.1.4",
    "react": "19.2.3",
    "react-dom": "19.2.3",
    "tailwind-merge": "^3.4.0",
    "zustand": "^5.0.10"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "autoprefixer": "^10.4.23",
    "eslint": "^9",
    "eslint-config-next": "16.1.4",
    "postcss": "^8.5.6",
    "tailwindcss": "^4",
    "tw-animate-css": "^1.4.0",
    "typescript": "^5"
  }
}

```

File: README.md
```md
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

```

File: scripts/claude.sh
```sh
#!/bin/bash

# Navigate to project root (adjust if needed)
cd "$(dirname "$0")"

echo "🚀 Creating TypeScript files for features/jackpots..."

# ============================================
# types/index.ts
# ============================================
cat > features/jackpots/types/index.ts << 'EOF'
// Jackpot Types
export interface JackpotEvent {
  eventNumber: number;
  competitorHome: string;
  competitorAway: string;
  odds: {
    home: number;
    draw: number;
    away: number;
  };
  result?: '1' | 'X' | '2';
  score?: {
    home: number;
    away: number;
  };
  kickoffTime: string;
  competition: string;
}

export interface JackpotPrize {
  jackpotType: string;
  prize: number;
  winners: number;
}

export interface Jackpot {
  _id: string;
  jackpotHumanId: string;
  site: string;
  totalPrizePool: number;
  currencySign: string;
  jackpotStatus: 'Open' | 'Closed' | 'Finished';
  isLatest: boolean;
  finished: string;
  bettingClosesAt: string;
  events: JackpotEvent[];
  prizes: JackpotPrize[];
}

// Prediction Types
export interface PredictionPick {
  gameNumber: number;
  pick: '1' | 'X' | '2';
}

export interface Prediction {
  _id: string;
  jackpotId: string;
  userId: string;
  username?: string;
  picks: PredictionPick[];
  score?: number;
  createdAt: string;
  updatedAt: string;
}

// Comment Types
export interface Comment {
  _id: string;
  jackpotId: string;
  userId: string;
  username?: string;
  text: string;
  createdAt: string;
  updatedAt: string;
}

// Statistics Types
export interface Statistics {
  homeWins: number;
  draws: number;
  awayWins: number;
  averageHomeOdds: number;
  averageDrawOdds: number;
  averageAwayOdds: number;
  totalMatches: number;
}

// Local Pick Type (for UI state)
export type LocalPick = 'Home' | 'Draw' | 'Away';

export interface LocalPicks {
  [eventNumber: number]: LocalPick;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ApiError {
  success: false;
  message: string;
  error?: string;
}

// Hook Return Types
export interface UseJackpotDetailsReturn {
  data: Jackpot | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export interface UsePredictionsReturn {
  predictions: Prediction[];
  userPrediction: Prediction | null;
  loading: boolean;
  error: string | null;
  submitting: boolean;
  createPrediction: (picks: PredictionPick[]) => Promise<Prediction | null>;
  updatePrediction: (predictionId: string, picks: PredictionPick[]) => Promise<Prediction | null>;
  deletePrediction: (predictionId: string) => Promise<boolean>;
}

export interface UseCommentsReturn {
  comments: Comment[];
  loading: boolean;
  error: string | null;
  submitting: boolean;
  createComment: (text: string) => Promise<Comment | null>;
  deleteComment: (commentId: string) => Promise<boolean>;
  refetch: () => Promise<void>;
}

export interface UseStatisticsReturn {
  stats: Statistics | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

// Tab Types
export type TabType = 'matches' | 'predictions' | 'stats' | 'comments';

// SEO Types
export interface JackpotJsonLd {
  '@context': string;
  '@type': string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  offers?: {
    '@type': string;
    price: string;
    priceCurrency: string;
  };
}
EOF

echo "✅ Created types/index.ts"

# ============================================
# utils/helpers.ts
# ============================================
cat > features/jackpots/utils/helpers.ts << 'EOF'
import type { Jackpot, JackpotJsonLd } from '../types';

/**
 * Format a date string to a readable format
 * @param dateString - ISO date string
 * @returns Formatted date string
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  // If within the last week, show relative time
  if (diffInDays === 0) return "Today";
  if (diffInDays === 1) return "Yesterday";
  if (diffInDays < 7) return `${diffInDays} days ago`;

  // Otherwise show formatted date
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
  });
}

/**
 * Format currency with thousand separators
 * @param amount - Amount to format
 * @returns Formatted currency string
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-KE').format(Math.round(amount));
}

/**
 * Format full currency amount
 * @param amount - Amount to format
 * @returns Formatted full amount string
 */
export function formatFullAmount(amount: number): string {
  return new Intl.NumberFormat('en-KE').format(Math.round(amount));
}

/**
 * Convert local pick ('Home', 'Draw', 'Away') to API format ('1', 'X', '2')
 * @param pick - Local pick
 * @returns API pick format
 */
export function convertToApiPick(pick: 'Home' | 'Draw' | 'Away'): '1' | 'X' | '2' {
  if (pick === 'Home') return '1';
  if (pick === 'Draw') return 'X';
  return '2';
}

/**
 * Convert API pick ('1', 'X', '2') to local format ('Home', 'Draw', 'Away')
 * @param pick - API pick
 * @returns Local pick format
 */
export function convertToLocalPick(pick: '1' | 'X' | '2'): 'Home' | 'Draw' | 'Away' {
  if (pick === '1') return 'Home';
  if (pick === 'X') return 'Draw';
  return 'Away';
}

/**
 * Calculate time remaining until jackpot closes
 * @param closingDate - ISO date string of when betting closes
 * @returns Object with days, hours, and minutes remaining
 */
export function getTimeRemaining(closingDate: string): { days: number; hours: number; minutes: number; isExpired: boolean } {
  const now = new Date().getTime();
  const closing = new Date(closingDate).getTime();
  const diff = closing - now;

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, isExpired: true };
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  return { days, hours, minutes, isExpired: false };
}

/**
 * Generate JSON-LD structured data for SEO
 * @param jackpot - Jackpot data
 * @returns JSON-LD object
 */
export function generateJackpotJsonLd(jackpot: Jackpot): JackpotJsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: `${jackpot.site} Mega Jackpot Pro ${jackpot.events.length} #${jackpot.jackpotHumanId}`,
    description: `Track SportPesa Mega Jackpot results, view match outcomes, and share predictions. Prize pool: ${jackpot.currencySign} ${formatFullAmount(jackpot.totalPrizePool)}`,
    startDate: jackpot.events[0]?.kickoffTime || new Date().toISOString(),
    endDate: jackpot.bettingClosesAt,
    ...(jackpot.totalPrizePool && {
      offers: {
        '@type': 'Offer',
        price: jackpot.totalPrizePool.toString(),
        priceCurrency: 'KES',
      },
    }),
  };
}

/**
 * Truncate text to a maximum length
 * @param text - Text to truncate
 * @param maxLength - Maximum length
 * @returns Truncated text with ellipsis if needed
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
}

/**
 * Get status color based on jackpot status
 * @param status - Jackpot status
 * @returns Tailwind color class
 */
export function getStatusColor(status: 'Open' | 'Closed' | 'Finished'): string {
  switch (status) {
    case 'Open':
      return 'text-green-500 bg-green-500/20';
    case 'Closed':
      return 'text-yellow-500 bg-yellow-500/20';
    case 'Finished':
      return 'text-muted-foreground bg-muted';
    default:
      return 'text-muted-foreground bg-muted';
  }
}
EOF

echo "✅ Created utils/helpers.ts"

# ============================================
# utils/constants.ts
# ============================================
cat > features/jackpots/utils/constants.ts << 'EOF'
import type { TabType } from '../types';

/**
 * Available tabs in the jackpot tracker
 */
export const TABS: { id: TabType; label: string }[] = [
  { id: 'matches', label: 'Matches' },
  { id: 'predictions', label: 'Predictions' },
  { id: 'stats', label: 'Stats' },
  { id: 'comments', label: 'Comments' },
];

/**
 * Pick options for betting
 */
export const PICK_OPTIONS = ['Home', 'Draw', 'Away'] as const;

/**
 * API pick format
 */
export const API_PICKS = ['1', 'X', '2'] as const;

/**
 * Maximum characters for comments
 */
export const MAX_COMMENT_LENGTH = 500;

/**
 * Prediction update debounce time in ms
 */
export const PREDICTION_DEBOUNCE_TIME = 500;

/**
 * Default jackpot ID (for latest jackpot)
 */
export const DEFAULT_JACKPOT_ID = 'latest';

/**
 * Animation durations (in ms)
 */
export const ANIMATION = {
  FADE_IN: 200,
  SLIDE_IN: 300,
  BOUNCE: 400,
} as const;

/**
 * Jackpot status values
 */
export const JACKPOT_STATUS = {
  OPEN: 'Open',
  CLOSED: 'Closed',
  FINISHED: 'Finished',
} as const;

/**
 * Colors for different stats
 */
export const STAT_COLORS = {
  HOME: {
    bg: 'bg-green-500',
    text: 'text-green-950',
    border: 'border-green-500',
  },
  DRAW: {
    bg: 'bg-yellow-500',
    text: 'text-yellow-950',
    border: 'border-yellow-500',
  },
  AWAY: {
    bg: 'bg-blue-500',
    text: 'text-blue-950',
    border: 'border-blue-500',
  },
} as const;

/**
 * Error messages
 */
export const ERROR_MESSAGES = {
  FAILED_TO_LOAD: 'Failed to load jackpot',
  FAILED_TO_SAVE: 'Failed to save prediction',
  FAILED_TO_COMMENT: 'Failed to post comment',
  NETWORK_ERROR: 'Network error. Please check your connection.',
  GENERIC: 'Something went wrong. Please try again.',
} as const;

/**
 * Success messages
 */
export const SUCCESS_MESSAGES = {
  PREDICTION_SAVED: 'Prediction saved successfully!',
  COMMENT_POSTED: 'Comment posted successfully!',
  DELETED: 'Deleted successfully!',
} as const;

/**
 * Cache times (in seconds)
 */
export const CACHE_TIME = {
  JACKPOT_DETAILS: 60,
  PREDICTIONS: 30,
  COMMENTS: 10,
  STATISTICS: 60,
} as const;

/**
 * SEO Meta data defaults
 */
export const SEO_DEFAULTS = {
  SITE_NAME: 'Wufwuf',
  BASE_URL: 'https://wufwuf.io',
  TWITTER_HANDLE: '@Wufwuf',
  DEFAULT_IMAGE: '/og-jackpot.png',
} as const;
EOF

echo "✅ Created utils/constants.ts"

# ============================================
# hooks/useJackpotApi.ts
# ============================================
cat > features/jackpots/hooks/useJackpotApi.ts << 'EOF'
"use client";

import { useState, useEffect, useCallback } from "react";
import type {
  Jackpot,
  Prediction,
  PredictionPick,
  Comment,
  Statistics,
  UseJackpotDetailsReturn,
  UsePredictionsReturn,
  UseCommentsReturn,
  UseStatisticsReturn,
  ApiResponse,
} from "../types";

// Base API URL - points to our Next.js API routes
const API_BASE = "/api/jackpot";

/**
 * Custom hook for fetching jackpot details
 * @param jackpotId - The jackpot ID or "latest" to fetch the most recent jackpot
 */
export function useJackpotDetails(jackpotId: string): UseJackpotDetailsReturn {
  const [data, setData] = useState<Jackpot | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDetails = useCallback(async () => {
    if (!jackpotId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      let url = `${API_BASE}/details`;

      if (jackpotId !== "latest") {
        url += `?jackpotId=${jackpotId}`;
      } else {
        url += `?limit=1`;
      }

      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result: ApiResponse<Jackpot | Jackpot[]> = await response.json();

      if (!result.success) {
        throw new Error(result.message || "Failed to fetch jackpot details");
      }

      const jackpotData = Array.isArray(result.data)
        ? result.data[0]
        : result.data;

      if (!jackpotData) {
        throw new Error("No jackpot found");
      }

      setData(jackpotData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred";
      setError(errorMessage);
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [jackpotId]);

  useEffect(() => {
    fetchDetails();
  }, [fetchDetails]);

  return { data, loading, error, refetch: fetchDetails };
}

/**
 * Custom hook for fetching and managing predictions
 * @param jackpotId - The jackpot ID (MongoDB ObjectId)
 */
export function usePredictions(jackpotId?: string): UsePredictionsReturn {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [userPrediction, setUserPrediction] = useState<Prediction | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchPredictions = useCallback(async () => {
    if (!jackpotId) return;

    try {
      setLoading(true);
      const response = await fetch(
        `${API_BASE}/picks?jackpotId=${jackpotId}`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result: ApiResponse<Prediction[]> = await response.json();

      if (!result.success) {
        throw new Error(result.message || "Failed to fetch predictions");
      }

      setPredictions(result.data || []);
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [jackpotId]);

  const fetchUserPrediction = useCallback(async () => {
    if (!jackpotId) return;

    try {
      const response = await fetch(
        `${API_BASE}/picks?jackpotId=${jackpotId}`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result: ApiResponse<Prediction[]> = await response.json();

      if (result.success && result.data?.length > 0) {
        setUserPrediction(result.data[0]);
      }
    } catch (err) {
      console.error("Error fetching user prediction:", err);
    }
  }, [jackpotId]);

  const createPrediction = useCallback(
    async (picks: PredictionPick[]): Promise<Prediction | null> => {
      if (!jackpotId) return null;

      try {
        setSubmitting(true);
        const response = await fetch(`${API_BASE}/picks`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ jackpotId, picks }),
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result: ApiResponse<Prediction> = await response.json();

        if (!result.success) {
          throw new Error(result.message || "Failed to create prediction");
        }

        setUserPrediction(result.data);
        await fetchPredictions();
        return result.data;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "An error occurred";
        setError(errorMessage);
        return null;
      } finally {
        setSubmitting(false);
      }
    },
    [jackpotId, fetchPredictions]
  );

  const updatePrediction = useCallback(
    async (predictionId: string, picks: PredictionPick[]): Promise<Prediction | null> => {
      try {
        setSubmitting(true);
        const response = await fetch(`${API_BASE}/picks`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ predictionId, picks }),
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result: ApiResponse<Prediction> = await response.json();

        if (!result.success) {
          throw new Error(result.message || "Failed to update prediction");
        }

        setUserPrediction(result.data);
        await fetchPredictions();
        return result.data;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "An error occurred";
        setError(errorMessage);
        return null;
      } finally {
        setSubmitting(false);
      }
    },
    [fetchPredictions]
  );

  const deletePrediction = useCallback(
    async (predictionId: string): Promise<boolean> => {
      try {
        setSubmitting(true);
        const response = await fetch(`${API_BASE}/picks`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ predictionId }),
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result: ApiResponse<{ deleted: boolean }> = await response.json();

        if (!result.success) {
          throw new Error(result.message || "Failed to delete prediction");
        }

        setUserPrediction(null);
        await fetchPredictions();
        return true;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "An error occurred";
        setError(errorMessage);
        return false;
      } finally {
        setSubmitting(false);
      }
    },
    [fetchPredictions]
  );

  useEffect(() => {
    if (jackpotId) {
      fetchPredictions();
      fetchUserPrediction();
    }
  }, [jackpotId, fetchPredictions, fetchUserPrediction]);

  return {
    predictions,
    userPrediction,
    loading,
    error,
    submitting,
    createPrediction,
    updatePrediction,
    deletePrediction,
  };
}

/**
 * Custom hook for fetching and managing comments
 * @param jackpotId - The jackpot ID (MongoDB ObjectId)
 */
export function useComments(jackpotId?: string): UseCommentsReturn {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchComments = useCallback(async () => {
    if (!jackpotId) return;

    try {
      setLoading(true);
      const response = await fetch(
        `${API_BASE}/comments?jackpotId=${jackpotId}`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result: ApiResponse<Comment[]> = await response.json();

      if (!result.success) {
        throw new Error(result.message || "Failed to fetch comments");
      }

      setComments(result.data || []);
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [jackpotId]);

  const createComment = useCallback(
    async (text: string): Promise<Comment | null> => {
      if (!jackpotId) return null;

      try {
        setSubmitting(true);
        const response = await fetch(`${API_BASE}/comments`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ jackpotId, text }),
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result: ApiResponse<Comment> = await response.json();

        if (!result.success) {
          throw new Error(result.message || "Failed to create comment");
        }

        setComments((prev) => [result.data, ...prev]);
        return result.data;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "An error occurred";
        setError(errorMessage);
        return null;
      } finally {
        setSubmitting(false);
      }
    },
    [jackpotId]
  );

  const deleteComment = useCallback(async (commentId: string): Promise<boolean> => {
    try {
      setSubmitting(true);
      const response = await fetch(`${API_BASE}/comments`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ commentId }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result: ApiResponse<{ deleted: boolean }> = await response.json();

      if (!result.success) {
        throw new Error(result.message || "Failed to delete comment");
      }

      setComments((prev) => prev.filter((c) => c._id !== commentId));
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred";
      setError(errorMessage);
      return false;
    } finally {
      setSubmitting(false);
    }
  }, []);

  useEffect(() => {
    if (jackpotId) {
      fetchComments();
    }
  }, [jackpotId, fetchComments]);

  return {
    comments,
    loading,
    error,
    submitting,
    createComment,
    deleteComment,
    refetch: fetchComments,
  };
}

/**
 * Custom hook for fetching statistics
 * @param jackpotId - The jackpot ID (MongoDB ObjectId)
 */
export function useStatistics(jackpotId?: string): UseStatisticsReturn {
  const [stats, setStats] = useState<Statistics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    if (!jackpotId) return;

    try {
      setLoading(true);
      const response = await fetch(
        `${API_BASE}/statistics?jackpotId=${jackpotId}`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result: ApiResponse<Statistics> = await response.json();

      if (!result.success) {
        throw new Error(result.message || "Failed to fetch statistics");
      }

      setStats(result.data);
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [jackpotId]);

  useEffect(() => {
    if (jackpotId) {
      fetchStats();
    }
  }, [jackpotId, fetchStats]);

  return { stats, loading, error, refetch: fetchStats };
}
EOF

echo "✅ Created hooks/useJackpotApi.ts"

echo ""
echo "🎉 All files created successfully in features/jackpots/"
echo ""
echo "📂 Created files:"
echo "  - types/index.ts"
echo "  - utils/helpers.ts"
echo "  - utils/constants.ts"
echo "  - hooks/useJackpotApi.ts"
echo ""
echo "Next steps:"
echo "1. Copy the component files (coming in next script)"
echo "2. Update your app/(app)/jackpots files"
echo ""
```

File: tsconfig.json
```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "react-jsx",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    ".next/types/**/*.ts",
    ".next/dev/types/**/*.ts",
    "**/*.mts"
  ],
  "exclude": ["node_modules"]
}

```

