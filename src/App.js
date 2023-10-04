import './App.css';
import React from "react";
import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, CartesianGrid, Legend, Tooltip as RechartsTooltip } from "recharts";
import { MapContainer, TileLayer, useMap, CircleMarker, Tooltip as LeafletTooltip} from 'react-leaflet'
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

function GradientLegend() {
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

// function HorizontalBarChart({ coffeeData }) {
//   return (
//     <ResponsiveContainer height={400}>
//     <BarChart
//       width={1600}
//       height={800}
//       data={coffeeData}
//       layout="vertical" // this makes the bar chart horizontal 
//       margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
//     >
//       <CartesianGrid strokeDasharray="3 3" />
//       <XAxis />
//       <YAxis dataKey="shopName" />
//       <RechartsTooltip />
//       <Legend />
//       <Bar dataKey="averagePrice" fill="#A04006" name="Average Price" />
//     </BarChart>
//     </ResponsiveContainer>
//   );
// }

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
        <GradientLegend />
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
                <LeafletTooltip className="customTooltip">{shop.shopName}</LeafletTooltip>
                {selectedShop === shop && (
                  <LeafletTooltip className="customTooltip" permanent>
                      <h className="shopName">{shop.shopName}</h>
                      {shop.dripPrice !== null && <li>Drip: ${shop.dripPrice.toFixed(2)}</li>}
                      {shop.mochaPrice !== null && <li>Mocha: ${shop.mochaPrice.toFixed(2)}</li>}
                      {shop.lattePrice !== null && <li>Latte: ${shop.lattePrice.toFixed(2)}</li>}
                      {shop.espressoPrice !== null && <li>Espresso: ${shop.espressoPrice.toFixed(2)}</li>}
                      {shop.americanPrice !== null && <li>Americano: ${shop.americanPrice.toFixed(2)}</li>}
                      {shop.capPrice !== null && <li>Cappuccino: ${shop.capPrice.toFixed(2)}</li>}
                  </LeafletTooltip>
                )}
              </CircleMarker>
            );
          })}
          <ResetZoomButton />
        </MapContainer>
      </div>
      {/* <div>
      <HorizontalBarChart coffeeShops={coffeeData.info} />
      </div> */}

<div style={{ 
        display: "block",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
        left: "20px"
      }}>
    <div>
      <h4>Average Coffee Price</h4>
    </div>

    <ResponsiveContainer height={400}>
      <BarChart
        width={500}
        height={300}
        data={sortedData}
        layout="vertical"
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="number" />
        <YAxis dataKey="shopName" type="category" tick={{ fontSize: 10 }} />
        <RechartsTooltip />
        <Bar dataKey="averagePrice" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
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
      dripPrice: 2.95,
      mochaPrice: 4.50,
      lattePrice: 3.95,
      maccPrice: 3.65,
      espressoPrice: 2.95,
      americanPrice: 3.25,
      capPrice: 4.50,
      averagePrice: 3.68,
      center: [37.86886795840184, -122.25861586074959]
    },
    {
      shopName: "Victory Point Cafe",
      stars: 4.7,
      address: "1797 Shattuck Ave. Ste A",
      region: "Northside",
      dripPrice: 3.25,
      mochaPrice: 5.60,
      lattePrice: 5.00,
      maccPrice: 4.00,
      espressoPrice: 3.50,
      americanPrice: 4.00,
      capPrice: 4.50,
      averagePrice: 4.26,
      center: [37.87532661035478, -122.26841838773299]
    },
    {
      shopName: "Berkeley Espresso",
      stars: 4.2,
      address: "1900 Shattuck Ave.",
      region: "Northside",
      dripPrice: 2.85,
      mochaPrice: 5.05,
      lattePrice: 4.45,
      maccPrice: 2.85,
      espressoPrice: 2.35,
      americanPrice: 3.85,
      capPrice: 4.45,
      averagePrice: 3.69,
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
      stars: 4.2,
      address: "1920 Oxford Street",
      region: "Northside",
      dripPrice: 2.85,
      mochaPrice: 4.75,
      lattePrice: 4.0,
      maccPrice: 3.85,
      espressoPrice: 3.25,
      americanPrice: 3.15,
      capPrice: 3.95,
      averagePrice: 3.69,
      center: [37.873622144878446, -122.26638654540514]
    },
    {
      shopName: "MIND Coffee",
      stars: 4.8,
      address: "1816 Euclid Ave",
      region: "Northside",
      dripPrice: 3.75,
      mochaPrice: 5.75,
      lattePrice: 5.00,
      maccPrice: 4.00,
      espressoPrice: 3.50,
      americanPrice: 4.50,
      capPrice: 4.75,
      averagePrice: 4.46,
      center: [37.87596121525255, -122.26056386074929]
    },
    {
      shopName: "Blue Bottle Coffee",
      stars: 4.4,
      address: "2118 University Ave. #1026",
      region: "Downtown",
      dripPrice: null,
      mochaPrice: 7.25,
      lattePrice: 6.25,
      maccPrice: null,
      espressoPrice: 4.00,
      americanPrice: null,
      capPrice: 6.00,
      averagePrice: 5.88,
      center: [37.87224124444384, -122.26761186312159]
    },
    {
      shopName: "K's Coffee House",
      stars: 4.5,
      address: "2002 Center St.",
      region: "Downtown",
      dripPrice: 3.00,
      mochaPrice: 5.25,
      lattePrice: 4.75,
      maccPrice: 3.75,
      espressoPrice: 3.50,
      americanPrice: 3.75,
      capPrice: 4.75,
      averagePrice: 4.11,
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
      maccPrice: null,
      espressoPrice: 3.50,
      americanPrice: 4.00,
      capPrice: 4.25,
      averagePrice: 4.08,
      center: [37.87004799894777, -122.26836833191352]
    },
    {
      shopName: "One Plus",
      stars: 4.2,
      address: "2161 Allston Way Ste C",
      region: "Downtown",
      dripPrice: 5.50,
      mochaPrice: 6.50,
      lattePrice: 5.50,
      maccPrice: 4.25,
      espressoPrice: 4.00,
      americanPrice: 4.25,
      capPrice: 4.75,
      averagePrice: 4.96,
      center: [37.86997751315889, -122.26639781656942]
    },
    {
      shopName: "Peet's Coffee",
      stars: 4.2,
      address: "2255 Shattuck Ave",
      region: "Downtown",
      dripPrice: 3.30,
      mochaPrice: 5.55,
      lattePrice: 5.10,
      maccPrice: 5.80,
      espressoPrice: 3.60,
      americanPrice: 4.60,
      capPrice: 4.95,
      averagePrice: 4.70,
      center: [37.8684539, -122.2676041]
    },
    {
      shopName: "Sasha Coffee",
      stars: 5.0,
      address: "2023 Center St",
      region: "Downtown",
      dripPrice: 3.25,
      mochaPrice: 5.50,
      lattePrice: 5.25,
      maccPrice: 4.00,
      espressoPrice: 3.50,
      americanPrice: 3.50,
      capPrice: 4.75,
      averagePrice: 4.25,
      center: [37.870288, -122.2699063]
    },
    {
      shopName: "Abe's Cafe",
      stars: 4.8,
      address: "1842 Euclid Ave.",
      region: "Northside",
      dripPrice: 3.0,
      mochaPrice: 4.75,
      lattePrice: 4.50,
      maccPrice: 2.75,
      espressoPrice: 2.50,
      americanPrice: 3.00,
      capPrice: 3.25,
      averagePrice: 3.39,
      center: [37.875665540884434, -122.260367258897]
    },
    {
      shopName: "Northside Cafe",
      stars: 4.1,
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
      dripPrice: 3.50,
      mochaPrice: 4.25,
      lattePrice: 4.00,
      maccPrice: 2.50,
      espressoPrice: 2.75,
      americanPrice: 3.75,
      capPrice: 3.75,
      averagePrice: 3.50,
      center: [37.87550981634244, -122.25901613191327]
    },
    {
      shopName: "Yali's Qualcomm Cafe",
      stars: 4.3,
      address: "2594 Hearst Ave",
      region: "Campus",
      dripPrice: 2.85,
      mochaPrice: 4.75,
      lattePrice: 4.00,
      maccPrice: 3.50,
      espressoPrice: 2.50,
      americanPrice: 3.15,
      capPrice: 3.95,
      averagePrice: 3.53,
      center: [37.87490892437576, -122.25876253191329]
    },
    {
      shopName: "Free Speech Movement Cafe",
      stars: 4.3,
      address: "University Drive, 3rd Floor",
      region: "Campus",
      dripPrice: 2.55,
      mochaPrice: 4.95,
      lattePrice: 4.55,
      maccPrice: null,
      espressoPrice: 2.75,
      americanPrice: 3.35,
      capPrice: 3.75,
      averagePrice: 3.65,
      center: [37.8725738, -122.260848]
    },
    {
      shopName: "Cabanas Cafe",
      stars: 3.8,
      address: "1878 Euclid Ave",
      region: "Northside",
      dripPrice: 3.25,
      mochaPrice: 4.99,
      lattePrice: 3.99,
      maccPrice: null,
      espressoPrice: 2.75,
      americanPrice: 3.50,
      capPrice: 3.99,
      averagePrice: 3.75,
      center: [37.87537234786859, -122.26031073191321]
    },
    {
      shopName: "Brown's California Cafe",
      stars: 3.8,
      address: "2255 Hearst Ave",
      region: "Campus",
      dripPrice: 3.45,
      mochaPrice: 5.70,
      lattePrice: 5.25,
      maccPrice: 5.95,
      espressoPrice: 3.75,
      americanPrice: 4.75,
      capPrice: 5.10,
      averagePrice: 4.85,
      center: [37.8733778, -122.2648111]
    },
    {
      shopName: "Press",
      stars: 4.0,
      address: "University Drive, 1st Floor",
      region: "Campus",
      dripPrice: 2.25,
      mochaPrice: 4.60,
      lattePrice: 4.35,
      maccPrice: null,
      espressoPrice: 2.50,
      americanPrice: 3.10,
      capPrice: 3.40,
      averagePrice: 3.37,
      center: [37.872752, -122.260394]
    },
    {
      shopName: "Mind Coffee",
      stars: 4.8,
      address: "1816 Euclid Ave",
      region: "Northside",
      dripPrice: 3.75,
      mochaPrice: 5.75,
      lattePrice: 5.00,
      maccPrice: 4.00,
      espressoPrice: 3.50,
      americanPrice: 4.50,
      capPrice: 4.75,
      averagePrice: 4.46,
      center: [37.875952746534104, -122.26056386074929]
    },
    {
      shopName: "Goldie's",
      stars: 4.5,
      address: "2495 Bancroft Way",
      region: "Campus",
      dripPrice: 2.70,
      mochaPrice: 4.70,
      lattePrice: 4.25,
      maccPrice: 5.05,
      espressoPrice: 2.55,
      americanPrice: 3.55,
      capPrice: 4.05,
      averagePrice: 3.84,
      center: [37.8690016, -122.2593743]
    },
    {
      shopName: "Sodoi Coffee Tasting House",
      stars: 4.6,
      address: "2438 Durant Ave",
      region: "Southside",
      dripPrice: 4.70,
      mochaPrice: 4.95,
      lattePrice: 4.45,
      maccPrice: 4.95,
      espressoPrice: 2.95,
      americanPrice: 3.75,
      capPrice: 3.95,
      averagePrice: 4.24,
      center: [37.8673991, -122.259533]
    },
    {
      shopName: "1951 Coffee Company",
      stars: 4.7,
      address: "2410 Channing Way",
      region: "Southside",
      dripPrice: 3.0,
      mochaPrice: 5.75,
      lattePrice: 5.25,
      maccPrice: 4.50,
      espressoPrice: 3.75,
      americanPrice: 4.00,
      capPrice: 5.00,
      averagePrice: 4.46,
      center: [37.866838076854464, -122.25992495889744]
    },
    {
      shopName: "Romeo's Coffee",
      stars: 4.1,
      address: "2499 Telegraph Ave",
      region: "Southside",
      dripPrice: null,
      mochaPrice: null,
      lattePrice: 4.50,
      maccPrice: 3.50,
      espressoPrice: 3.00,
      americanPrice: 3.50,
      capPrice: 4.50,
      averagePrice: 3.80,
      center: [37.86551334047612, -122.25838267609379]
    },
    {
      shopName: "The Coffee Lab",
      stars: 4.6,
      address: "Hildebrand Hall",
      region: "Campus",
      dripPrice: 3.50,
      mochaPrice: 6.00,
      lattePrice: 5.00,
      maccPrice: 3.00,
      espressoPrice: 3.00,
      americanPrice: 4.00,
      capPrice: 4.00,
      averagePrice: 4.07,
      center: [37.8727848, -122.2558245]
    },
    {
      shopName: "Cafe Think",
      stars: 4.2,
      address: "2220 Piedmont Ave",
      region: "Campus",
      dripPrice: 2.35,
      mochaPrice: 3.95,
      lattePrice: 3.95,
      maccPrice: null,
      espressoPrice: 3.95,
      americanPrice: 3.15,
      capPrice: 3.95,
      averagePrice: 3.55,
      center: [37.872484685372015, -122.25419200307732]
    },
    {
      shopName: "Starbucks",
      stars: 4.0,
      address: "2224 Shattuck Ave",
      region: "Downtown",
      dripPrice: 3.25,
      mochaPrice: 5.45,
      lattePrice: 4.75,
      maccPrice: 5.45,
      espressoPrice: 4.45,
      americanPrice: 3.95,
      capPrice: 4.75,
      averagePrice: 4.58,
      center: [37.8688014, -122.2682487]
    },
    {
      shopName: "Starbucks",
      stars: 3.7,
      address: "1444 Shattuck Place",
      region: "Northside",
      dripPrice: 3.45,
      mochaPrice: 5.65,
      lattePrice: 4.95,
      maccPrice: 5.65,
      espressoPrice: 4.65,
      americanPrice: 4.15,
      capPrice: 4.95,
      averagePrice: 4.78,
      center: [37.880779, -122.270055]
    },
    {
      shopName: "Golden Bear Cafe",
      stars: 3.7,
      address: "2 Sather Rd",
      region: "Campus",
      dripPrice: 3.45,
      mochaPrice: 5.70,
      lattePrice: 5.25,
      maccPrice: 5.95,
      espressoPrice: 3.75,
      americanPrice: 4.75,
      capPrice: 5.10,
      averagePrice: 4.85,
      center: [37.8698436, -122.2596451]
    },
    {
      shopName: "Peet's Coffee",
      stars: 4.3,
      address: "2501 Telegraph Ave",
      region: "Southside",
      dripPrice: 3.35,
      mochaPrice: 5.60,
      lattePrice: 5.15,
      maccPrice: 5.85,
      espressoPrice: 3.65,
      americanPrice: 4.65,
      capPrice: 5.00,
      averagePrice: 4.75,
      center: [37.865053, -122.258319]
    },
    {
      shopName: "Caffe Strada",
      stars: 4.3,
      address: "2300 College Ave",
      region: "Southside",
      dripPrice: null,
      mochaPrice: 4.95,
      lattePrice: 4.75,
      maccPrice: null,
      espressoPrice: 2.95,
      americanPrice: 3.45,
      capPrice: 3.75,
      averagePrice: 3.97,
      center: [37.869146, -122.254859]
    },
    {
      shopName: "edmonds cafe",
      stars: 4.0,
      address: "2299 Piedmont Ave",
      region: "Southside",
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
      dripPrice: 3.00,
      mochaPrice: 6.00,
      lattePrice: 5.50,
      maccPrice: 4.25,
      espressoPrice: 3.75,
      americanPrice: 4.00,
      capPrice: 4.95,
      averagePrice: 4.49,
      center: [37.87798489385365, -122.2691856300609]
    },
    {
      shopName: "Kiklo",
      stars: null,
      address: "Stanley Hall",
      region: "Campus",
      dripPrice: 3.50,
      mochaPrice: 4.25,
      lattePrice: 4.00,
      maccPrice: 2.75,
      espressoPrice: 2.75,
      americanPrice: 3.75,
      capPrice: 3.75,
      averagePrice: 3.54,
      center: [37.873851, -122.2563984]
    },
    {
      shopName: "Cafenated Coffee Company",
      stars: 4.3,
      address: "2085 Vine St",
      region: "Northside",
      dripPrice: 4.00,
      mochaPrice: 6.00,
      lattePrice: 5.50,
      maccPrice: null,
      espressoPrice: 4.00,
      americanPrice: null,
      capPrice: 4.75,
      averagePrice: 4.85,
      center: [37.8803291, -122.2699044]
    },
    {
      shopName: "The Musical Offering Cafe~Bistro",
      stars: 4.5,
      address: "2430 Bancroft Way",
      region: "Southside",
      dripPrice: 3.75,
      mochaPrice: 5.75,
      lattePrice: 4.75,
      maccPrice: null,
      espressoPrice: 3.75,
      americanPrice: 4.00,
      capPrice: 5.00,
      averagePrice: 4.50,
      center: [37.8683124, -122.2607224]
    },
    {
      shopName: "Mudraker's Cafe",
      stars: 4.1,
      address: "2801 Bancroft Way",
      region: "Southside",
      dripPrice: 2.75,
      mochaPrice: 4.60,
      lattePrice: 4.35,
      maccPrice: 4.00,
      espressoPrice: 3.00,
      americanPrice: 4.00,
      capPrice: 4.00,
      averagePrice: 3.81,
      center: [37.8596604, -122.2598045]
    },
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

const sortedData = coffeeData.info.sort(
  (a, b) => b.averagePrice - a.averagePrice
);
