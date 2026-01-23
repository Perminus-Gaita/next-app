import { ReactNode } from "react";
import AppLayout from "@/components/layouts/AppLayout";

interface AppLayoutWrapperProps {
  children: ReactNode;
}

export default function AppLayoutWrapper({ children }: AppLayoutWrapperProps) {
  return <AppLayout>{children}</AppLayout>;
}