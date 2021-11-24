import firebase from "firebase";
import React, {useEffect, useState} from 'react';


function LoginPls() {

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


}

export default LoginPls;