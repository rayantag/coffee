import './App.css';
import React from "react";
import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, CartesianGrid, Tooltip as RechartsTooltip } from "recharts";
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

const ResetZoomButton = () => {
  const map = useMap();

  const resetZoom = () => {
    if (map && averageLatitude != null && averageLongitude != null) {
      map.setView([averageLatitude, averageLongitude], 16);
    }
  };

  return (
    <button onClick={resetZoom} className="reset-button">
      Reset Map
    </button>
  );
};

const MapController = ({ selectedShop }) => {
  const map = useMap();
  const flyToDuration = 1.5;

  useEffect(() => {
    if (selectedShop && map) {
      const location = [selectedShop.center[0], selectedShop.center[1]];
      map.flyTo(location, 18, {
        animate: true,
        duration: flyToDuration,
      });
    }
  }, [selectedShop, map]);

  return null;
};


function MyMap() {
  const [selectedShop, setSelectedShop] = useState(null);

  const sortedShops = [...coffeeData.info].sort((a, b) => b.stars - a.stars);

  return (
    <div>
      <div style={{ 
      display: "flex",
      alignItems: "flex-start",
      justifyContent: "space-between"
      }}>
      <div className="sidebar"> 
        <GradientLegend />
        {sortedShops.map((shop, index) => (
          <div key={index} className="coffee-shop" onClick={() => { 
            setSelectedShop(shop)}}>
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
              <CircleMarker key={index} center={[shop.center[0], shop.center[1]]} eventHandlers={{ click: () => { 
                setSelectedShop(shop) } }}
              pathOptions={{ 
                color: '#794006',
                fillColor: '#794006', 
                fillOpacity: opacity 
              }}
              >
                <LeafletTooltip className="customTooltip">{shop.shopName}</LeafletTooltip>
                {selectedShop === shop && (
                  <LeafletTooltip className="customTooltip" permanent>
                      <h3 className="shopName">{shop.shopName}</h3>
                      {console.log("selected shop: " + selectedShop.shopName)}
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
      </div>

<div style={{
        display: "block",
        marginTop: "auto",
        left: "20px"
      }}>
    
      <h4>Average Coffee Price</h4>
    

    <ResponsiveContainer height={1000}>
      <BarChart
        width={500}
        height={1000}
        data={sortedData}
        layout="vertical"
        margin={{
          top: 5,
          right: 30,
          left: 50,
          bottom: 5
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="number" />
        <YAxis dataKey="shopName" type="category" tick={{ fontSize: 8 }} />
        <RechartsTooltip />
        <Bar dataKey="averagePrice" name="Average Price" fill="#8884d8" />
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
      dripPrice: 3.95,
      mochaPrice: 4.75,
      lattePrice: 4.75,
      maccPrice: null,
      espressoPrice: 4.75,
      americanPrice: 4.75,
      capPrice: 4.75,
      averagePrice: 4.62,
      center: [37.86886795840184, -122.25861586074959]
    },
    {
      shopName: "Peet's Coffee",
      stars: 4.2,
      address: "2255 Shattuck Ave.",
      region: "Downtown",
      dripPrice: 3.30,
      mochaPrice: 5.55,
      lattePrice: 5.10,
      maccPrice: 5.80,
      espressoPrice: 3.60,
      americanPrice: 4.60,
      capPrice: 4.95,
      averagePrice: 4.70,
      center: [37.86849913735447, -122.26747120341723]
    },
    {
      shopName: "Victory Point Cafe",
      stars: 4.7,
      address: "1797 Shattuck Ave. Ste A",
      region: "Northside",
      dripPrice: 3.5,
      mochaPrice: 5.60,
      lattePrice: 5.00,
      maccPrice: 4.00,
      espressoPrice: 3.50,
      americanPrice: 4.00,
      capPrice: 4.50,
      averagePrice: 4.30,
      center: [37.87532661035478, -122.26841838773299]
    },
    {
      shopName: "Berkeley Espresso",
      stars: 4.2,
      address: "1900 Shattuck Ave.",
      region: "Northside",
      dripPrice: 2.35,
      mochaPrice: 4.65,
      lattePrice: 4.50,
      maccPrice: 2.85,
      espressoPrice: 2.45,
      americanPrice: 2.95,
      capPrice: 4.00,
      averagePrice: 3.39,
      center: [37.873904820217525, -122.26881980307725]
      
    },
    {
      shopName: "MY Coffee Roastery",
      stars: 4.5,
      address: "2080 Martin Luther King Jr Way",
      region: "Downtown",
      dripPrice: null,
      mochaPrice: 6.50,
      lattePrice: 5.50,
      maccPrice: null,
      espressoPrice: 4.00,
      americanPrice: 4.50,
      capPrice: 5.00,
      averagePrice: 5.10,
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
      capPrice: 3.35,
      averagePrice: 3.41,
      center: [37.873622144878446, -122.26638654540514]
    },
    {
      shopName: "MIND Coffee",
      stars: 4.8,
      address: "1816 Euclid Ave.",
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
      dripPrice: 5.5,
      mochaPrice: 7.25,
      lattePrice: 6.25,
      maccPrice: null,
      espressoPrice: 4.00,
      americanPrice: null,
      capPrice: 6.00,
      averagePrice: 5.80,
      center: [37.87224124444384, -122.26761186312159]
    },
    {
      shopName: "K's Coffee House",
      stars: 4.5,
      address: "2002 Center St.",
      region: "Downtown",
      dripPrice: 3,
      mochaPrice: 5.25,
      lattePrice: 4.75,
      maccPrice: 3.75,
      espressoPrice: 3.5,
      americanPrice: 3.75,
      capPrice: 4.75,
      averagePrice: 4.11,
      center: [37.87008262120727, -122.2702048895855]
    },
    {
      shopName: "Coffee Hut",
      stars: 5.0,
      address: "2170 Shattuck Ave.",
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
      shopName: "Sasha Coffee",
      stars: 5.0,
      address: "2023 Center St.",
      region: "Downtown",
      dripPrice: 3.25,
      mochaPrice: 5.50,
      lattePrice: 5.25,
      maccPrice: 4.00,
      espressoPrice: 3.50,
      americanPrice: 3.50,
      capPrice: 4.75,
      averagePrice: 4.25,
      center: [37.870355726891695, -122.26990630341726]
    },
    {
      shopName: "Abe's Cafe",
      stars: 4.8,
      address: "1842 Euclid Ave.",
      region: "Northside",
      dripPrice: 3.25,
      mochaPrice: 5.00,
      lattePrice: 4.75,
      maccPrice: 3.00,
      espressoPrice: 2.75,
      americanPrice: 3.00,
      capPrice: 3.50,
      averagePrice: 3.61,
      center: [37.875665540884434, -122.260367258897]
    },
    {
      shopName: "V&A Cafe",
      stars: 3.4,
      address: "2521 Hearst Ave.",
      region: "Northside",
      dripPrice: 3.5,
      mochaPrice: 4.25,
      lattePrice: 4.00,
      maccPrice: 2.5,
      espressoPrice: 2.75,
      americanPrice: 3.75,
      capPrice: 3.75,
      averagePrice: 3.67,
      center: [37.87550981634244, -122.25901613191327]
    },
    {
      shopName: "Yali's Qualcomm Cafe",
      stars: 4.3,
      address: "2594 Hearst Ave.",
      region: "Campus",
      dripPrice: 2.85,
      mochaPrice: 4.75,
      lattePrice: 4.0,
      maccPrice: 3.5,
      espressoPrice: 2.5,
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
      dripPrice: 2.75,
      mochaPrice: 5.25,
      lattePrice: 4.90,
      maccPrice: null,
      espressoPrice: 3.25,
      americanPrice: 3.55,
      capPrice: 4.50,
      averagePrice: 4.03,
      center: [37.87269226707277, -122.26088020418084]
    },
    {
      shopName: "Cabañas Cafe",
      stars: 3.8,
      address: "1878 Euclid Ave.",
      region: "Northside",
      dripPrice: 3.25,
      mochaPrice: 4.99,
      lattePrice: 3.99,
      maccPrice: null,
      espressoPrice: 2.75,
      americanPrice: 3.5,
      capPrice: 3.99,
      averagePrice: 3.75,
      center: [37.87537234786859, -122.26031073191321]
    },
    {
      shopName: "The Golden Bear Cafe",
      stars: 3.7,
      address: "2 Sather Rd.",
      region: "Campus",
      dripPrice: 3.45,
      mochaPrice: 5.70,
      lattePrice: 5.25,
      maccPrice: 5.95,
      espressoPrice: 3.75,
      americanPrice: 4.75,
      capPrice: 5.10,
      averagePrice: 4.85,
      center: [37.87002989899368, -122.25965583141792]
    },
    {
      shopName: "Brown's",
      stars: 3.8,
      address: "2255 Hearst Ave.",
      region: "Campus",
      dripPrice: 3.45,
      mochaPrice: 5.70,
      lattePrice: 5.25,
      maccPrice: 5.95,
      espressoPrice: 3.75,
      americanPrice: 4.75,
      capPrice: 5.10,
      averagePrice: 4.85,
      center: [37.87356409005464, -122.26482183141766]
    },
    {
      shopName: "Press",
      stars: 4.0,
      address: "University Drive, 1st Floor",
      region: "Campus",
      dripPrice: 2.50,
      mochaPrice: 4.85,
      lattePrice: 4.73,
      maccPrice: null,
      espressoPrice: 2.80,
      americanPrice: 3.35,
      capPrice: 4.00,
      averagePrice: 3.71,
      center: [37.872904415367834, -122.2603725449091]
    },
    {
      shopName: "Goldie's Coffee",
      stars: 4.7,
      address: "2495 Bancroft Way, 2nd Floor",
      region: "Campus",
      dripPrice: 2.70,
      mochaPrice: 4.70,
      lattePrice: 4.25,
      maccPrice: 5.05,
      espressoPrice: 2.55,
      americanPrice: 3.55,
      capPrice: 4.05,
      averagePrice: 3.84,
      center: [37.86913708412578, -122.25939576025411]
    },
    {
      shopName: "Sodoi Coffee Tasting House",
      stars: 4.6,
      address: "2438 Durant Ave.",
      region: "Northside",
      dripPrice: 4.70,
      mochaPrice: 5.20,
      lattePrice: 4.70,
      maccPrice: 5.20,
      espressoPrice: 2.95,
      americanPrice: 4.00,
      capPrice: 4.20,
      averagePrice: 4.42,
      center: [37.867500708319014, -122.25954393141801]
    },
    {
      shopName: "1951 Coffee Company",
      stars: 4.7,
      address: "2410 Channing Way",
      region: "Southside",
      dripPrice: 3.00,
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
      address: "2499 Telegraph Ave.",
      region: "Southside",
      dripPrice: null,
      mochaPrice: null,
      lattePrice: 4.5,
      maccPrice: 3.5,
      espressoPrice: 3.0,
      americanPrice: 3.5,
      capPrice: 4.5,
      averagePrice: 3.8,
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
      center: [37.87249682257104, -122.2556421128647]
    },
    {
      shopName: "Cafe Think",
      stars: 4.2,
      address: "2220 Piedmont Ave.",
      region: "Campus",
      dripPrice: 2.75,
      mochaPrice: 4.20,
      lattePrice: 4.20,
      maccPrice: null,
      espressoPrice: 2.60,
      americanPrice: 3.40,
      capPrice: 4.20,
      averagePrice: 3.56,
      center: [37.872484685372015, -122.25419200307732]
    },
    {
      shopName: "Starbucks",
      stars: 3.9,
      address: "2224 Shattuck Ave.",
      region: "Downtown",
      dripPrice: 3.20,
      mochaPrice: 5.20,
      lattePrice: 4.70,
      maccPrice: 5.20,
      espressoPrice: 3.00,
      americanPrice: 3.80,
      capPrice: 4.70,
      averagePrice: 4.26,
      center: [37.86885218919049, -122.26830234676274]
    },
    {
      shopName: "Starbucks",
      stars: 3.7,
      address: "1444 Shattuck Pl.",
      region: "Downtown",
      dripPrice: 3.45,
      mochaPrice: 5.65,
      lattePrice: 4.95,
      maccPrice: 5.65,
      espressoPrice: 4.65,
      americanPrice: 4.15,
      capPrice: 4.95,
      averagePrice: 4.78,
      center: [37.8809398669007, -122.27009791792625]
    },
    {
      shopName: "Peet's Cofee",
      stars: 3.5,
      address: "2415 Bowditch St.",
      region: "Southside",
      dripPrice: 3.35,
      mochaPrice: 5.60,
      lattePrice: 5.15,
      maccPrice: 5.95,
      espressoPrice: 3.75,
      americanPrice: 4.75,
      capPrice: 4.95,
      averagePrice: 4.79,
      center: [37.867044587974696, -122.25617800258192]
    },
    {
      shopName: "Peet's Cofee",
      stars: 4.3,
      address: "2501 Telegraph Ave.",
      region: "Southside",
      dripPrice: 3.35,
      mochaPrice: 5.60,
      lattePrice: 5.15,
      maccPrice: 5.85,
      espressoPrice: 3.65,
      americanPrice: 4.65,
      capPrice: 5.00,
      averagePrice: 4.75,
      center: [37.86517793135621, -122.25825194490929]
    },
    {
      shopName: "Caffè Strada",
      stars: 4.3,
      address: "2300 College Ave.",
      region: "Southside",
      dripPrice: null,
      mochaPrice: 4.95,
      lattePrice: 4.75,
      maccPrice: null,
      espressoPrice: 2.95,
      americanPrice: 3.45,
      capPrice: 3.75,
      averagePrice: 3.97,
      center: [37.869289953345515, -122.25481608723673]
    },
    {
      shopName: "Edmonds Cafe",
      stars: 4.0,
      address: "2299 Piedmont Ave",
      region: "Northside",
      dripPrice: 2.50,
      mochaPrice: 4.75,
      lattePrice: 4.50,
      maccPrice: 4.75,
      espressoPrice: 3.0,
      americanPrice: 3.25,
      capPrice: 3.75,
      averagePrice: 3.79,
      center: [37.86982595229813, -122.25200867424137]
    },
    {
      shopName: "Kiklo Cafe",
      stars: 4.0,
      address: "174 Stanley Hall",
      region: "Campus",
      dripPrice: 3.50,
      mochaPrice: 4.25,
      lattePrice: 4.00,
      maccPrice: 2.75,
      espressoPrice: 2.75,
      americanPrice: 3.75,
      capPrice: 3.75,
      averagePrice: 3.54,
      center: [37.8739864752054, -122.2564413179264]
    },
    {
      shopName: "Cafenated Coffee Company",
      stars: 4.3,
      address: "2085 Vine St.",
      region: "Northside",
      dripPrice: 4.50,
      mochaPrice: 6.00,
      lattePrice: 5.50,
      maccPrice: 4.50,
      espressoPrice: 4.00,
      americanPrice: 4.00,
      capPrice: 4.75,
      averagePrice: 4.75,
      center: [37.88046456328716, -122.26993658908982]
    },
    {
      shopName: "Gold Bean Cafe",
      stars: 4.7,
      address: "2131 Durant Ave.",
      region: "Southside",
      dripPrice: 3.50,
      mochaPrice: 5.00,
      lattePrice: 4.75,
      maccPrice: null,
      espressoPrice: 3.00,
      americanPrice: 3.50,
      capPrice: 4.00,
      averagePrice: 3.96,
      center: [37.867243208674154, -122.26604697374559]
    },
    {
      shopName: "The Musical Offering Cafe~Bistro",
      stars: 4.5,
      address: "2430 Bancroft Way",
      region: "Southside",
      dripPrice: 4.00,
      mochaPrice: 6.00,
      lattePrice: 5.50,
      maccPrice: null,
      espressoPrice: 4.00,
      americanPrice: 4.25,
      capPrice: 5.25,
      averagePrice: 4.83,
      center: [37.868439415811366, -122.26073313141798]
    },
    {
      shopName: "Peet's Coffee",
      stars: 4.5,
      address: "2124 Vine St.",
      region: "Northside",
      dripPrice: 3.40,
      mochaPrice: 5.65,
      lattePrice: 5.20,
      maccPrice: 5.90,
      espressoPrice: 3.70,
      americanPrice: 4.70,
      capPrice: 5.05,
      averagePrice: 4.80,
      center: [37.88031482709877, -122.26835018723622]
    },
    {
      shopName: "Delah Coffee",
      stars: 4.8,
      address: "1807 Euclid Ave.",
      region: "Northside",
      dripPrice: 4.45,
      mochaPrice: 6.75,
      lattePrice: 5.95,
      maccPrice: 5.25,
      espressoPrice: 4.25,
      americanPrice: 4.50,
      capPrice: 5.45,
      averagePrice: 5.23,
      center: [37.87592747785118, -122.26020398909014]
    },
    {
      shopName: "Royal Ground Coffee",
      stars: 4.2,
      address: "2409 Shattuck Ave.",
      region: "Downtown",
      dripPrice: 3.45,
      mochaPrice: 5.95,
      lattePrice: 5.25,
      maccPrice: 4.75,
      espressoPrice: 4.00,
      americanPrice: 4.50,
      capPrice: 5.25,
      averagePrice: 4.74,
      center: [37.86583995039833, -122.26724704490942]
    },
    {
      shopName: "Mudraker's Cafe",
      stars: 4.1,
      address: "2801 Telegraph Ave.",
      region: "Southside",
      dripPrice: 3.13,
      mochaPrice: 5.05,
      lattePrice: 4.55,
      maccPrice: 4.38,
      espressoPrice: 3.75,
      americanPrice: 4.38,
      capPrice: 4.38,
      averagePrice: 4.23,
      center: [37.859578972322176, -122.25882554490948]
    },
    {
      shopName: "Jazz Cafe",
      stars: 4.5,
      address: "2040 Addison St.",
      region: "Downtown",
      dripPrice: 2.30,
      mochaPrice: 4.25,
      lattePrice: 4.50,
      maccPrice: 3.45,
      espressoPrice: 2.85,
      americanPrice: 2.85,
      capPrice: 3.95,
      averagePrice: 3.45,
      center: [37.871134757612644, -122.26917724490905]
    },
    {
      shopName: "Way Station Brew",
      stars: 4.5,
      address: "2120 Dwight Way",
      region: "Downtown",
      dripPrice: 3.00,
      mochaPrice: null,
      lattePrice: 4.50,
      maccPrice: null,
      espressoPrice: 3.25,
      americanPrice: 3.25,
      capPrice: 4.00,
      averagePrice: 3.60,
      center: [37.86407996352712, -122.26668810443532]
    },
    {
      shopName: "Souvenir Coffee Co.",
      stars: 3.8,
      address: "2701 College Ave.",
      region: "Southside",
      dripPrice: 3.75,
      mochaPrice: 5.50,
      lattePrice: 5.00,
      maccPrice: 4.00,
      espressoPrice: 3.50,
      americanPrice: 4.00,
      capPrice: 4.75,
      averagePrice: 4.36,
      center: [37.86213732667817, -122.25332098723712]
    },
    {
      shopName: "Micro Yali's",
      stars: 4.5,
      address: "VLSB",
      region: "Campus",
      dripPrice: 2.60,
      mochaPrice: 4.25,
      lattePrice: 3.75,
      maccPrice: 3.50,
      espressoPrice: 2.75,
      americanPrice: 2.75,
      capPrice: 3.60,
      averagePrice: 3.31,
      center: [37.87176001773602, -122.2618366890902]
    },
    {
      shopName: "Café Zeb",
      stars: 4.1,
      address: "2745 Bancroft Way",
      region: "Southside",
      dripPrice: 2.70,
      mochaPrice: 4.20,
      lattePrice: 4.20,
      maccPrice: null,
      espressoPrice: 2.70,
      americanPrice: 3.40,
      capPrice: 4.20,
      averagePrice: 3.57,
      center: [37.86973360523841, -122.25315418909034]
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
    averagePrice: 3.34
  },
  {
    coffeeName: "mocha",
    averagePrice: 5.36
  },
  {
    coffeeName: "latte",
    averagePrice: 4.84
  },
  {
    coffeeName: "macchiato",
    averagePrice: 4.50
  },
  {
    coffeeName: "espresso",
    averagePrice: 3.32
  },
  {
    coffeeName: "americano",
    averagePrice: 3.88
  },
  {
    coffeeName: "cappuccino",
    averagePrice: 4.48
  }
];

const sortedData = coffeeData.info.sort(
  (a, b) => b.averagePrice - a.averagePrice
);
