// Funktionaliteter
import {
    View,
    Text,
    Alert,
    Button,
    StyleSheet,
    Dimensions,
} from 'react-native';
import firebase from 'firebase';
import {Accuracy} from "expo-location";
import * as Location from 'expo-location';
import React, {useEffect, useState} from 'react';
import MapView, {Marker, Callout} from 'react-native-maps';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';


function Map() {
    //Her instantieres alle anvendte statevariabler
    const initialState = {name: '', lati: '', longi: '', uid: ''}
    const [newSpotWish, setNewSpotWish] = useState(initialState);
    const [hasLocationPermission, setHasLocationPermission] = useState(false)
    const [currentLocation1, setCurrentLocation] = useState(null)
    const [userMarkerCoordinates, setUserMarkerCoordinates] = useState([])

    /*
    Dokumentation:  https://docs.expo.dev/versions/latest/sdk/location/
    getLocationPermission udnytter den prædefinerede asynkrone metode requestForegroundPermissionsAsync,
    som aktiverer en forespørgsel om tilladelse til at benytte enhedens position
    resultatet af denne handling leveres og benyttes til at sætte værdien af locationPermission
    Værdien sættes pba. af værdien item.granted
    */
    const getLocationPermission = async () => {
        await Location.requestForegroundPermissionsAsync().then((item) => {
            setHasLocationPermission(item.granted)
        });

    };

    // I useEffect kaldes getlocationPermission, der sikrer at enheden forespørger tilladelse så snart appen kører
    useEffect(() => {
        const response = getLocationPermission()
    });

    /*
    Metoden updateLocation udnytter det prædefinerede asynkrone kald, getCurrentPositionAsync, returnerer enhedens aktuelle position
    Resultatet fra kaldet benyttes til at fastsætte værdien af currentlokation.
    argumentet, Accuracy.Balanced, angiver den nøjagtighed vi ønsker skal bruges til at angive positionen.
    */
    const updateLocation = async () => {
        await Location.getCurrentPositionAsync({accuracy: Accuracy.Balanced}).then((item) => {
            setCurrentLocation(item.coords)
        });
    };

    // Metoden handleLongPress tager en event med som argument og henter værdien af et koordinatsæt fra denne
    // Værdien gemmes i en variabel, der tilføjes til et array af koordinater.
    const handleLongPress = event => {
        const coordinate = event.nativeEvent.coordinate
        setUserMarkerCoordinates((oldArray) => [...oldArray, coordinate])
    };


    // RenderCurrentLocation tager props med som argument og tjekker om, der er givet adgang til enhedens lokationsdata
    const RenderCurrentLocation = (props) => {
        // Er der ikke givet adgang returneres der en tekstkomponent med instruktioner til brugeren
        if (props.hasLocationPermission === null) {
            return null;
        }

        // Er der givet tilladelse og currenLocation ikke har en værdi, vil der fremvises en forklarende text
        if (props.hasLocationPermission === false) {
            return <Text>No location access. Go to settings to change</Text>;
        }

        // Er der givet tilladelse og currentlokation har en værdi, vil lokationsdata blive udskrevet i en infoboks
        return (
            <View>
                <Button style title="update location" onPress={updateLocation}/>
                {currentLocation1 && (
                    <Text>
                        {`lat: ${currentLocation1.latitude},\nLong:${
                            currentLocation1.longitude
                        }\nacc: ${currentLocation1.accuracy}`}
                    </Text>
                )}
            </View>
        );
    };

    // Her har vi sætter vi scenen for, Google Places søgningen foretages fra, vha. useState.
    // Denne useState skal agere det sted (eller "region" som vi kalder det), hvor man har søgt. Den er sat til centrum i 1. omgang
    const [region, setRegion] = React.useState({
        latitude: 55.676098,
        longitude: 12.568337,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    })

    // Her bruger vi en useState til at sætte Rådhuspladsen som et startsted (hardcoded)
    const [place, setPlace] = React.useState({
        name: 'Rådhuspladsen'
    })


    // Nedenfor ses koden, der muliggører at gemme et sted i Firebase
    function savePlace() {
        // Starter ud med at definere vores state
        const {name, lati, longi, uid} = newSpotWish;

        // Try/Catch med at tilføje til db gennem prædefinerede Firebase-metoder
        try {
            firebase
                .database()
                .ref('/SpotWishlist/')
                .push({name, lati, longi, uid});
            Alert.alert(`Added to Wishlist :)`);

            // Resetter useState tilbage til initialState.
            setNewSpotWish(initialState)

            // Fejlmeddelelse bliver vores catch
        } catch (error) {
            console.log(`Error: ${error.message}`);
        }
    }

    // Her laves alert-boksen med diverse knapper
    function buttons() {
        Alert.alert(
            // Titlen bliver stedet, man har søgt efter i Google Places feltet.
            `${newSpotWish.name}`,
            'What do you wish to do with this spot?',
            [
                // Cancel-knap
                {
                    text: 'Cancel',
                    style: 'cancel'
                },
                // Knap, der kører savePlace-metoden ovenfor
                {
                    text: 'Add to Wishlist',
                    onPress: () => savePlace()
                },
                // Knap, bare skriver objektet for stedet man har søgt på, i konsollen.
                // Tanken for denne knap var, at det den skulle sende en videre til anmeldelsessiden
                {
                    text: 'Rate the Spot',
                    onPress: () => console.log(newSpotWish)
                }
            ]
        )
    }


    return (
        <View>
            {
                /*
                GooglePlacesAutocomplete er smart fordi den kører på Google's API over steder.
                Den fungerer som et input felt der foreslår steder, hvortil vi kan lave metoder o.l. via onPress.
                https://www.npmjs.com/package/react-native-google-places-autocomplete
                Video: https://www.youtube.com/watch?v=qlELLikT3FU&ab_channel=DarwinTech
                */
            }
            <GooglePlacesAutocomplete
                placeholder='Search'
                // Minimumlængde på at komme med foreslag (viker ikke føler jeg)
                minLenght={2}
                autoFocus={false}
                // Når vi sætter nedenstående til true, vil man kunne få Details med som kan bruges længere nede
                fetchDetails={true}
                renderDescription={row => row.description}

                /*
                Det er som sagt i onPress det mest spændende sker.
                Der er altså tale om logik, når man trykker på det Google's foreslåede sted
                */
                onPress={(data, details = null) => {
                    // Her sikrer vi, at region bliver as til Google-stedet-har-trykket-på's lokationsdata.
                    setRegion({
                        latitude: details.geometry.location.lat,
                        longitude: details.geometry.location.lng,
                        // Delta, så vidt jeg forstår, har noget at gøre med udseendet i vinduet, men er ikke helt sikker
                        // Det er til gengæld en nødvendighed for at det virker.
                        latitudeDelta: 0.05,
                        longitudeDelta: 0.0321,
                    })

                    // vi gemmer navnet på stedet i place, så vi kan bruge det senere.
                    setPlace({
                        name: details.name
                    })

                    // Her sættes newSpotWish, som er hvad der sendes til DB længere oppe
                    setNewSpotWish({
                        name: details.name,
                        lati: details.geometry.location.lat,
                        longi: details.geometry.location.lng,
                        uid: firebase.auth().currentUser.uid,
                    })
                }}
                getDefaultValue={() => ''}
                query={{
                    // Husk at kryptere API key hvis det skal være en rigtig app, fordi ellers er den tilgængelig for alle!
                    key: 'AIzaSyCc8mR9JJqFV35qcL7WXn8nBvFPNGZ101w', // API-nøgle
                    language: 'en', // Resultatets sprog
                    types: "establishment", // Der skal kun dukke virksomheder op i søgningen
                    components: "country:dk", // Kun resultater fra Danmark
                }}
                // Input-feltets styile
                styles={{
                    container: {
                        flex: 0,
                        position: "absolute",
                        width: "100%",
                        zIndex: 1,
                        paddingTop: 60,
                        paddingHorizontal: 10
                    },
                    listView: {backgroundColor: "grey"},
                }}
                nearbyPlacesAPI='GooglePlacesSearch'
                GoogleReverseGeocodingQuery={{
                    // ved ikke helt hvad man bruger dette til
                }}
                GooglePlacesSearchQuery={{
                    // Jeg synes ikke noget af det her virker, selvom jeg har prøvet at lege en del med det.
                    rankBy: 'distance',
                    type: 'restaurant,bar,cafe'
                }}
                GooglePlacesDetailsQuery={{
                    // Hernede vælger vi så, hvad der skal kunne bruges når man skriver details... oppe i onPress.
                    fields: 'formatted_address,geometry,name'
                }}
                debounce={200} // devouncer req i ms
            />

            {/* Først vises den nuværende lokation med en blå, genkendelig knap */}
            <RenderCurrentLocation
                props={{hasLocationPermission: hasLocationPermission, currentLocation1: currentLocation1}}/>

            {/*Mapview er fremviser et kort, der viser brugerens lokation */}
            <MapView
                // Kortstil
                provider={'google'}
                // Startpunkt
                initialRegion={region}
                style={styles.map}
                showsUserLocation
                // Når man holder inde på kortet kaldes metoden, der skaber en "pin"
                onLongPress={handleLongPress}
            >
                {/* I Mapview vises en markør for den lokation, som region viser */}
                <Marker
                    coordinate={region}
                >
                    {
                        /*
                        Callout vil vise navnet på stedet man har trykket på fra Google-searchbar.
                        Når man trykker på denne Callout, vil alertboksen dukke op med knapperne fra metoden buttons.
                        */
                    }
                    <Callout onPress={() => buttons()}>
                        <Text>{place.name}</Text>
                    </Callout>
                </Marker>

                {/* Vi kalder her en markør for når man holder fingeren inde på et sted på kortet */}
                {userMarkerCoordinates.map((coordinate, index) => (
                    <Marker
                        coordinate={coordinate}
                        key={index.toString()}

                        // Et tryk på markøren printer bare "Action" i konsollen for at vise, at vi kunne have lavet
                        // noget logik her
                        onPress={() => console.log("Action")}
                    />
                ))}
            </MapView>
        </View>
    );
}

//Lokal styling til brug i Map
const styles = StyleSheet.create({
    map: {
        width: Dimensions.get("window").width,
        height: Dimensions.get("window").height,
    },
});

//Eksport af Map, således denne kan importeres og benyttes i andre komponenter
export default Map;