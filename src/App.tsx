import React, { useState } from "react";
import Sidebar from "./Sidebar/Sidebar";
import DrawMap from "./Maps/DrawMap";
import './index.css';


const App: React.FC = () => {
  const [featureCount, setFeatureCount] = useState({
    points: 0,
    lines: 0,
    polygons: 0,
  });

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <Sidebar featureCount={featureCount} />

      {/* Map */}
      <div className="flex-1">
        <DrawMap setFeatureCount={setFeatureCount} />
      </div>
    </div>
  );
};

export default App;