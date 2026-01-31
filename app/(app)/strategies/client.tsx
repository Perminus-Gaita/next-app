"use client";
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import YourStrategies from './components/YourStrategies';
import StrategyStudio from './components/StrategyStudio';

export default function StrategiesClient() {
  return (
    <div className="w-full max-w-7xl mx-auto">
      <Tabs defaultValue="studio" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="studio">Strategy Studio</TabsTrigger>
          <TabsTrigger value="saved">Your Strategies</TabsTrigger>
        </TabsList>

        <TabsContent value="studio" className="mt-6">
          <StrategyStudio />
        </TabsContent>

        <TabsContent value="saved" className="mt-6">
          <YourStrategies />
        </TabsContent>
      </Tabs>
    </div>
  );
}
