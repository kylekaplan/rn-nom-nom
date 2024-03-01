import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Home } from '../../screens/Home';
import { Profile } from '../../screens/Profile';
import { Inbox } from '../../screens/Inbox';

const Tab = createBottomTabNavigator();

export const MainTabs = ({ smartAccount }) => {
  return (
    // <View style={{ backgroundColor: 'black' }}>
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused
              ? 'ellipse'
              : 'ellipse-outline';
          } else if (route.name === 'Inbox') {
            iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          // You can return any component that you like here!
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'black',
        tabBarInactiveTintColor: 'gray',
      })}
    >
        <Tab.Screen name="Home" component={Home} />
        <Tab.Screen name="Inbox" component={Inbox} />
        <Tab.Screen name="Profile" component={Profile} />
      </Tab.Navigator>
    // </View>
  );
}