type RootStackParamList = {
  Home: undefined;
  Settings: undefined;
};

type SettingsScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Settings"
>;

type SettingsScreenRouteProp = RouteProp<RootStackParamList, "Settings">;

interface NavigationProps {
  navigation: SettingsScreenNavigationProp;
  route: SettingsScreenRouteProp;
}
