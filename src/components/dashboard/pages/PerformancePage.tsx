import React from "react";
import Sidebar from "../Sidebar";
import PerformanceWidget from "../widgets/PerformanceWidget";

const PerformancePage = () => {
  return (
    <div className="flex h-screen w-screen bg-background overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-auto p-6">
        <div className="flex justify-center">
          <PerformanceWidget />
        </div>
      </main>
    </div>
  );
};

export default PerformancePage;
