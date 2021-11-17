import React, {useEffect, useState} from 'react';
import {View, Text, Button, StyleSheet, Image, ScrollView, TouchableOpacity} from 'react-native';
import firebase from 'firebase';
import {Card} from "react-native-paper";
import SignUpForm from "./SignUpForm";
import LoginForm from "./LoginForm";
import GlobalStyles from "../globalStyles/GlobalStyles";

const ProfileScreen = (props) => {
    //Her oprettes bruger state variblen
    const [user, setUser] = useState({loggedIn: false});

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

    //handleLogout håndterer log ud af en aktiv bruger.
    //Metoden er en prædefineret metode, som firebase stiller tilrådighed
    //Metoden er et asynkrontkald.
    const handleLogOut = async () => {
        await firebase.auth().signOut();
    };

    //Hvis der af en eller anden grund ikke skulle være muligt at fremfinde den aktive bruger,
    //skal der udprintes en besked om dette igennem en tekstkomponent
    if (!firebase.auth().currentUser) {
        return (
                <ScrollView>
                    <Image
                        source={require('../assets/profilePic.jpg')}
                        style={styles.image}/>

                    <Card style={{padding:20}}>
                        <SignUpForm />
                    </Card>

                    <Card style={{padding:20}}>
                        <LoginForm />
                    </Card>
                    <Text style={styles.paragraph2}>
                        Jeg håber virkelig dette kan hjælpe bare en smule!
                    </Text>
                </ScrollView>
        )
    }else{
        //I return() udnyttes en prædefineret metode, som firebase stiller til rådighed.
        // Metoden returnerer mailadressen af den aktive bruger.
        // Mailadressen udskrives ved brug af en tekstkomponent.
        return (
            <View style={styles.container} >
                <Text>Current user: {firebase.auth().currentUser.email}</Text>
                <TouchableOpacity style={[GlobalStyles.buttonContainer, styles.loginButton]} onPress={() => handleLogOut(props.navigation.navigate('LandingPage'))}>
                    <Text style={styles.loginText}>Log ud</Text>
                </TouchableOpacity>
                <Button onPress={() => handleLogOut()} title="Log out" />
            </View>
        );
    }
}

//Lokal styling til brug i ProfileScreen
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        paddingTop: '5%',
        backgroundColor: '#FFFFFF',
        padding: 8,
    },
    image: {
        marginHorizontal: "10%",
        marginTop: "5%",
        marginBottom: "5%",
        width: "80%",
        height: "25%",
    },
    paragraph2: {
        marginTop: '50%',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    loginButton: {
        backgroundColor: '#3498db',
    },
});

//Eksport af Loginform, således denne kan importeres og benyttes i andre komponenter
export default ProfileScreen