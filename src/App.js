import './App.css';
import React from "react";
import { useEffect, useState } from "react";
import { MapContainer, TileLayer, useMap, CircleMarker, Tooltip } from 'react-leaflet'
import 'leaflet/dist/leaflet.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar as solidStar } from '@fortawesome/free-solid-svg-icons'
import { faStar as regularStar } from '@fortawesome/free-regular-svg-icons'
import { faStarHalf as solidStarHalf } from '@fortawesome/free-solid-svg-icons'

function StarRating({rating}) {
  const stars = [];

  for (let i = 1; i <= 5; i++) {
    if (rating >= i) {
      stars.push(<FontAwesomeIcon icon={solidStar} key={i} />);
    } else if (rating >= i - 0.5) {
      stars.push(<div className="star-icon" key={i}>
                   <FontAwesomeIcon icon={regularStar}/>
                   <FontAwesomeIcon icon={solidStarHalf}className="half-star" />
                 </div>);
    } else {
      stars.push(<FontAwesomeIcon icon={regularStar} key={i}/>);
    }
  }

  return (
    <div>{stars}</div>
  );
}

function GradientBar() {
  return (
    <div style={{ borderRadius: '20px', height: '20px', background: 'linear-gradient(to right, rgba(121, 64, 6, 0.25), rgba(121, 64, 6, 0.9))', margin: '10px 0'}}></div>
  );
}

function Legend() {
  return (
    <div style={{ padding: '10px', backgroundColor: 'white', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
      <p className="pLevels" style={{ margin: 0 }}>Price Level:</p>
      <GradientBar />
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <p className="pLevels" style={{ margin: 0 }}>Less expensive</p>
        <p className="pLevels" style={{ margin: 0 }}>More expensive</p>
      </div>
    </div>
  );
}

const ResetZoomButton = () => {
  const map = useMap();

  const resetZoom = () => {
    map.setView([averageLatitude, averageLongitude], 16);
  };

  return (
    <button onClick={resetZoom} className="reset-button">
      Reset Map
    </button>
  );
};

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
    map.flyTo([averageLatitude, averageLongitude], 16, {
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
  })

  return null;
};

function MyMap() {
  const [selectedShop, setSelectedShop] = useState(null);

  const sortedShops = [...coffeeData.info].sort((a, b) => b.stars - a.stars);

  return (
    <div style={{ display: "flex" }}>
      <div className="sidebar">
        <Legend />
        {sortedShops.map((shop, index) => (
          <div key={index} className="coffee-shop" onClick={() => setSelectedShop(shop)}>
            <p className="shopNamez">{shop.shopName}</p>
            <StarRating rating={shop.stars} />
            <p className="coffee-address">{shop.address}</p>
          </div>
        ))}
      </div>
      <div className="map-container">
        <MapContainer className="map" center={[37.8686181, -122.2611693]} zoom={15}>
          <MapController selectedShop={selectedShop} />
          <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}.png" />
          {coffeeData.info.map((shop, index) => {
            const minOpacity = 0.15;
            const maxOpacity = 0.9;
            const t = (shop.avgPrice - minPrice) / (maxPrice - minPrice);
            const opacity = minOpacity + t * (maxOpacity - minOpacity);

            return (
              <CircleMarker key={index} center={[shop.center[0], shop.center[1]]} eventHandlers={{ click: () => { setSelectedShop(shop) } }}
              pathOptions={{ 
                color: '#794006',
                fillColor: '#794006', 
                fillOpacity: opacity 
              }}
              >
                <Tooltip className="customTooltip">{shop.shopName}</Tooltip>
                {selectedShop === shop && (
                  <Tooltip className="customTooltip" permanent>
                      <h className="shopName">{shop.shopName}</h>
                      {shop.dripPrice !== null && <li>Drip: ${shop.dripPrice.toFixed(2)}</li>}
                      {shop.mochaPrice !== null && <li>Mocha: ${shop.mochaPrice.toFixed(2)}</li>}
                      {shop.lattePrice !== null && <li>Latte: ${shop.lattePrice.toFixed(2)}</li>}
                      {shop.espressoPrice !== null && <li>Espresso: ${shop.espressoPrice.toFixed(2)}</li>}
                      {shop.americanPrice !== null && <li>Americano: ${shop.americanPrice.toFixed(2)}</li>}
                      {shop.capPrice !== null && <li>Cappuccino: ${shop.capPrice.toFixed(2)}</li>}
                  </Tooltip>
                )}
              </CircleMarker>
            );
          })}
          <ResetZoomButton />
        </MapContainer>
      </div>
      
    </div>
  );
}


export default MyMap;

function calculateAveragePrice(shop) {
  const prices = [shop.dripPrice, shop.mochaPrice, shop.lattePrice, shop.maccPrice, shop.espressoPrice, shop.americanPrice, shop.capPrice];
  const validPrices = prices.filter(price => price !== null);
  const sum = validPrices.reduce((a, b) => a + b, 0);
  const avg = sum / validPrices.length;
  return avg;
}

let minPrice = Infinity;
let maxPrice = -Infinity;

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
      center: [37.86886795840184, -122.25861586074959]
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
      center: [37.87532661035478, -122.26841838773299]
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
      center: [37.873904820217525, -122.26881980307725]
      
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
      center: [37.870898196797484, -122.27314223191333]
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
      center: [37.873622144878446, -122.26638654540514]
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
      center: [37.87596121525255, -122.26056386074929]
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
      center: [37.87224124444384, -122.26761186312159]
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
      center: [37.87008262120727, -122.2702048895855]
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
      center: [37.87004799894777, -122.26836833191352]
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
      center: [37.86997751315889, -122.26639781656942]
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
      center: [37.875665540884434, -122.260367258897]
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
      center: [37.875363879082414, -122.26034291842132]
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
      center: [37.87550981634244, -122.25901613191327]
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
      center: [37.87490892437576, -122.25876253191329]
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
      center: [37.87537234786859, -122.26031073191321]
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
      center: [37.875952746534104, -122.26056386074929]
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
      center: [37.866838076854464, -122.25992495889744]
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
      center: [37.86551334047612, -122.25838267609379]
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
      center: [37.87249682257104, -122.2556421128647]
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
      center: [37.872484685372015, -122.25419200307732]
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
      center: [37.86982595229813, -122.25200867424137]
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
      center: [37.87798489385365, -122.2691856300609]
    }
  ].map(shop => {
    const avgPrice = calculateAveragePrice(shop);
    minPrice = Math.min(minPrice, avgPrice);
    maxPrice = Math.max(maxPrice, avgPrice);
    return {...shop, avgPrice};
  })
};

const latitudes = coffeeData.info.map(shop => shop.center[0]);
const longitudes = coffeeData.info.map(shop => shop.center[1]);
const averageLatitude = latitudes.reduce((sum, lat) => sum + lat, 0) / latitudes.length;
const averageLongitude = longitudes.reduce((sum, lon) => sum + lon, 0) / longitudes.length;

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
