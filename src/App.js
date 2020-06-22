import React from 'react';
import {
  GoogleMap,
  useLoadScript,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";

// import {Bootstrap} from 'react-bootstrap';
import { formatRelative } from "date-fns";

import usePlacesAutocomplete, {
  
} from "use-places-autocomplete";
import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxOption,
} from "@reach/combobox";


import "@reach/combobox/styles.css";
import mapStyles from "./mapStyles"


const libraries = ["places"]
const mapContainerStyle = {
  width: "100vw",
  height: "100vh",
};

  const center = {
    lat: 9.081999,
    lng: 8.675277,
  };

  const options = {
      styles: mapStyles,
      disableDefaultUI: true,
      zoomControl: true,
  };

export default function App() {
  const {isLoaded, loadError} = useLoadScript({
    libraries,
  });

  const [markers, setMarkers] = React.useState([]);

  const [selected, setSelected] = React.useState(null);

  const onMapClick = React.useCallback((event) => {
    setMarkers((current) => [
      ...current,
      {
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
        time: new Date(),
      },
    ]);
  }, []);

  const mapRef = React.useRef();
  const onMapLoad = React.useCallback((map) => {
    mapRef.current = map;
  }, []);



  if (loadError) return "Error loading maps";
  if (!isLoaded) return "Loading Maps";



  return <div>

    <Search />
    <GoogleMap 
    mapContainerStyle={mapContainerStyle} 
    zoom={8} 
    center={center}
    options={options}
    onClick={onMapClick}
    onLoad={onMapLoad}
    >
      {markers.map((marker => <Marker key={marker.time.toISOString()} position={{ lat: marker.lat, lng: marker.lng }} 
      icon={{
        url: "/pickmeup.png",
        scaledSize: new window.google.maps.Size(30, 30),
        origin: new window.google.maps.Point(0, 0),
        anchor: new window.google.maps.Point(15, 15),
      }}

      onClick={() => {
        setSelected(marker);
      }}
      
      />))}

      {selected ? (
      <InfoWindow position={{ lat: selected.lat, lng: selected.lng }}
      onCloseClick={() => {
        setSelected(null);
      }}
      >
        <div>
          <h2>Current Location</h2>
          <p>Location {formatRelative(selected.time, new Date())} </p>
        </div>
      </InfoWindow>
      ) : null }
    </GoogleMap>
  </div>;
};

function Search() {
  const { ready, value, 
    suggestions: { status, data }, setValue,} = usePlacesAutocomplete({
    requestOptions: {
      location: { lat: () => 9.081999, lng: () => 8.675277 },
      radius: 200 * 1000,
    },
  });

  return (
    <div className="search">
    <Combobox
    onSelect={(address) => {
      console.log(address);
    }}
    >
      <ComboboxInput 
      value={value}
      onChange={(e) => {
        setValue(e.target.value)
      }}
      disabled={!ready}
      placeholder="Find My Location"
        /> 
        <ComboboxPopover>       
            {status === "OK" && data.map(({ id, description }) => (
                <ComboboxOption key={id} value={description} />
              ))}         
        </ComboboxPopover>
    </Combobox>
    </div>
  )
}