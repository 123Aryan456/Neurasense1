import React from "react";
import Sidebar from "../Sidebar";
import CodeTreeWidget from "../widgets/CodeTreeWidget";

const CodeTreePage = () => {
  return (
    <div className="flex h-screen w-screen bg-background overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-auto p-6">
        <div className="flex justify-center">
          <CodeTreeWidget />
        </div>
      </main>
    </div>
  );
};

export default CodeTreePage;
