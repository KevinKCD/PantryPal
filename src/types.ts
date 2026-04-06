import React from "react";

export type TabId = "dashboard" | "recipes" | "pantry" | "plans" | "settings";

export interface Recipe {
  id: number;
  title: string;
  time: string;
  difficulty: "Easy" | "Medium" | "Hard";
  image: string;
}

export interface ScannedItem {
  barcode: string;
  name: string;
  category: string;
  image?: string;
}

export interface PantryItem {
  id: number;
  name: string;
  category: string;
  quantity: string;
  status: "Full" | "Medium" | "Low";
}

export interface MenuItem {
  id: TabId;
  label: string;
  icon: React.ElementType;
}

export interface NavProps {
  activeTab: TabId;
  setActiveTab: (tab: TabId) => void;
}
