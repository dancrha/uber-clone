import { FlatList, Image, Text, View } from "react-native";
import React from "react";
import { Pressable, TouchableOpacity } from "react-native";

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
  return (
    <FlatList
      keyExtractor={(item) => item.id}
      data={data}
      horizontal
      renderItem={({ item }) => (
        <Pressable>
          <TouchableOpacity>
            <View>
              <Image
                source={{ uri: item.image }}
                style={{ width: 120, height: 120 }}
              />
              <Text>{item.title}</Text>
            </View>
          </TouchableOpacity>
        </Pressable>
      )}
    />
  );
};

export default NavOptions;
