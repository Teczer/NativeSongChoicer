import { Image, StatusBar, Text, View } from "react-native";

import { useCustomBlurIntensity } from "../store/useCustomBlurPreference";
import { useBackgroundImage } from "../store/useBackgroundImage";

import CustomSafeArea from "./CustomSafeArea";
import { useState } from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Pokemon } from "../types/pokemon";

import { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } from "@env";

interface Props {
  queryError: any;
}

export default function HomeErrorScreen({ queryError }: Props) {
  const [pokemonData, setPokamonData] = useState<any>([]);
  const [pokemonError, setPokemonError] = useState<any>();
  const { image } = useBackgroundImage();
  const { blurIntensity } = useCustomBlurIntensity();

  const fetchPokemon = async () => {
    try {
      const response = await fetch("https://pokeapi.co/api/v2/pokemon/717/");
      if (!response.ok) {
        throw new Error("Pokemon not found");
      }
      const data = await response.json();
      setPokamonData([data]);
    } catch (error: any) {
      console.log("Erreur lors de la récupération du Pokémon :", error.message);
      setPokemonError(error.message || "erreur autre que 404");
    }
  };

  console.log("pokemonData", pokemonData);
  return (
    <CustomSafeArea
      className="flex flex-1 w-full flex-col items-center justify-start pt-10"
      style={{
        gap: 10,
      }}
    >
      <StatusBar
        translucent={true}
        backgroundColor="transparent"
        barStyle="light-content"
      />
      <Image
        className="absolute inset-0 top-0 left-0 w-full h-full scale-125 rounded-sm"
        blurRadius={blurIntensity}
        source={{
          uri:
            image ||
            "https://i.scdn.co/image/ab67616d0000b273d1f65b1e79536bb46ead609a",
        }}
      />
      <Text className="text-white font-bold text-xl mb-6 px-4 py-2 text-center">
        Show env : client_id : {SPOTIFY_CLIENT_ID || "nothing"}, client_secret :
        {SPOTIFY_CLIENT_SECRET || "nothing"}
      </Text>
      <Text className="text-white font-bold text-xl mb-6 px-4 py-2 text-center">
        An error occured : {queryError?.toString() || "No error"}
      </Text>
      <TouchableOpacity
        onPress={fetchPokemon}
        className="border border-white p-2"
        style={{ borderRadius: 10 }}
      >
        <Text className="text-white text-xl font-bold">
          Fetch Pokemon for test
        </Text>
      </TouchableOpacity>
      {pokemonError && (
        <Text className="text-white text-xl font-bold">{pokemonError}</Text>
      )}
      {pokemonData &&
        pokemonData.map((pokemon: Pokemon) => (
          <View key={pokemon.id}>
            <Text className="text-white font-bold text-lg">{pokemon.name}</Text>
            <Text className="text-white font-bold text-lg">
              id : {pokemon.id}
            </Text>
            <Image
              width={176}
              height={176}
              source={{ uri: pokemon.sprites.front_default }}
            />
          </View>
        ))}
    </CustomSafeArea>
  );
}
