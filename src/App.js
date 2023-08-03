import logo from './logo.svg';
import './App.css';
import React, { Component } from "react";
import { FC, useEffect, useState } from "react";
import { MapContainer, TileLayer, useMap, CircleMarker, Popup, Tooltip } from 'react-leaflet'
import 'leaflet/dist/leaflet.css';

function UpdateMap() {
  const map = useMap();
  map.invalidateSize();
  return null;
}

const MapController = ({selectedShop}) => {
  const map = useMap();
  const flyToDuration = 1.5;

  const flyTo = (location) => {
    map.flyTo(location, 18, {
      animate: true,
      duration: flyToDuration,
    });
  };

  const flyToCenter = () => {
    map.flyTo([37.8686181, -122.2611693], 16, {
      animate: true,
      duration: flyToDuration,
    });
  };

  useEffect(() => {
    if(selectedShop) {
      flyTo(selectedShop.center);
    } else {
      flyToCenter();
    }
  }, [selectedShop])

  return null;
};

function MyMap() {
  const [selectedShop, setSelectedShop] = useState(null); // useState hook
  
  return (
    <div style={{ display: "flex" }}>
      <div className="sidebar"> 
      { /*  how we're making the menu */ }
        {coffeeData.info.map((shop, index) => (
          <div key={index} className="coffee-shop" onClick={() => setSelectedShop(shop)}>
            <p>{shop.shopName}</p>
            <p id="address">{shop.address}</p>
          </div>
        ))}
      </div>
      <div className="map-container">
        <MapContainer className="map" center={[37.8686181, -122.2611693]} zoom={15}>
          <MapController selectedShop={selectedShop} />
          <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}.png" />
          {coffeeData.info.map((shop, index) => (
            <CircleMarker key={index} center={[shop.center[0], shop.center[1]]} eventHandlers={{ click: () => { setSelectedShop(shop) } }}>
              <Tooltip>{shop.shopName}</Tooltip>
              {selectedShop === shop && (
                <Tooltip permanent>
                  <ul>
                    <h id="shopName">{shop.shopName}</h>
                    <li>{shop.region}</li>
                    {(shop.dripPrice !== null) ? (
                      <li>Drip Price: ${shop.dripPrice.toFixed(2)}</li>
                    ) : <li>Drip Price: N/A</li>}
                    {(shop.mochaPrice !== null) ? (
                      <li>Mocha Price: ${shop.mochaPrice.toFixed(2)}</li>
                    ) : <li>Mocha Price: N/A</li>}
                    {(shop.lattePrice !== null) ? (
                      <li>Latte Price: ${shop.lattePrice.toFixed(2)}</li>
                    ) : <li>Latte Price: N/A</li>}
                    {(shop.maccPrice !== null) ? (
                      <li>Macchiato Price: ${shop.maccPrice.toFixed(2)}</li>
                    ) : <li>Macchiato Price: N/A</li>}
                    {(shop.espressoPrice !== null) ? (
                      <li>Espresso Price: ${shop.espressoPrice.toFixed(2)}</li>
                    ) : <li>Espresso Price: N/A</li>}
                    {(shop.americanPrice !== null) ? (
                      <li>Americano Price: ${shop.americanPrice.toFixed(2)}</li>
                    ) : <li>Americano Price: N/A</li>}
                    {(shop.capPrice !== null) ? (
                      <li>Cappuccino Price: ${shop.capPrice.toFixed(2)}</li>
                    ) : <li>Cappuccino Price: N/A</li>}
                  </ul>
                </Tooltip>
              )}
            </CircleMarker>
          ))}
        </MapContainer>
      </div>
      
    </div>
  );
}

export default MyMap;

export const coffeeData = {
  info: [
    {
      shopName: "Cafe Milano",
      stars: 4.2,
      address: "2522 Bancroft Way",
      region: "Southside",
      dripPrice: 2.5,
      mochaPrice: 4.5,
      lattePrice: 3.85,
      maccPrice: null,
      espressoPrice: 2.95,
      americanPrice: 3.25,
      capPrice: 4.5,
      averagePrice: 3.59,
      center: [37.8686181, -122.2611693]
    },
    {
      shopName: "Victory Point Cafe",
      stars: 4.5,
      address: "1797 Shattuck Ave. Ste A",
      region: "Northside",
      dripPrice: 3.0,
      mochaPrice: 5.25,
      lattePrice: 4.75,
      maccPrice: 4.0,
      espressoPrice: 3.25,
      americanPrice: 3.75,
      capPrice: 4.25,
      averagePrice: 4.04,
      center: [37.8751784, -122.2710362]
    },
    {
      shopName: "Berkeley Espresso",
      stars: 3.5,
      address: "1900 Shattuck Ave.",
      region: "Northside",
      dripPrice: 2.85,
      mochaPrice: 5.35,
      lattePrice: 4.45,
      maccPrice: null,
      espressoPrice: 3.6,
      americanPrice: 3.85,
      capPrice: 4.45,
      averagePrice: 4.09,
      center: [37.8737312, -122.2713947]
    },
    {
      shopName: "MY Coffee Roastery",
      stars: 4.5,
      address: "2080 Martin Luther King Jr Way",
      region: "Downtown",
      dripPrice: null,
      mochaPrice: 5.5,
      lattePrice: 5.0,
      maccPrice: 4.5,
      espressoPrice: 3.5,
      americanPrice: 4.0,
      capPrice: 4.5,
      averagePrice: 4.5,
      center: [37.870716, -122.2780024]
    },
    {
      shopName: "Yali's Cafe",
      stars: 3.5,
      address: "1920 Oxford Street",
      region: "Northside",
      dripPrice: 2.85,
      mochaPrice: 4.75,
      lattePrice: 4.0,
      maccPrice: 3.85,
      espressoPrice: 3.25,
      americanPrice: null,
      capPrice: 3.95,
      averagePrice: 3.78,
      center: [37.8734824, -122.2689829]
    },
    {
      shopName: "MIND Coffee",
      stars: 4.5,
      address: "1816 Euclid Ave",
      region: "Northside",
      dripPrice: 3.75,
      mochaPrice: 5.75,
      lattePrice: 5.0,
      maccPrice: 4.0,
      espressoPrice: 3.5,
      americanPrice: 4.5,
      capPrice: 4.75,
      averagePrice: 4.46,
      center: [37.8757876, -122.2631173]
    },
    {
      shopName: "Blue Bottle Coffee",
      stars: 4.0,
      address: "2118 University Ave. #1026",
      region: "Downtown",
      dripPrice: 5.0,
      mochaPrice: 7.0,
      lattePrice: 6.0,
      maccPrice: null,
      espressoPrice: 4.0,
      americanPrice: null,
      capPrice: 5.75,
      averagePrice: 5.55,
      center: [37.8720931, -122.2702082]
    },
    {
      shopName: "K's Coffee House",
      stars: 3.5,
      address: "2002 Center St.",
      region: "Downtown",
      dripPrice: 2.95,
      mochaPrice: 5.5,
      lattePrice: 4.5,
      maccPrice: 3.75,
      espressoPrice: 3.75,
      americanPrice: 3.75,
      capPrice: 4.5,
      averagePrice: 4.1,
      center: [37.8699343, -122.2750436]
    },
    {
      shopName: "Coffee Hut",
      stars: 5.0,
      address: "2170 Shattuck Ave",
      region: "Downtown",
      dripPrice: 2.75,
      mochaPrice: 5.25,
      lattePrice: 4.75,
      maccPrice: 3.75,
      espressoPrice: 3.5,
      americanPrice: 3.75,
      capPrice: 4.25,
      averagePrice: 4.0,
      center: [37.8698659, -122.2709325]
    },
    {
      shopName: "One Plus",
      stars: 4.5,
      address: "2161 Allston Way ste C",
      region: "Downtown",
      dripPrice: 5.5,
      mochaPrice: 6.5,
      lattePrice: 5.5,
      maccPrice: 4.25,
      espressoPrice: 4.0,
      americanPrice: 4.25,
      capPrice: 4.75,
      averagePrice: 4.96,
      center: [37.8698547, -122.2690049]
    },
    {
      shopName: "Abe's Cafe",
      stars: 4.5,
      address: "1842 Euclid Ave.",
      region: "Northside",
      dripPrice: 3.0,
      mochaPrice: 5.0,
      lattePrice: 4.75,
      maccPrice: 2.75,
      espressoPrice: 2.75,
      americanPrice: 3.0,
      capPrice: 3.75,
      averagePrice: 3.54,
      center: [37.8755258, -122.2629958]
    },
    {
      shopName: "Northside Cafe",
      stars: 3.5,
      address: "1878 Euclid Ave.",
      region: "Northside",
      dripPrice: 3.0,
      mochaPrice: 4.8,
      lattePrice: 4.75,
      maccPrice: 3.4,
      espressoPrice: 3.4,
      americanPrice: null,
      capPrice: 4.75,
      averagePrice: 4.02,
      center: [37.8752072, -122.2628749]
    },
    {
      shopName: "V&A Cafe",
      stars: 3.4,
      address: "2521 Hearst Ave",
      region: "Northside",
      dripPrice: 2.25,
      mochaPrice: 4.0,
      lattePrice: 3.75,
      maccPrice: null,
      espressoPrice: 2.25,
      americanPrice: 3.0,
      capPrice: 3.0,
      averagePrice: 3.04,
      center: [37.8756668, -122.2618554]
    },
    {
      shopName: "Yali's Qualcomm Cafe",
      stars: 4.3,
      address: "2594 Hearst Ave",
      region: "Northside",
      dripPrice: 2.85,
      mochaPrice: 4.5,
      lattePrice: 4.0,
      maccPrice: 3.5,
      espressoPrice: 2.5,
      americanPrice: 3.0,
      capPrice: 3.95,
      averagePrice: 3.47,
      center: [37.8747965, -122.2631813]
    },
    {
      shopName: "Cabanas Cafe",
      stars: null,
      address: "1878 Euclid Ave",
      region: "Northside",
      dripPrice: 3.25,
      mochaPrice: 3.99,
      lattePrice: 4.99,
      maccPrice: null,
      espressoPrice: 3.5,
      americanPrice: 3.5,
      capPrice: 3.99,
      averagePrice: 3.87,
      center: [37.8752072, -122.2628749]
    },
    {
      shopName: "Mind Coffee",
      stars: 4.7,
      address: "1816 Euclid Ave",
      region: "Northside",
      dripPrice: 3.75,
      mochaPrice: 5.75,
      lattePrice: 5.0,
      maccPrice: 4.0,
      espressoPrice: 3.5,
      americanPrice: 4.5,
      capPrice: 4.75,
      averagePrice: 4.46,
      center: [37.8757833, -122.2654133]
    },
    {
      shopName: "1951 Coffee Company",
      stars: 4.7,
      address: "2410 Channing Way",
      region: "Southside",
      dripPrice: 3.0,
      mochaPrice: 5.75,
      lattePrice: 5.25,
      maccPrice: 4.75,
      espressoPrice: 3.75,
      americanPrice: 4.0,
      capPrice: 5.0,
      averagePrice: 4.5,
      center: [37.8666475, -122.2625535]
    },
    {
      shopName: "Romeo's Coffee",
      stars: 4.1,
      address: "2499 Telegraph Ave",
      region: "Southside",
      dripPrice: null,
      mochaPrice: null,
      lattePrice: 4.5,
      maccPrice: 3.5,
      espressoPrice: 3.0,
      americanPrice: 3.5,
      capPrice: 4.0,
      averagePrice: 3.7,
      center: [37.8653383, -122.2608961]
    },
    {
      shopName: "The Coffee Lab",
      stars: 4.6,
      address: "Hildebrand Hall",
      region: "Campus",
      dripPrice: 3.0,
      mochaPrice: 6.0,
      lattePrice: 5.0,
      maccPrice: 4.0,
      espressoPrice: 4.0,
      americanPrice: 4.0,
      capPrice: 5.0,
      averagePrice: 4.43,
      center: [37.872789, -122.2583994]
    },
    {
      shopName: "Cafe Think",
      stars: 4.2,
      address: "2220 Piedmont Ave",
      region: "Campus",
      dripPrice: 2.15,
      mochaPrice: null,
      lattePrice: null,
      maccPrice: null,
      espressoPrice: null,
      americanPrice: 2.85,
      capPrice: null,
      averagePrice: 2.5,
      center: [37.872328, -122.2567669]
    },
    {
      shopName: "edmonds cafe",
      stars: 4.0,
      address: "2299 Piedmont Ave",
      region: "Northside",
      dripPrice: 2.25,
      mochaPrice: 4.5,
      lattePrice: 4.25,
      maccPrice: 4.5,
      espressoPrice: 3.0,
      americanPrice: 3.0,
      capPrice: 3.5,
      averagePrice: 3.57,
      center: [37.8696601, -122.2540053]
    },
    {
      shopName: "Guerilla Cafe",
      stars: 4.5,
      address: "1620 Shattuck Ave",
      region: "Northside",
      dripPrice: 2.65,
      mochaPrice: 5.25,
      lattePrice: 4.25,
      maccPrice: 3.5,
      espressoPrice: 2.95,
      americanPrice: 3.0,
      capPrice: 3.95,
      averagePrice: 3.65,
      center: [37.8776196, -122.2733259]
    }
  ]
};

export const averageData = [
  {
    coffeeName: "drip",
    averagePrice: 3.12
  },
  {
    coffeeName: "mocha",
    averagePrice: 5.24
  },
  {
    coffeeName: "latte",
    averagePrice: 4.73
  },
  {
    coffeeName: "macchiato",
    averagePrice: 4.0
  },
  {
    coffeeName: "espresso",
    averagePrice: 3.33
  },
  {
    coffeeName: "americano",
    averagePrice: 3.6
  },
  {
    coffeeName: "cappuccino",
    averagePrice: 4.34
  }
];
