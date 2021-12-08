import React, {useEffect, useState, } from 'react';
import {StyleSheet} from 'react-native';

import firebase from 'firebase';
import ProfileScreen from "./components/ProfileScreen";
import SearchProfile from "./components/SearchProfile";
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { createStackNavigator } from '@react-navigation/stack';
import RatingDetails from "./components/RatingDetails";
import Feed from "./components/Feed";
import AddRating from "./components/AddRating";
import ImagePickerExample from "./components/AddRating";
import Map from "./components/Map";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import SignUpForm from "./components/SignUpForm";
import LoginForm from "./components/LoginForm";
import LandingPage from "./components/LandingPage";
import ProfileScreenMap from "./components/ProfileScreenMap"
import ProfileScreenWishlist from "./components/ProfileScreenWishlist"

//Malene overskriver
// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAtDYZsBwF5FBtu44xeOnDzAXZiHGedSJc",
    authDomain: "brugerinddragelse-317c1.firebaseapp.com",
    databaseURL: "https://brugerinddragelse-317c1-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "brugerinddragelse-317c1",
    storageBucket: "brugerinddragelse-317c1.appspot.com",
    messagingSenderId: "747991614026",
    appId: "1:747991614026:web:1c721bd804f75890e29cb3"
};

//Her instantieres en StackNavigator.
const Stack = createStackNavigator();

//Her oprettes en instans af tabnavigator
const Tab = createBottomTabNavigator(

);

export default function App() {
  //Her oprettes bruger state variblen
  const [user, setUser] = useState({loggedIn: false});

  //Koden sikrer at kun én Firebase initieres under brug af appen.
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }

  //onAuthstatechanged er en prædefineret metode, forsynet af firebase, som konstant observerer brugerens status (logget ind vs logget ud)
  //Pba. brugerens status foretages et callback i form af setUSer metoden, som håndterer user-state variablens status.
  function onAuthStateChange(callback) {
    return firebase.auth().onAuthStateChanged(user => {
      if (user) {
        callback({loggedIn: true, user: user});
      } else {
        callback({loggedIn: false});
      }
    });
  }

  //Heri aktiverer vi vores listener i form af onAuthStateChanged, så vi dynamisk observerer om brugeren er aktiv eller ej.
  useEffect(() => {
    const unsubscribe = onAuthStateChange(setUser);
    return () => {
      unsubscribe();
    };
  }, []);

  const StackNavigationFeed = () => {
    return(
        <Stack.Navigator >
            <Stack.Screen name={'Ratings Feed'} component={Feed}/>
            <Stack.Screen name={'Ratings Details'} component={RatingDetails}/>
        </Stack.Navigator>
    )
  }

    const StackNavigationProfile = () => {
        return(
            <Stack.Navigator screenOptions={{
                headerShown: false
            }}>
                <Stack.Screen name={'Profile Screen'} component={ProfileScreen}/>
                <Stack.Screen name={'Profile Screen Map'} component={ProfileScreenMap}/>
                <Stack.Screen name={'Profile Screen Wish'} component={ProfileScreenWishlist}/>
                <Stack.Screen name={'Ratings Details'} component={RatingDetails}/>
                <Stack.Screen name={'Edit Rating'} component={AddRating}/>
            </Stack.Navigator>
        )
    }

  const MainTabNavigator = () => {
      return(
          <NavigationContainer>

          <Tab.Navigator screenOptions={{
              headerShown: false
          }}>
              <Tab.Screen
                  name="Feed"
                  component={StackNavigationFeed}
                  options={{tabBarIcon: ({color, size}) => (
                          <Ionicons name="restaurant" color={color} size={size} />),headerShown:null}}
              />
              <Tab.Screen
                  name="Search"
                  component={SearchProfile}
                  options={{tabBarIcon: ({color, size}) => (
                          <Ionicons name="search" color={color} size={size} />)}}
              />
              <Tab.Screen
                  name="Add"
                  component={AddRating}
                  options={{tabBarIcon: ({color, size}) => (
                          <Ionicons name="add" color={color} size={size} />)}}
              />
              <Tab.Screen
                  name="Map"
                  component={Map}
                  options={{
                      tabBarLabel: 'Map',
                      tabBarIcon: ({color, size}) => (
                          <MaterialCommunityIcons name="map" color={color} size={size}/>
                      ),
                  }}
              />
              <Tab.Screen
                  name="Profile"
                  component={StackNavigationProfile}
                  options={{
                      tabBarLabel: 'Profile',
                      tabBarIcon: ({color, size}) => (
                          <MaterialCommunityIcons name="account" color={color} size={size}/>
                      ),
                  }}
              />
          </Tab.Navigator>
          </NavigationContainer>
      )
  }

   const GuestStack = () => {
        return (
            <NavigationContainer>
                <Stack.Navigator screenOptions={{
                    headerShown: false
                }}>
                    <Stack.Screen name={'LandingPage'} component={LandingPage}/>
                    <Stack.Screen name={'Login'} component={LoginForm}/>
                    <Stack.Screen name={'SignUpForm'} component={SignUpForm}/>
                </Stack.Navigator>
            </NavigationContainer>
        );
    }

    return user.loggedIn ? <MainTabNavigator /> : <GuestStack/> ;
}
