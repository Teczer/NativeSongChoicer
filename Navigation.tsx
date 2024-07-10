import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";

import HomeScreen from "./screens/HomeScreen";
import SettingsScreen from "./screens/SettingsScreen";
import VersusScreen from "./screens/VersusScreen";
import RankScreen from "./screens/RankScreen";

import { Entypo } from "@expo/vector-icons";
import { Fontisto } from "@expo/vector-icons";
import { Platform, StyleSheet } from "react-native";
import { useColorScheme } from "nativewind";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

export default function Navigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Main" component={MainTabs} />
        <Stack.Screen name="Versus" component={VersusScreen} />
        <Stack.Screen name="Rank" component={RankScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function MainTabs() {
  const { colorScheme } = useColorScheme();

  const styles = StyleSheet.create({
    tabContainer: {
      position: "absolute",
      width: "90%",
      borderRadius: 12,
      left: "5%",
      bottom: 20,
      borderTopWidth: 0,
      backgroundColor: colorScheme === "light" ? "#fff" : "#171717",
      height: 60,
    },
    label: {
      textTransform: "capitalize",
      fontSize: 12,
    },
  });

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colorScheme === "light" ? "#000" : "#fff",
        tabBarStyle: [
          styles.tabContainer,
          Platform.OS === "ios" && {
            shadowOffset: { height: -2, width: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 15,
          },
        ],
        tabBarItemStyle: {
          marginBottom: 7,
        },
        tabBarInactiveTintColor: "#999",
      }}
      safeAreaInsets={{
        bottom: 0,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ focused }) => (
            <Entypo
              name="home"
              size={24}
              color={
                focused ? (colorScheme === "light" ? "#000" : "#fff") : "#999"
              }
            />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarLabel: "Settings",
          tabBarIcon: ({ focused }) => (
            <Fontisto
              name="player-settings"
              size={24}
              color={
                focused ? (colorScheme === "light" ? "#000" : "#fff") : "#999"
              }
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
