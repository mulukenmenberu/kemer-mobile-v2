import { View, Text } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Splash from './Splash'
import Welcome from './components/Welcome'
import Dashboard from './components/Dashboard'
import Tabs from './components/Tabs'
import Quiz from './components/Quiz'
import NoInternetScreen from './utils/NoInternetScreen'
import QuizeDescription from './components/QuizeDescription'
import ExamMode from './components/ExamMode'
const Navigation = () => {
    const stack = createNativeStackNavigator()
  return (
<stack.Navigator screenOptions={{headerShown:false}}>
    <stack.Screen name="Splash" component={Splash}/>
    <stack.Screen name="Welcome" component={Welcome}/>
    <stack.Screen name="Dashboard" component={Dashboard}/>
    <stack.Screen name="Tabs" component={Tabs}/>
    <stack.Screen name="Quiz" component={Quiz}/>
    <stack.Screen name="ExamMode" component={ExamMode}/>
    <stack.Screen name="QuizeDescription" component={QuizeDescription}/>
</stack.Navigator>
  )
}

export default Navigation