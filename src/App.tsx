import React, { useState } from "react";
import DrawMap from "./Maps/DrawMap";
import Sidebar from "./Sidebar/Sidebar";

const App: React.FC = () => {
  const [featureCount, setFeatureCount] = useState({
    points: 0,
    lines: 0,
    polygons: 0,
  });

  const [selectedItems, setSelectedItems] = useState({
    points: true,
    lines: true,
    polygons: true,
  });

  return (
    <div className="flex w-full h-screen">
      <Sidebar
        featureCount={featureCount}
        selectedItems={selectedItems}
        setSelectedItems={setSelectedItems}
      />
      <div className="flex-1">
        <DrawMap setFeatureCount={setFeatureCount} selectedItems={selectedItems} />
      </div>
    </div>
  );
};

export default App;
