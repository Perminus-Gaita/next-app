File Structure:

./
```
└── .gitignore
└── README.md
├── app
│   └── globals.css
│   └── layout.tsx
│   └── page.tsx
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
├── hooks
│   └── useMediaQuery.ts
├── lib
│   └── utils.ts
└── package.json
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

File: app/globals.css
```css
@import "tailwindcss";@import "tw-animate-css";@custom-variant dark (&:is(.dark *));@theme inline{--color-background:var(--background);--color-foreground:var(--foreground);--font-sans:var(--font-geist-sans);--font-mono:var(--font-geist-mono);--color-sidebar-ring:var(--sidebar-ring);--color-sidebar-border:var(--sidebar-border);--color-sidebar-accent-foreground:var(--sidebar-accent-foreground);--color-sidebar-accent:var(--sidebar-accent);--color-sidebar-primary-foreground:var(--sidebar-primary-foreground);--color-sidebar-primary:var(--sidebar-primary);--color-sidebar-foreground:var(--sidebar-foreground);--color-sidebar:var(--sidebar);--color-chart-5:var(--chart-5);--color-chart-4:var(--chart-4);--color-chart-3:var(--chart-3);--color-chart-2:var(--chart-2);--color-chart-1:var(--chart-1);--color-ring:var(--ring);--color-input:var(--input);--color-border:var(--border);--color-destructive:var(--destructive);--color-accent-foreground:var(--accent-foreground);--color-accent:var(--accent);--color-muted-foreground:var(--muted-foreground);--color-muted:var(--muted);--color-secondary-foreground:var(--secondary-foreground);--color-secondary:var(--secondary);--color-primary-foreground:var(--primary-foreground);--color-primary:var(--primary);--color-popover-foreground:var(--popover-foreground);--color-popover:var(--popover);--color-card-foreground:var(--card-foreground);--color-card:var(--card);--radius-sm:calc(var(--radius) - 4px);--radius-md:calc(var(--radius) - 2px);--radius-lg:var(--radius);--radius-xl:calc(var(--radius) + 4px);--radius-2xl:calc(var(--radius) + 8px);--radius-3xl:calc(var(--radius) + 12px);--radius-4xl:calc(var(--radius) + 16px);}:root{--radius:0.625rem;--background:oklch(1 0 0);--foreground:oklch(0.129 0.042 264.695);--card:oklch(1 0 0);--card-foreground:oklch(0.129 0.042 264.695);--popover:oklch(1 0 0);--popover-foreground:oklch(0.129 0.042 264.695);--primary:oklch(0.208 0.042 265.755);--primary-foreground:oklch(0.984 0.003 247.858);--secondary:oklch(0.968 0.007 247.896);--secondary-foreground:oklch(0.208 0.042 265.755);--muted:oklch(0.968 0.007 247.896);--muted-foreground:oklch(0.554 0.046 257.417);--accent:oklch(0.968 0.007 247.896);--accent-foreground:oklch(0.208 0.042 265.755);--destructive:oklch(0.577 0.245 27.325);--border:oklch(0.929 0.013 255.508);--input:oklch(0.929 0.013 255.508);--ring:oklch(0.704 0.04 256.788);--chart-1:oklch(0.646 0.222 41.116);--chart-2:oklch(0.6 0.118 184.704);--chart-3:oklch(0.398 0.07 227.392);--chart-4:oklch(0.828 0.189 84.429);--chart-5:oklch(0.769 0.188 70.08);--sidebar:oklch(0.984 0.003 247.858);--sidebar-foreground:oklch(0.129 0.042 264.695);--sidebar-primary:oklch(0.208 0.042 265.755);--sidebar-primary-foreground:oklch(0.984 0.003 247.858);--sidebar-accent:oklch(0.968 0.007 247.896);--sidebar-accent-foreground:oklch(0.208 0.042 265.755);--sidebar-border:oklch(0.929 0.013 255.508);--sidebar-ring:oklch(0.704 0.04 256.788);}.dark{--background:oklch(0.129 0.042 264.695);--foreground:oklch(0.984 0.003 247.858);--card:oklch(0.208 0.042 265.755);--card-foreground:oklch(0.984 0.003 247.858);--popover:oklch(0.208 0.042 265.755);--popover-foreground:oklch(0.984 0.003 247.858);--primary:oklch(0.929 0.013 255.508);--primary-foreground:oklch(0.208 0.042 265.755);--secondary:oklch(0.279 0.041 260.031);--secondary-foreground:oklch(0.984 0.003 247.858);--muted:oklch(0.279 0.041 260.031);--muted-foreground:oklch(0.704 0.04 256.788);--accent:oklch(0.279 0.041 260.031);--accent-foreground:oklch(0.984 0.003 247.858);--destructive:oklch(0.704 0.191 22.216);--border:oklch(1 0 0 / 10%);--input:oklch(1 0 0 / 15%);--ring:oklch(0.551 0.027 264.364);--chart-1:oklch(0.488 0.243 264.376);--chart-2:oklch(0.696 0.17 162.48);--chart-3:oklch(0.769 0.188 70.08);--chart-4:oklch(0.627 0.265 303.9);--chart-5:oklch(0.645 0.246 16.439);--sidebar:oklch(0.208 0.042 265.755);--sidebar-foreground:oklch(0.984 0.003 247.858);--sidebar-primary:oklch(0.488 0.243 264.376);--sidebar-primary-foreground:oklch(0.984 0.003 247.858);--sidebar-accent:oklch(0.279 0.041 260.031);--sidebar-accent-foreground:oklch(0.984 0.003 247.858);--sidebar-border:oklch(1 0 0 / 10%);--sidebar-ring:oklch(0.551 0.027 264.364);}@layer base{*{@apply border-border outline-ring/50;}body{@apply bg-background text-foreground;}}
```

File: app/layout.tsx
```tsx
import{ReactNode}from "react";import type{Metadata,Viewport}from "next";import "./globals.css";export const metadata:Metadata={title:"My App",description:"Welcome to my application",};export const viewport:Viewport={width:"device-width",initialScale:1,};interface RootLayoutProps{children:ReactNode;}export default function RootLayout({children}:RootLayoutProps){return ( <html lang="en"> <body className="bg-white dark:bg-gray-900"> <main className="min-h-screen">{children}</main> </body> </html> );}
```

File: app/page.tsx
```tsx
export default function Home(){return ( <div className="flex items-center justify-center min-h-screen"> <div className="text-center"> <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4"> Welcome </h1> <p className="text-gray-600 dark:text-gray-400"> Your app is ready to build! </p> </div> </div> );}
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
"use client";import Link from "next/link";import{usePathname}from "next/navigation";import{useMediaQuery}from "@/hooks/useMediaQuery";import{cn}from "@/lib/utils";import{Home,User,Settings,Headset,LucideIcon}from "lucide-react";interface NavItemType{href:string;icon:LucideIcon;label:string;}interface NavItemProps{item:NavItemType;isActive:boolean;openLeftSidebar:boolean;onClose:()=> void;}const NavItem=({item,isActive,openLeftSidebar,onClose}:NavItemProps)=>{const isMobile=useMediaQuery('(max-width:639px)');const isTablet=useMediaQuery('(min-width:640px) and (max-width:1023px)');const Icon=item.icon;const handleClick=()=>{if ((isMobile || isTablet) && onClose){onClose();}};return ( <Link href={item.href}onClick={handleClick}className={cn( "flex items-center px-3 h-12 text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800",isActive ? "bg-gray-100 dark:bg-gray-800 text-blue-600":"text-gray-700 dark:text-gray-300",openLeftSidebar ? "justify-start":"justify-center" )}> <Icon className="h-5 w-5" />{openLeftSidebar && <span className="ml-3">{item.label}</span>}</Link> );};interface LeftSideBarProps{openLeftSidebar:boolean;onClose:()=> void;}export default function LeftSideBar({openLeftSidebar,onClose}:LeftSideBarProps){const pathname=usePathname();const navItems:NavItemType[]=[{href:"/lobby",icon:Home,label:"Lobby"},{href:"/profile",icon:User,label:"Profile"},{href:"/support",icon:Headset,label:"Support"},{href:"/settings",icon:Settings,label:"Settings"},];return ( <aside className="h-full overflow-y-auto"> <div className="flex flex-col h-full"> <div className="flex-1 py-4">{navItems.map((item,index)=> ( <NavItem key={index}item={item}isActive={pathname===item.href}openLeftSidebar={openLeftSidebar}onClose={onClose}/> ))}</div> </div> </aside> );}
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

