import React from "react";

interface SidebarProps {
  featureCount: { points: number; lines: number; polygons: number };
}

const Sidebar: React.FC<SidebarProps> = ({ featureCount }) => {
  return (
    <div className="flex flex-col w-80 h-full bg-black text-white border-l border-gray-800 p-6">
      <h3 className="text-xl font-bold text-green-500 mb-6">Info</h3>
      <ul className="space-y-4">
        <li className="flex justify-between text-gray-300">
          <span>Total:</span>
          <span className="text-white font-semibold">
            {featureCount.points + featureCount.lines + featureCount.polygons}
          </span>
        </li>
        <li className="flex justify-between">
          <span className="text-gray-300">Points:</span>
          <span className="text-white font-semibold">{featureCount.points}</span>
        </li>
        <li className="flex justify-between">
          <span className="text-gray-300">Lines:</span>
          <span className="text-white font-semibold">{featureCount.lines}</span>
        </li>
        <li className="flex justify-between">
          <span className="text-gray-300">Polygons:</span>
          <span className="text-white font-semibold">{featureCount.polygons}</span>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;