"use client";

import { useState } from "react";
import Submenu from "./Submenu";
import StaffDetails from "./staff/StaffDetails";

export default function Staff() {

  const [activeTab, setActiveTab] = useState(null)
  
  const renderTabContent = () => {
    switch (activeTab) {
      case 'staff':
        return <StaffDetails />
      default:
        return <h2>No Content Available</h2>
    }
  }
  return (
    <div className="flow-root">
      {/* Primary Tabs */}
      <Submenu
        activeTab={activeTab}
        handleTab={(value) => {
          setActiveTab(value)
        }}
      />
       {renderTabContent()}
    </div>
  );
}
