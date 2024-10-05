import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import Entypo from 'react-native-vector-icons/Entypo';
import Dashboard from './Dashboard';
import Notes from './Notes';
import Saved from './Saved';
import Settings from './Settings';
import Worksheets from './Worksheets';
const Tab = createBottomTabNavigator();

export default Tabs = () => {
  return (
    <Tab.Navigator
      initialRouteName="home"
      screenOptions={{
        tabBarActiveTintColor: '#5E5CE6',
        headerShown: false
      }}
      tabBarOptions={{
        showLabel: true

      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={Dashboard}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Saved"
        component={Saved}
        options={{
          tabBarLabel: 'Saved',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="content-save-check" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Notes"
        component={Notes}
        options={{
          tabBarLabel: 'Notes',
          tabBarIcon: ({ color, size }) => (
            <Feather name="book-open" color={color} size={size} />

          ),
        }}
      />
      <Tab.Screen
        name="Worksheets"
        component={Worksheets}
        options={{
          tabBarLabel: 'Worksheets',
          tabBarIcon: ({ color, size }) => (
            <Entypo name="pencil" color={color} size={size} />

          ),
        }}
      />
           
      <Tab.Screen
        name="Settings"
        component={Settings}
        options={{
          tabBarLabel: 'Settings',
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="setting" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}