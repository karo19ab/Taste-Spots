import React from 'react';
import {StyleSheet, View, Text, Button} from 'react-native';
import firebase from "firebase";

{/*HUSK AT SKIFTE NAVN*/}
const Profile = (props) => {
    //Metoden er en prædefineret metode, som firebase stiller tilrådighed
    //Metoden er et asynkrontkald.
    const handleLogOut = async () => {
        await firebase.auth().signOut();
    };

    //Hvis der af en eller anden grund ikke skulle være muligt at fremfinde den aktive bruger,
    //skal der udprintes en besked om dette igennem en tekstkomponent
    if (!firebase.auth().currentUser) {
        return <View><Text>User not found</Text></View>;
    }
    return (

        <View style={styles.container}>
            <Text>Current user: {firebase.auth().currentUser.email}</Text>
            <Button onPress={() => handleLogOut()} title="Log out" />
        </View>
    );
}

{/*HUSK AT SKIFTE NAVN*/}
export default Profile;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        MarginTop: "20%",
        alignItems: 'center',
        justifyContent: 'center',
    },
});