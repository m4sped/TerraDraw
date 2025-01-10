import React from "react";

interface SidebarProps {
  featureCount: { points: number; lines: number; polygons: number };
  selectedItems: { points: boolean; lines: boolean; polygons: boolean };
  setSelectedItems: (selected: { points: boolean; lines: boolean; polygons: boolean }) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ featureCount, selectedItems, setSelectedItems }) => {
  const toggleSelection = (type: "points" | "lines" | "polygons") => {
    setSelectedItems({ ...selectedItems, [type]: !selectedItems[type] });
  };

  return (
    <div className="flex flex-col w-72 h-full bg-gray-800 text-white shadow-lg p-6">
      {/* Header */}
      <h3 className="text-lg font-bold text-blue-400 mb-6 border-b border-gray-700 pb-2">
        Info Geometri
      </h3>

      {/* Feature Count */}
      <ul className="space-y-4">
        <li className="flex justify-between items-center p-2 rounded-md bg-gray-700 hover:bg-gray-600 transition">
          <span className="text-sm text-gray-400">Total Fitur</span>
          <span className="text-base font-semibold text-blue-300">
            {featureCount.points + featureCount.lines + featureCount.polygons}
          </span>
        </li>
        <li className="flex justify-between items-center p-2 rounded-md bg-gray-700 hover:bg-gray-600 transition">
          <span className="text-sm text-gray-400">Titik</span>
          <span className="text-base font-semibold text-blue-300">{featureCount.points}</span>
        </li>
        <li className="flex justify-between items-center p-2 rounded-md bg-gray-700 hover:bg-gray-600 transition">
          <span className="text-sm text-gray-400">Garis</span>
          <span className="text-base font-semibold text-blue-300">{featureCount.lines}</span>
        </li>
        <li className="flex justify-between items-center p-2 rounded-md bg-gray-700 hover:bg-gray-600 transition">
          <span className="text-sm text-gray-400">Poligon</span>
          <span className="text-base font-semibold text-blue-300">{featureCount.polygons}</span>
        </li>
      </ul>

      {/* Selection */}
      <h3 className="text-lg font-bold text-blue-400 mt-8 border-b border-gray-700 pb-2">
        Fitur Pilihan
      </h3>
      <div className="space-y-4 mt-6">
        {["points", "lines", "polygons"].map((type) => (
          <div key={type} className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={selectedItems[type as "points" | "lines" | "polygons"]}
              onChange={() => toggleSelection(type as "points" | "lines" | "polygons")}
              className="w-5 h-5 text-blue-400 bg-gray-700 border-gray-600 focus:ring-blue-500 rounded-md"
            />
            <label className="text-sm text-gray-300 cursor-pointer capitalize">
              {type}
            </label>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-auto pt-6 border-t border-gray-700 text-sm text-gray-500">
        Project Pedro IoT 2025.
      </div>
    </div>
  );
};

export default Sidebar;
