import './App.css';
import React from "react";
import { coffeeData } from "./coffeeData";
import CoffeeMap from "./map";
import CoffeeBarChart from "./barChart";
import 'leaflet/dist/leaflet.css';

function coffeeVisuals() {
  return (
    <div>
      <div>
      <h1>Map of Coffee Shops Around Campus</h1>
      <CoffeeMap />
      </div>
      <div>
      <h1>Average Coffee Price</h1>
      <CoffeeBarChart />
      </div>
    </div>
  );
}

export default coffeeVisuals;