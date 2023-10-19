import { StyleSheet, Text, View, SafeAreaView } from "react-native";
import React from "react";
import tw from "twrnc";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { useDispatch } from "react-redux";
import { setDestination } from "../slices/navSlice";
import { useNavigation } from "@react-navigation/native";
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

const NavigateCard = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  return (
    <SafeAreaView style={tw`bg-white flex-1`}>
      <Text style={tw`text-center py-5 text-xl`}>Good Morning, Daniel</Text>
      <View style={tw`border-t border-gray-200 flex-shrink`}>
        <View>
          <GooglePlacesAutocomplete
            styles={toInputBoxStyles}
            placeholder='Where to?'
            returnKeyType={"done"}
            fetchDetails={true}
            enablePoweredByContainer={false}
            query={{ key: process.env.GOOGLE_MAPS_APIKEY, language: "en" }}
            debounce={400}
            onPress={async (data, details = null) => {
              console.log(data, details);
              const coordinates = await getCoordinatesFromAddress(
                data.description
              );
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
              return coordinates;
            }}
            nearbyPlacesAPI='GooglePlacesSearch'
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default NavigateCard;

const toInputBoxStyles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    paddingTop: 20,
    flex: 0,
  },
  textInput: {
    backgroundColor: "#DDDDDF",
    borderRadius: 0,
    fontSize: 18,
  },
  textInputContainer: {
    paddingHorizontal: 20,
    paddingBottom: 0,
  },
});
