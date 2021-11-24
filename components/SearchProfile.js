import React, {useEffect} from 'react';
import {
    StyleSheet,
    Text
} from 'react-native';
import {useState} from 'react';
import {MOCKUP_USERS} from "../const";
import firebase from "firebase";


const SearchProfile = () => {

    if (!firebase.auth().currentUser) {
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

    } else{
        function users () {
            Object.keys(MOCKUP_USERS)
            for (user1 in MOCKUP_USERS){
                console.log(`${user1}: ${MOCKUP_USERS[user1]}`);
            }
        }

        return (
            <Text> Hejsa
                {users}
            </Text>
        );
    }


}

export default SearchProfile;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});