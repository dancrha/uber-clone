import { StyleSheet, Text, View, SafeAreaView, Image } from "react-native";
import React from "react";
import tw from "twrnc";
import NavOptions from "../components/NavOptions";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { useDispatch } from "react-redux";
import { setDestination, setOrigin } from "../slices/navSlice";
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

const HomeScreen = () => {
  const dispatch = useDispatch();

  return (
    <SafeAreaView style={tw`bg-white h-full`}>
      <View style={tw`p-5`}>
        <Image
          source={{
            uri: "https://links.papareact.com/gzs",
          }}
          style={{ width: 100, height: 100, resizeMode: "contain" }}
        />
        <GooglePlacesAutocomplete
          styles={{
            container: {
              flex: 0,
            },
            textInput: {
              fontSize: 18,
            },
          }}
          onPress={async (data, details = null) => {
            console.log(data, details);
            const coordinates = await getCoordinatesFromAddress(
              data.description
            );
            console.log(coordinates);
            if (coordinates) {
              dispatch(
                setOrigin({
                  location: coordinates,
                  description: data.description,
                })
              );
              dispatch(setDestination(null));
            } else {
              console.log("No coordinates found.");
            }
          }}
          minLength={2}
          returnKeyType={"search"}
          enablePoweredByContainer={false}
          query={{ key: process.env.GOOGLE_MAPS_APIKEY, language: "en" }}
          nearbyPlacesAPI='GooglePlacesSearch'
          debounce={100}
          placeholder='Where from?'
        />
        <NavOptions />
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({});
