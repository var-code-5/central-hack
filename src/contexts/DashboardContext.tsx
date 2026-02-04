'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

type DashboardStep = 'profile' | 'team-create' | 'team-detail' | null;

interface DashboardContextType {
  dashboardStep: DashboardStep;
  setDashboardStep: (step: DashboardStep) => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [dashboardStep, setDashboardStep] = useState<DashboardStep>(null);

  return (
    <DashboardContext.Provider value={{ dashboardStep, setDashboardStep }}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboardContext() {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    // Return a default value when used outside the provider (non-dashboard pages)
    return { dashboardStep: null, setDashboardStep: () => {} };
  }
  return context;
}
