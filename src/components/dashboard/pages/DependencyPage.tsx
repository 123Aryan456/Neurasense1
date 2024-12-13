import React from "react";
import Sidebar from "../Sidebar";
import DependencyWidget from "../widgets/DependencyWidget";

const DependencyPage = () => {
  return (
    <div className="flex h-screen w-screen bg-background overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-auto p-6">
        <div className="flex justify-center">
          <DependencyWidget />
        </div>
      </main>
    </div>
  );
};

export default DependencyPage;
