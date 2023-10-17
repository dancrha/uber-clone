import { FlatList, Image, Text, View } from "react-native";
import React from "react";
import { TouchableOpacity } from "react-native";
import tw from "twrnc";
import { Icon } from "@rneui/themed";
import { useNavigation } from "@react-navigation/native";

const data = [
  {
    id: "123",
    title: "Get a ride",
    image: "https://links.papareact.com/3pn",
    screen: "MapScreen",
  },
  {
    id: "456",
    title: "Order food",
    image: "https://links.papareact.com/28w",
    screen: "EatsScreen",
  },
];

const NavOptions = () => {
  const navigation = useNavigation();

  return (
    <FlatList
      style={tw`mx-auto`}
      keyExtractor={(item) => item.id}
      data={data}
      horizontal
      renderItem={({ item }) => (
        <TouchableOpacity
          onPress={() => navigation.navigate(item.screen)}
          style={tw`p-2 pl-6 pr-6 pb-8 pt-4 bg-gray-200 m-2 w-40`}
        >
          <View>
            <Image
              source={{ uri: item.image }}
              style={{ width: 120, height: 120, resizeMode: "contain" }}
            />
            <Text style={tw` mt-2 text-lg font-semibold`}>{item.title}</Text>
            <Icon
              style={tw`p-2 bg-black rounded-full w-10 mt-4`}
              type='antdesign'
              color='white'
              name='arrowright'
            />
          </View>
        </TouchableOpacity>
      )}
    />
  );
};

export default NavOptions;
