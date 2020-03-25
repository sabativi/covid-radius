import React from "react";
import circleToPolygon from "circle-to-polygon";
import ReactMapboxGl, { GeoJSONLayer, Marker } from "react-mapbox-gl";
import AlgoliaPlaces from "algolia-places-react";
import useGeolocation from "@rooks/use-geolocation";
import styled from "styled-components";
import Grid from "styled-components-grid";

const circleLayout = { visibility: "visible" };
const circlePaint = {
  "circle-color": "rgb(11, 84, 175)"
};

const createCircularPolygon = (center, radiusKm) => {
  return circleToPolygon(center, radiusKm * 1000, 500);
};

const parisCoordinates = [2.35779, 48.8718];

const Mark = styled.div`
  background-color: rgb(11, 84, 175);
  border-radius: 50%;
  width: 20px;
  height: 20px;
  border: 4px solid #5da0f4;
`;

const Button = styled.button`
  background: transparent;
  border-radius: 3px;
  border: 2px solid rgb(11, 84, 175);
  color: rgb(11, 84, 175);
  margin: 0.5em 1em;
  padding: 1em 1em;
`;

const Container = styled.div`
  text-align: center;
`;

function App() {
  const Map = ReactMapboxGl({
    accessToken:
      "pk.eyJ1Ijoic2FiYXRpdmkiLCJhIjoiY2dLbmxVcyJ9.LJkwUe2kx2yEap2Exx8M9A"
  });
  const [radiusCenter, setRadiusCenter] = React.useState(null);
  const [when, setWhen] = React.useState(false);

  const geoObj = useGeolocation({ when });

  React.useEffect(() => {
    if (!!geoObj) {
      setRadiusCenter(geoObj);
    }
  }, [geoObj]);

  return (
    <div>
      <Container>
        <h3>Pour connaitre jusqu'où vous pouvez aller dans votre quartier</h3>
        <h6>
          L'état autorise une sortie jusqu'à 1 km autour de chez vous,
          Visualiser le sur la carte
        </h6>
      </Container>
      <Grid horizontalAlign="center" verticalAlign="center">
        <Grid.Unit
          size={{ tablet: 1, desktop: 2 / 3 }}
          style={{ marginLeft: 30, marginRight: 30, margin: "auto" }}
        >
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
              alert("Erreur");
            }}
          />
        </Grid.Unit>
        <Grid.Unit size={{ tablet: 1, desktop: 1 / 4 }}>
          <h6>
            Ou
            <Button
              onClick={() => {
                setRadiusCenter(null);
                setWhen(true);
              }}
            >
              Geolocaliser moi
            </Button>
          </h6>
        </Grid.Unit>
      </Grid>
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
          height: "80vh",
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
