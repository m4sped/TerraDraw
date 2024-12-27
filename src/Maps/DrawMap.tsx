import React, { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
import * as turf from "@turf/turf";
import { Feature, LineString, Polygon } from "geojson";

interface DrawMapProps {
  setFeatureCount: (count: { points: number; lines: number; polygons: number }) => void;
}

const DrawMap: React.FC<DrawMapProps> = ({ setFeatureCount }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const drawRef = useRef<InstanceType<typeof MapboxDraw> | null>(null);
  const [totalDistance, setTotalDistance] = useState<number>(0);
  const [totalArea, setTotalArea] = useState<number>(0);

  const lineDistanceSourceId = "line-distance-labels";

  useEffect(() => {
    const map = new maplibregl.Map({
      container: mapContainer.current!,
      style: "https://api.maptiler.com/maps/hybrid/style.json?key=NU4TnQJY51sPc4xBLKl3",
      center: [0, 0],
      zoom: 2,
    });

    const draw = new MapboxDraw({
      displayControlsDefault: false,
      styles: [
        {
          id: "gl-draw-line",
          type: "line",
          filter: ["all", ["==", "$type", "LineString"], ["!=", "mode", "static"]],
          layout: { "line-cap": "round", "line-join": "round" },
          paint: {
            "line-color": "#000000",
            "line-width": 4,
            "line-opacity": 0.8,
          },
        },
        {
          id: "gl-draw-point",
          type: "circle",
          filter: ["all", ["==", "$type", "Point"], ["!=", "mode", "static"]],
          paint: {
            "circle-radius": 6,
            "circle-color": "#FF0000",
          },
        },
        {
          id: "gl-draw-polygon",
          type: "fill",
          filter: ["all", ["==", "$type", "Polygon"], ["!=", "mode", "static"]],
          paint: {
            "fill-color": "#00FF00",
            "fill-opacity": 0.5,
          },
        },
        {
          id: "gl-draw-polygon-stroke",
          type: "line",
          filter: ["all", ["==", "$type", "Polygon"], ["!=", "mode", "static"]],
          layout: { "line-cap": "round", "line-join": "round" },
          paint: {
            "line-color": "#00FF00",
            "line-width": 2,
          },
        },
      ],
    });

    map.addControl(draw);
    mapRef.current = map;
    drawRef.current = draw;

    map.on("load", () => {
      map.addSource(lineDistanceSourceId, {
        type: "geojson",
        data: { type: "FeatureCollection", features: [] },
      });

      map.addLayer({
        id: "line-distance-label-layer",
        type: "symbol",
        source: lineDistanceSourceId,
        layout: {
          "text-field": ["get", "distanceLabel"],
          "text-size": 14,
          "text-offset": [0, 1],
          "text-anchor": "top",
        },
        paint: {
          "text-color": "#00FFFF",
        },
      });
    });

    const updateRealTimeStats = () => {
      const features = draw.getAll().features || [];
      const points = features.filter((f: Feature) => f.geometry.type === "Point").length;
      const lines = features.filter((f: Feature) => f.geometry.type === "LineString").length;
      const polygons = features.filter((f: Feature) => f.geometry.type === "Polygon").length;

      setFeatureCount({ points, lines, polygons });

      const lineFeatures = features.filter(
        (f: Feature) => f.geometry.type === "LineString"
      ) as Feature<LineString>[];

      const polygonFeatures = features.filter(
        (f: Feature) => f.geometry.type === "Polygon"
      ) as Feature<Polygon>[];

      let distance = 0;
      let area = 0;
      const labelFeatures: any[] = [];

      lineFeatures.forEach((line) => {
        if (line.geometry.type === "LineString" && line.geometry.coordinates) {
          const coordinates = line.geometry.coordinates;

          for (let i = 0; i < coordinates.length - 1; i++) {
            const start = coordinates[i];
            const end = coordinates[i + 1];
            const segment = turf.lineString([start, end]);
            const segmentDistance = turf.length(segment, { units: "kilometers" });

            distance += segmentDistance;

            const center = turf.midpoint(turf.point(start), turf.point(end)).geometry.coordinates;

            labelFeatures.push({
              type: "Feature",
              geometry: { type: "Point", coordinates: center },
              properties: {
                distanceLabel: `${segmentDistance.toFixed(2)} km`,
              },
            });
          }
        }
      });

      polygonFeatures.forEach((polygon) => {
        if (polygon.geometry.type === "Polygon" && polygon.geometry.coordinates) {
          const polygonArea = turf.area(polygon); // Area in square meters
          area += polygonArea;
        }
      });

      setTotalDistance(distance);
      setTotalArea(area);

      const source = mapRef.current?.getSource(lineDistanceSourceId) as maplibregl.GeoJSONSource;
      if (source) {
        source.setData({
          type: "FeatureCollection",
          features: labelFeatures,
        });
      }
    };

    map.on("mousemove", updateRealTimeStats);
    map.on("draw.create", updateRealTimeStats);
    map.on("draw.delete", updateRealTimeStats);
    map.on("draw.update", updateRealTimeStats);

    return () => map.remove();
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
    <div className="relative w-full h-full bg-gray-900">
      <div className="absolute top-4 left-4 z-50 bg-black border border-gray-700 p-4 rounded-lg shadow-lg flex flex-col space-y-4">
        <button
          onClick={handleDrawPoint}
          className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          Titik
        </button>
        <button
          onClick={handleDrawLine}
          className="w-full px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
        >
          Garis
        </button>
        <button
          onClick={handleDrawPolygon}
          className="w-full px-4 py-2 text-sm font-medium text-white bg-yellow-600 rounded-md hover:bg-yellow-700"
        >
          Poligon
        </button>
        <button
          onClick={handleDelete}
          className="w-full px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
        >
          Hapus
        </button>
        <div className="text-sm text-white">
          <p>
            Total Jarak: <span className="text-blue-400">{totalDistance.toFixed(2)}</span> km
          </p>
          <p>
            Total Area: <span className="text-green-400">{(totalArea / 1_000_000).toFixed(2)}</span> km²
          </p>
        </div>
      </div>
      <div
        ref={mapContainer}
        className="w-full h-full border-t border-gray-800 rounded-lg"
        style={{ backgroundColor: "black" }}
      />
    </div>
  );
};

export default DrawMap;
