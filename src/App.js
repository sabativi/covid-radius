import React from "react";
import circleToPolygon from "circle-to-polygon";
import ReactMapboxGl, { GeoJSONLayer, Marker } from "react-mapbox-gl";
import AlgoliaPlaces from "algolia-places-react";
import styled from "styled-components";

import "./App.css";

const circleLayout = { visibility: "visible" };
const circlePaint = {
  "circle-color": "red"
};

const createCircularPolygon = (center, radiusKm) => {
  return circleToPolygon(center, radiusKm * 1000, 500);
};

const parisCoordinates = [2.35779, 48.8718];

const Mark = styled.div`
  background-color: #e74c3c;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  border: 4px solid #eaa29b;
`;

function App() {
  const Map = ReactMapboxGl({
    accessToken:
      "pk.eyJ1Ijoic2FiYXRpdmkiLCJhIjoiY2dLbmxVcyJ9.LJkwUe2kx2yEap2Exx8M9A"
  });
  const [radiusCenter, setRadiusCenter] = React.useState(null);

  return (
    <div className="App">
      <h3>Pour connaitre jusqu'où vous pouvez aller dans votre quartier</h3>
      <h6>
        L'état autorise une sortie jusqu'à 1 km autour de chez vous, Visualiser
        le sur la carte
      </h6>
      <div style={{ width: "80%", margin: "auto", marginBottom: 40 }}>
        <AlgoliaPlaces
          placeholder="Rentrer votre adresse"
          options={{
            appId: "plIOAJ96YX8Q",
            apiKey: "a6659aa3595deea11ca0374727609432",
            language: "fr",
            countries: ["fr"],
            type: "address",
            useDeviceLocation: true
          }}
          onClear={() => setRadiusCenter(null)}
          onChange={({ suggestion }) => {
            const { latlng } = suggestion;
            setRadiusCenter(latlng);
          }}
          onError={({ message }) => {
            console.log(message);
            alert("Erreur");
          }}
        />
      </div>
      <Map
        // eslint-disable-next-line
        style="mapbox://styles/mapbox/streets-v9"
        center={
          !!radiusCenter
            ? [radiusCenter.lng, radiusCenter.lat]
            : parisCoordinates
        }
        zoom={[13]}
        containerStyle={{
          height: "100vh",
          width: "100vw"
        }}
      >
        {radiusCenter && (
          <>
            <GeoJSONLayer
              data={createCircularPolygon(
                [radiusCenter.lng, radiusCenter.lat],
                1
              )}
              circleLayout={circleLayout}
              circlePaint={circlePaint}
            />
            <Marker coordinates={[radiusCenter.lng, radiusCenter.lat]}>
              <Mark />
            </Marker>
          </>
        )}
      </Map>
    </div>
  );
}

export default App;
