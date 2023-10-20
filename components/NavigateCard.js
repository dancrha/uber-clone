import { StyleSheet, Text, View, SafeAreaView } from "react-native";
import React from "react";
import tw from "twrnc";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { useDispatch } from "react-redux";
import { setDestination } from "../slices/navSlice";
import { useNavigation } from "@react-navigation/native";
import Geocoding from "react-native-geocoding";
import NavFavourites from "./NavFavourites";
import { Icon } from "react-native-elements";
import { TouchableOpacity } from "react-native";

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
            returnKeyType={"search"}
            fetchDetails={true}
            enablePoweredByContainer={false}
            query={{ key: process.env.GOOGLE_MAPS_APIKEY, language: "en" }}
            debounce={100}
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
        <NavFavourites />
      </View>
      <View
        style={tw`flex-row bg-white justify-evenly py-2 mt-auto border-t border-gray-100`}
      >
        <TouchableOpacity
          onPress={() => navigation.navigate("RideOptionsCard")}
          style={tw`flex justify-between flex-row bg-black w-24 px-4 py-3 rounded-full`}
        >
          <Icon name='car' type='font-awesome' color='white' size={16} />
          <Text style={tw`text-white text-center `}>Rides</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={tw`flex flex-row justify-between w-24 px-4 py-3 rounded-full`}
        >
          <Icon
            name='fast-food-outline'
            type='ionicon'
            color='black'
            size={16}
          />
          <Text style={tw`text-center`}>Eats</Text>
        </TouchableOpacity>
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
