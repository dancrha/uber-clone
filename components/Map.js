import { StyleSheet, Text, View } from "react-native";
import React from "react";
import MapView, { Marker } from "react-native-maps";
import tw from "twrnc";
import { useSelector } from "react-redux";
import { selectDestination, selectOrigin } from "../slices/navSlice";
import MapViewDirections from "react-native-maps-directions";
import { GOOGLE_MAPS_APIKEY } from "@env";
import Geocoding from "react-native-geocoding";

Geocoding.init(process.env.GOOGLE_MAPS_APIKEY);

const getCoordinatesFromAddress = async (address) => {
  try {
    const response = await Geocoding.from(address);
    const { results } = response;
    if (results.length > 0) {
      const { geometry } = results[0];
      const { location } = geometry;
      return {
        latitude: location.lat,
        longitude: location.lng,
      };
    } else {
      throw new Error("No results found");
    }
  } catch (error) {
    console.error("Error getting coordinates from address:", error);
    return null;
  }
};

async function yourAsyncFunction(data, details = null) {
  console.log(data, details);
  const coordinates = await getCoordinatesFromAddress(data.description);
  console.log(coordinates);
  if (coordinates) {
    dispatch(
      setDestination({
        location: coordinates,
        description: data.description,
      })
    );
    navigation.navigate("RideOptionsCard");
  } else {
    console.log("No coordinates found.");
  }
}

const Map = () => {
  const origin = useSelector(selectOrigin);
  const destination = useSelector(selectDestination);
  console.log(origin);
  console.log(destination);

  return (
    <MapView
      style={tw`flex-1`}
      mapType='mutedStandard'
      initialRegion={{
        latitude: origin.location.latitude,
        longitude: origin.location.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      }}
    >
      {origin && destination && (
        <MapViewDirections
          origin={{
            latitude: origin.location.latitude,
            longitude: origin.location.longitude,
          }}
          destination={{
            latitude: destination.location.latitude,
            longitude: destination.location.longitude,
          }}
          apikey={GOOGLE_MAPS_APIKEY}
          strokeColor='black'
          strokeWidth={3}
        />
      )}
      {origin?.location && (
        <Marker
          coordinate={{
            latitude: origin.location.latitude,
            longitude: origin.location.longitude,
          }}
          title='Origin'
          description={origin.description}
          identifier='origin'
        />
      )}
      {destination?.location && (
        <Marker
          coordinate={{
            latitude: destination.location.latitude,
            longitude: destination.location.longitude,
          }}
          title='Destination'
          description={destination.description}
          identifier='destination'
        />
      )}
    </MapView>
  );
};

export default Map;

const styles = StyleSheet.create({});
