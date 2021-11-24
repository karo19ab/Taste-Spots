import React, {useEffect, useState} from 'react';
import {View, Text, Button, StyleSheet, Image, ScrollView, TouchableOpacity} from 'react-native';
import firebase from 'firebase';
import {Card} from "react-native-paper";
import SignUpForm from "./SignUpForm";
import LoginForm from "./LoginForm";
import Feed from "./Feed";
import GlobalStyles from "../globalStyles/GlobalStyles";
import kasperProfile from "../assets/kasperProfile.png"
import { Ionicons } from '@expo/vector-icons';


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
        props.navigation.navigate('LandingPage')
    };

    //Hvis der af en eller anden grund ikke skulle være muligt at fremfinde den aktive bruger,
    //skal der udprintes en besked om dette igennem en tekstkomponent
    //I return() udnyttes en prædefineret metode, som firebase stiller til rådighed.
    // Metoden returnerer mailadressen af den aktive bruger.
    // Mailadressen udskrives ved brug af en tekstkomponent.
    return (
        <View style={styles.container} >
            <View style={styles.header}>
                <View style={styles.headerContent}>
                    <Image source={kasperProfile} style={styles.image} />
                    <Text style={styles.name}>Kasper Rønbøg </Text>
                    <Text style={styles.UserInfo}>Østerbro </Text>
                </View>
            </View>
            <View style={[styles.userInfo, styles.bordered]}>
                <View style={styles.section}>
                    <Text category='s1' style={styles.space}>
                        33
                    </Text>
                    <Text appearance='hint' category='s2'>
                        Spots
                    </Text>
                </View>
                <View style={styles.section}>
                    <Text category='s1' style={styles.space}>
                        0
                    </Text>
                    <Text appearance='hint' category='s2'>
                        Followers
                    </Text>
                </View>
                <View style={styles.section}>
                    <Text category='s1' style={styles.space}>
                        0
                    </Text>
                    <Text appearance='hint' category='s2'>
                        Following
                    </Text>
                </View>
            </View>
            <TouchableOpacity style={styles.buttonContainer} onPress={() => handleLogOut()}>
                <Text style={styles.loginText}>Log ud</Text>
            </TouchableOpacity>
            <Text>Current user: {firebase.auth().currentUser && firebase.auth().currentUser.email}</Text>

        </View>
    );
}

//Lokal styling til brug i ProfileScreen
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        paddingTop: '10%',
        backgroundColor: '#fff',
        padding: 1,
    },
    image: {
        width: 90,
        height: 90,
        borderRadius: 63,
        borderWidth: 4,
        borderColor: "white",
        marginBottom:10,
    },
    header:{
        backgroundColor: "#DFD0C0",
    },
    headerContent:{
        padding:25,
    },
    paragraph2: {
        marginTop: '50%',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    buttonContainer: {
        height:50,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop:'100%',
        width:300,
        borderRadius:15,
        marginLeft: '10%',
        backgroundColor: '#B45626',
        shadowOpacity: 0.1,
    },
    name:{
        fontSize:22,
        color:"#000000",
        fontWeight:'600',
    },
    UserInfo:{
        fontSize:16,
        color:"#778899",
        fontWeight:'600',
    },
    section: {
        flex: 1,
        alignItems: 'center'
    },
    bordered: {
        borderBottomWidth: 1,
    },
    space: {
        marginBottom: 3,
    },
    separator: {
        alignSelf: 'center',
        flexDirection: 'row',
        flex: 0,
        width: 1,
        height: 42
    },
    text: {
        color: 'black'
    },
    userInfo: {
        flexDirection: 'row',
        paddingVertical: 18
    },
});

//Eksport af Loginform, således denne kan importeres og benyttes i andre komponenter
export default ProfileScreen