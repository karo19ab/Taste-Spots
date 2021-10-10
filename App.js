import React, {useEffect, useState} from 'react';
import {Text, View, StyleSheet, Image} from 'react-native';
import SignUpForm from './components/SignUpForm';
import firebase from 'firebase';
import ProfileScreen from "./components/ProfileScreen";
import { Card } from 'react-native-paper';
import LoginForm from "./components/LoginForm";
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { createStackNavigator } from '@react-navigation/stack';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAtDYZsBwF5FBtu44xeOnDzAXZiHGedSJc",
  authDomain: "brugerinddragelse-317c1.firebaseapp.com",
  databaseURL: "https://brugerinddragelse-317c1-default-rtdb.europe-west1.firebasedatabase.app/",
  projectId: "brugerinddragelse-317c1",
  storageBucket: "brugerinddragelse-317c1.appspot.com",
  messagingSenderId: "747991614026",
  appId: "1:747991614026:web:1c721bd804f75890e29cb3"
};

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


//Her oprettes gæstekomponentsindhold, der udgøres af sign-up og login siderne
  const GuestPage = () => {
    return (
        <View style={styles.container}>
          <Image
              source={require('./assets/welcomePic.jpeg')}
              style={styles.image}/>
          <Text style={styles.paragraph}>
            Opret eller Login med din firebase Email
          </Text>

          <Card style={{padding:20}}>
            <SignUpForm />
          </Card>

          <Card style={{padding:20}}>
            <LoginForm />
          </Card>

        </View>
    );
  }
  return user.loggedIn ? <ProfileScreen /> : <GuestPage/> ;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: '5%',
    backgroundColor: 'transparent',
    padding: 20,
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  image: {
    marginHorizontal: "10%",
    marginTop: "10%",
    width: "80%",
    height: "25%",
  }
});
