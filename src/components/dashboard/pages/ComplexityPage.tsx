import React from "react";
import Sidebar from "../Sidebar";
import ComplexityWidget from "../widgets/ComplexityWidget";

const ComplexityPage = () => {
  return (
    <div className="flex h-screen w-screen bg-background overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-auto p-6">
        <div className="flex justify-center">
          <ComplexityWidget />
        </div>
      </main>
    </div>
  );
};

export default ComplexityPage;
