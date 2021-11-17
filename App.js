import React, {useEffect, useState} from 'react';

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
import {Text} from 'react-native'

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
const Tab = createBottomTabNavigator();

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

  const StackNavigation = () => {
    return(
        <Stack.Navigator>
            <Stack.Screen name={'Ratings Feed'} component={Feed}/>
            <Stack.Screen name={'Ratings Details'} component={RatingDetails}/>
            <Stack.Screen name={'Edit Rating'} component={AddRating}/>

          {
            //<Stack.Screen name={'Add Car'} component={AddRating}/>
          }
        </Stack.Navigator>
    )
  }

  if(false){
      return (
          <Text>
              Hejsa
          </Text>
      )
  }


    return (
          <NavigationContainer>
              <Tab.Navigator>
                  <Tab.Screen
                      name="Feed"
                      component={StackNavigation}
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
                    component={ProfileScreen}
                    options={{
                      tabBarLabel: 'Profile',
                      tabBarIcon: ({color, size}) => (
                          <MaterialCommunityIcons name="account" color={color} size={size}/>
                      ),
                    }}
                />
                  {/*Nedenfor er landing page - den skal ikke være en del af stack navigator*/}
                  <Tab.Screen
                      name="Taste Spots"
                      component={LandingPage}
                      options={{
                          tabBarLabel: 'Landing',
                          tabBarIcon: ({color, size}) => (
                              <MaterialCommunityIcons name="account" color={color} size={size}/>
                          ),
                      }}
                  />
              </Tab.Navigator>
          </NavigationContainer>
    );
}
