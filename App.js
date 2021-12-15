// Funktionaliteter
import firebase from 'firebase';
import React, {useEffect, useState,} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

// Ikoner
import Ionicons from 'react-native-vector-icons/Ionicons';
import {MaterialCommunityIcons} from '@expo/vector-icons';

// Komponenter
import Map from "./components/Map";
import Feed from "./components/Feed";
import Friends from "./components/Friends";
import LoginForm from "./components/LoginForm";
import AddRating from "./components/AddRating";
import SignUpForm from "./components/SignUpForm";
import LandingPage from "./components/LandingPage";
import ProfileScreen from "./components/ProfileScreen";
import RatingDetails from "./components/RatingDetails";
import ProfileScreenMap from "./components/ProfileScreenMap";
import ProfileScreenWishlist from "./components/ProfileScreenWishlist";


// Vores Firebase konfigurationer
const firebaseConfig = {
    apiKey: "AIzaSyAtDYZsBwF5FBtu44xeOnDzAXZiHGedSJc",
    authDomain: "brugerinddragelse-317c1.firebaseapp.com",
    databaseURL: "https://brugerinddragelse-317c1-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "brugerinddragelse-317c1",
    storageBucket: "brugerinddragelse-317c1.appspot.com",
    messagingSenderId: "747991614026",
    appId: "1:747991614026:web:1c721bd804f75890e29cb3"
};

//StackNavigator instantieres.
const Stack = createStackNavigator();

//Tabnavigator instantieres
const Tab = createBottomTabNavigator();

export default function App() {

    // UseState til brugere
    const [user, setUser] = useState({loggedIn: false});

    // Her sikres at kun én Firebase initieres under brug af appen.
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }

    // onAuthstatechanged observerer brugerens status konstant (logget ind vs logget ud)
    // Pba. brugerens status foretages et callback, som håndterer user-state variablens status.
    function onAuthStateChange(callback) {
        return firebase.auth().onAuthStateChanged(user => {
            if (user) {
                callback({loggedIn: true, user: user});
            } else {
                callback({loggedIn: false});
            }
        });
    }

    // I denne useEffect aktiverer vi vores listener i form af onAuthStateChanged,
    // så vi dynamisk observerer om brugeren er aktiv eller ej.
    useEffect(() => {
        const unsubscribe = onAuthStateChange(setUser);
        return () => {
            unsubscribe();
        };
    }, []);

    // Her sættes en StackNavigation op til vores Feed, så man kan trykke på anmeldelserne og se flere detaljer
    const StackNavigationFeed = () => {
        return (
            <Stack.Navigator>
                <Stack.Screen name={'Ratings Feed'} component={Feed}/>
                <Stack.Screen name={'Ratings Details'} component={RatingDetails}/>
            </Stack.Navigator>
        )
    }

    // Samme gøres her til Profil-siden
    const StackNavigationProfile = () => {
        return (
            // Fjerner header så der ikke står "Profil" øverst på siden
            <Stack.Navigator screenOptions={{
                headerShown: false
            }}>
                {/* Der er en del sider her, da man skal kunne skifte mellem forskellige sider på ens profil */}
                <Stack.Screen name={'Profile Screen'} component={ProfileScreen}/>
                <Stack.Screen name={'Ratings Details'} component={RatingDetails}/>
                <Stack.Screen name={'Profile Screen Map'} component={ProfileScreenMap}/>
                <Stack.Screen name={'Profile Screen Wish'} component={ProfileScreenWishlist}/>
            </Stack.Navigator>
        )
    }

    // Nu laves vores TabNavigator til nor man ER logget ind
    const MainTabNavigator = () => {
        return (
            <NavigationContainer>
                <Tab.Navigator screenOptions={{
                    headerShown: false
                }}>

                    {/* Feed-Tab'en, som henviser til Feed-Stacken */}
                    <Tab.Screen
                        name="Feed"
                        component={StackNavigationFeed}
                        options={{
                            // Tilføjer ikoner til Tab Navigatoren der gerne skulle ligne noget med restauranter
                            tabBarIcon: ({color, size}) => (
                                <Ionicons name="restaurant" color={color} size={size}/>), headerShown: null
                        }}
                    />

                    {/* Venner-Tab'en, som henviser til komponenten Friends */}
                    <Tab.Screen
                        name="Venner"
                        component={Friends}
                        options={{
                            // Tilføjer ikoner til Tab Navigatoren der gerne skulle ligne noget med "venner"
                            tabBarIcon: ({color, size}) => (
                                <Ionicons name="people" color={color} size={size}/>)
                        }}
                    />

                    {/* Anmeldelses-Tab'en, som henviser til komponenten hvor man kan lave en anmeldelse */}
                    <Tab.Screen
                        name="Tilføj"
                        component={AddRating}
                        options={{
                            tabBarIcon: ({color, size}) => (
                                <Ionicons name="add" color={color} size={size}/>)
                        }}
                    />

                    {/* Kort-Tab'en, som henviser til kort-komponenten */}
                    <Tab.Screen
                        name="Kort"
                        component={Map}
                        options={{
                            tabBarIcon: ({color, size}) => (
                                <Ionicons name="map" color={color} size={size}/>)
                        }}
                    />

                    {/* Profil-Tab'en, som henviser til Profil-Stacken */}
                    <Tab.Screen
                        name="Profil"
                        component={StackNavigationProfile}
                        options={{
                            tabBarLabel: 'Profil',
                            tabBarIcon: ({color, size}) => (
                                <MaterialCommunityIcons name="account" color={color} size={size}/>
                            ),
                        }}
                    />
                </Tab.Navigator>
            </NavigationContainer>
        )
    }

    // Her sætter vi vores Stack op til når man IKKE ER logget ind
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

    // Her tilføjer vi en Ternary Operator, hvor condition = er brugeren logget ind?
    // Hvis ja, vis Main TabNavigator
    // Ellers, vis GuestStack
    return user.loggedIn ? <MainTabNavigator/> : <GuestStack/>;
}
