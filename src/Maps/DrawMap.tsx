import React, { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
import * as turf from "@turf/turf";
import { Feature } from "geojson";

interface DrawMapProps {
  setFeatureCount: (count: { points: number; lines: number; polygons: number }) => void;
}

const DrawMap: React.FC<DrawMapProps> = ({ setFeatureCount }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const drawRef = useRef<InstanceType<typeof MapboxDraw> | null>(null);

  const [totalDistance, setTotalDistance] = useState(0);

  useEffect(() => {
    const map = new maplibregl.Map({
      container: mapContainer.current!,
      style: "https://api.maptiler.com/maps/satellite/style.json?key=NU4TnQJY51sPc4xBLKl3",
      center: [0, 0],
      zoom: 2,
    });

    const draw = new MapboxDraw({
      displayControlsDefault: false,
    });

    map.addControl(draw);

    mapRef.current = map;
    drawRef.current = draw;

    function updateFeatures() {
      const features = draw.getAll().features || [];
      const points = features.filter((f: Feature) => f.geometry.type === "Point").length;
      const lines = features.filter((f: Feature) => f.geometry.type === "LineString").length;
      const polygons = features.filter((f: Feature) => f.geometry.type === "Polygon").length;

      setFeatureCount({ points, lines, polygons });

      const lineFeatures = features.filter(
        (f: Feature) => f.geometry.type === "LineString"
      ) as Feature[];
      let distance = 0;

      lineFeatures.forEach((line) => {
        if (line.geometry.type === "LineString") {
          const lineString = turf.lineString(line.geometry.coordinates as turf.Position[]);
          distance += turf.length(lineString, { units: "kilometers" });
        }
      });

      setTotalDistance(distance);
    }

    map.on("draw.create", updateFeatures);
    map.on("draw.delete", updateFeatures);
    map.on("draw.update", updateFeatures);

    return () => {
      map.remove();
    };
  }, [setFeatureCount]);

  const handleDrawPoint = () => {
    drawRef.current?.changeMode("draw_point");
  };

  const handleDrawLine = () => {
    drawRef.current?.changeMode("draw_line_string");
  };

  const handleDrawPolygon = () => {
    drawRef.current?.changeMode("draw_polygon");
  };

  const handleDelete = () => {
    drawRef.current?.trash();
  };

  return (
    <div className="relative w-screen h-screen">
      {/* Toolbar */}
      <div className="absolute top-4 left-4 z-50 bg-black bg-opacity-70 p-4 rounded-md shadow-md space-y-2">
        <div className="text-sm text-white mb-2">Info</div>
        <button
          onClick={handleDrawPoint}
          className="w-full px-4 py-2 text-sm text-white bg-blue-600 rounded hover:bg-blue-700"
        >
          Tambah Titik
        </button>
        <button
          onClick={handleDrawLine}
          className="w-full px-4 py-2 text-sm text-white bg-green-600 rounded hover:bg-green-700"
        >
          Tambah Garis
        </button>
        <button
          onClick={handleDrawPolygon}
          className="w-full px-4 py-2 text-sm text-white bg-yellow-600 rounded hover:bg-yellow-700"
        >
          Tambah Poligon
        </button>
        <button
          onClick={handleDelete}
          className="w-full px-4 py-2 text-sm text-white bg-red-600 rounded hover:bg-red-700"
        >
          Hapus
        </button>
        <div className="mt-4 text-sm text-gray-300">
          <div>Points: 0</div>
          <div>Lines: 0</div>
          <div>Polygons: 0</div>
          <div>Total Jarak: {totalDistance.toFixed(2)} km</div>
        </div>
      </div>

      {/* Kontainer Peta */}
      <div
        ref={mapContainer}
        className="absolute inset-0 w-full h-full"
      />
    </div>
  );
};

export default DrawMap;
