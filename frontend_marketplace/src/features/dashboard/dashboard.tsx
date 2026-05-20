"use client";

import { ActiveContracts } from "./components/ActiveContracts";
import { PropuestasRecibidas } from "./components/PropuestasRecibidas";
import { RecommendedServices } from "./components/RecommendedServices";

export function Dashboard() {
  return (
    <div className="space-y-8">
      <PropuestasRecibidas />
      <ActiveContracts />
      <RecommendedServices />
    </div>
  );
}
