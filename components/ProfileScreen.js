// Funktionaliteter
import {
    View,
    Text,
    Image,
    FlatList,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import firebase from 'firebase';
import React, {useEffect, useState} from 'react';

// Assets
import profilepicture from "../assets/profilepicture.png"

// Ikoner
import IonIcon from 'react-native-vector-icons/Ionicons';

const ProfileScreen = (props) => {
    // useState til at vise ratings på profilside
    const [ratings, setRatings] = useState('');

    // handleLogout håndterer log ud af en aktiv bruger.
    // Metoden er en prædefineret metode, som firebase stiller tilrådighed. Metoden er et asynkront kald.
    // Funktionen her kaldes i vores TouchableOpacity neders på siden
    const handleLogOut = async () => {
        await firebase.auth().signOut();
    };


    // Bruger useEffect til at finde ud af om der er nogle ratings i Firebase.
    useEffect(() => {
        if (!ratings)
            firebase
                .database()
                .ref('/Ratings')
                .on('value', snapshot => {
                    setRatings(snapshot.val())
                });
    });

    // Flatlist forventer et array. Derfor tager vi alle values fra vores ratings objekt, og bruger som array til listen
    // ratingsArray skal kun finde objekter fra Firebase , hvor uid'et er det samme som det uid, som man er logget ind med
    const ratingsArray = Object.values(ratings).filter(item => item.uid === firebase.auth().currentUser.uid);
    const ratingsKeys = Object.keys(ratings);

    // RatingDetails.js forventer at få sent et array som .entries, som også indeholder anmeldelses-id'et også
    // Derfor laver vi .entries af vores ratings objekt.
    const ratingsEntries = Object.entries(ratings);

    // Her laver vi logikken til når man trykker på en TouchableOpacity med en anmeldelse.
    // Vi skal som sagt have fat i hele ratings for at kunne lede videre til RatingsDetails.
    function handleSelectRating(i) {

        // .forEach af vores entries for at loop'e igennem alle ratings i Firebase.
        ratingsEntries.forEach(
            function (rating, index) {

                // If-else laves her, men hvor vi kun leder i andet led ([1]) af array'et for at kunne nå uid'et
                // og sammenligne med uid på den bruger som er logget ind.
                if (rating[1].uid === firebase.auth().currentUser.uid) {

                    // Når og hvis objektet der er trykket på (der består af ratingsArray på den pågældende anmeldelse),
                    // Så navigerer vi videre ved hjælp af props til Ratings Details i Stack'en og sender hele .entries'en med.
                    if (i === rating[1]) {
                        props.navigation.navigate('Ratings Details', {rating});
                    }
                }
            })
    }

    return (
        <View style={styles.container}>

            <View style={styles.header}>

                {/* Vi viser en dummy profil øverst */}
                <View style={styles.headerContent}>
                    <Image source={profilepicture} style={styles.image}/>
                    <Text style={styles.name}>* Profilnavn * </Text>
                    <Text style={styles.UserInfo}> * Biografi * </Text>
                </View>

                {/* Vi viser dummy antal følgere, hvor mange man selv følger og hvor mange anbefalinger der er lavet af profilen */}
                <View style={[styles.userInfo, styles.bordered]}>
                    <View style={styles.section}>
                        <Text category='s1'>
                            33
                        </Text>
                        <Text appearance='hint' category='s2'>
                            Spots
                        </Text>
                    </View>
                    <View style={styles.section}>
                        <Text category='s1'>
                            423
                        </Text>
                        <Text appearance='hint' category='s2'>
                            Followers
                        </Text>
                    </View>
                    <View style={styles.section}>
                        <Text category='s1'>
                            249
                        </Text>
                        <Text appearance='hint' category='s2'>
                            Following
                        </Text>
                    </View>
                </View>
            </View>

            {/* Her kan man skifte mellem ens anmeldelser, kort over hvor man har spist og ønskeliste */}
            <View style={[styles.userInfo, styles.bordered]}>
                <View style={styles.section}>
                    <TouchableOpacity>
                        <IonIcon name="restaurant" size={17} color="black"/>
                    </TouchableOpacity>
                </View>
                <View style={styles.section}>
                    <TouchableOpacity onPress={() => props.navigation.navigate('Profile Screen Map')}>
                        <IonIcon name="map-outline" size={17} color="black"/>
                    </TouchableOpacity>
                </View>
                <View style={styles.section}>
                    <TouchableOpacity onPress={() => props.navigation.navigate('Profile Screen Wish')}>
                        <IonIcon name="star-outline" size={17} color="black"/>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Anmeldelserne fra profilen bliver vist i den følgende del */}
            <View>

                {/*
                FlatList der viser anmeldelser lavet af brugeren som er logget ind
                Vi viser objekterne fra ratingsArray og ratingsKeys som key.
                Herefter laver vi TouchableOpacities med de data vi ønsker.
                Trykker man på den pågældende TouchableOpacity, vil handleSelectRating blive kald hvori der sendes det pågældende objekt med
                */}
                <FlatList style={styles.page}
                          data={ratingsArray}
                    // Vi bruger ratingsKeys til at finde ID på den aktuelle bil og returnerer dette som key
                          keyExtractor={(item, index) => ratingsKeys[index]}
                          renderItem={({item, index}) => {
                              return (
                                  <TouchableOpacity key={index} style={styles.feedContainer}
                                                    onPress={() => handleSelectRating(ratingsArray[index])}>
                                      <Text>
                                          {item.Sted} {`\n`}
                                          {item.Vurdering}/6 {`\n`}
                                          {item.Anbefaling}
                                      </Text>
                                  </TouchableOpacity>
                              )
                          }}
                >
                </FlatList>

                {/* Log ud knap som TouchableOpacity */}
                <TouchableOpacity style={styles.buttonContainer} onPress={() => handleLogOut()}>
                    <Text style={styles.loginText}>Log ud</Text>
                </TouchableOpacity>
            </View>

            {/* Visning af brugeren, som er logget ind */}
            <Text>Current user: {firebase.auth().currentUser && firebase.auth().currentUser.email}</Text>
        </View>
    );
}

//Lokal styling til brug i ProfileScreen
const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        backgroundColor: '#fff',
    },
    feedContainer: {
        flex: 1,
        borderWidth: 1,
        borderRadius: 10,
        marginTop: "5%",
        padding: 5,
        justifyContent: 'center',
        backgroundColor: '#fff'
    },
    image: {
        width: 90,
        height: 90,
        borderRadius: 63,
        borderWidth: 4,
        borderColor: "white",
        marginBottom: 5,
        marginTop: '10%'
    },
    header: {
        backgroundColor: "#DFD0C0",
    },
    headerContent: {
        marginHorizontal: "6%",
        marginTop: '2%',
    },
    buttonContainer: {
        height: 50,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: '5%',
        width: 300,
        borderRadius: 15,
        marginLeft: '10%',
        backgroundColor: '#DFD0C0',
        shadowOpacity: 0.1,
    },
    name: {
        fontSize: 22,
        color: "#000000",
        fontWeight: '600',
    },
    UserInfo: {
        fontSize: 16,
        color: "#778899",
        fontWeight: '600',
    },
    section: {
        flex: 1,
        alignItems: 'center',
    },
    bordered: {
        borderBottomWidth: 1,
    },
    userInfo: {
        flexDirection: 'row',
        paddingVertical: 15,
    },
});

export default ProfileScreen