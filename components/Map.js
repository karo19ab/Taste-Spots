import React, {useEffect, useState} from 'react';
import {
    View,
    Text,
    Button,
    StyleSheet,
    Image,
    ScrollView,
    Dimensions,
    Alert
} from 'react-native';
import firebase from 'firebase';
import {Card} from "react-native-paper";
import SignUpForm from "./SignUpForm";
import LoginForm from "./LoginForm";
import Constants from 'expo-constants';
import MapView, {Marker,Callout} from 'react-native-maps';
import * as Location from 'expo-location';
import {Accuracy} from "expo-location";
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import LoginPls from "./LoginPls";
import {render} from "react-dom";




function Map () {

   <LoginPls/>

    // -------------------------------------------------------------------------------------

    const initialState = {name: '', lati: '', longi: '', uid: ''}
    const [newSpotWish, setNewSpotWish] = useState(initialState);



    //Her instantieres alle anvendte statevariabler
    const [hasLocationPermission, setlocationPermission] = useState(false)
    const [currentLocation1, setCurrentLocation] = useState(null)
    const [userMarkerCoordinates, setUserMarkerCoordinates] = useState([])
    const [selectedCoordinate, setSelectedCoordinate] = useState(null)
    const [selectedAddress, setSelectedAddress] = useState(null)

    /*
    * getLocationPermission udnytter den prædefinerede asynkrone metode requestForegroundPermissionsAsync,
    * som aktiverer en forespørgsel om tilladelse til at benytte enhedens position
    * resultatet af denne handling leveres og benyttes til at sætte værdien af locationPermission
    * Værdien sættes pba. af værdien item.granted
    * Læs mere i dokumentationen:  https://docs.expo.dev/versions/latest/sdk/location/
    */
    const getLocationPermission = async () => {
        await Location.requestForegroundPermissionsAsync().then((item)=>{
            setlocationPermission(item.granted)
        } );

    };

    // I useEffect kaldes getlocationPermission, der sikrer at enheden forespørger tilladelse
    // så snart appen kører
    useEffect (() => {
        const response = getLocationPermission()
    });

    /*
    * Metoden updateLocation udnytter det prædefinerede asynkrone kald, getCurrentPositionAsync, returnerer enhedens aktuelle position
    * Resultatet fra kaldet benyttes til at fastsætte værdien af currentlokation.
    * argumentet, Accuracy.Balanced, angiver den nøjagtighed vi ønsker skal bruges til at angive positionen.
    * Læs mere på den førnævnte dokumentation
    */
    const updateLocation = async () => {
        await Location.getCurrentPositionAsync({accuracy: Accuracy.Balanced}).then((item)=>{
            setCurrentLocation(item.coords)
        } );
    };
    /*
    * Metoden handleLongPress tager en event med som argument og henter værdien af et koordinatsæt fra denne
    * Værdien gemmes i en variabel, der tilføjes til et array af koordinater.
    */
    const handleLongPress = event => {
        const coordinate = event.nativeEvent.coordinate
        setUserMarkerCoordinates((oldArray) => [...oldArray, coordinate])
    };

    /*
  * Metoden handleSelectMarker tager en koordinat med som argument. Kordinaten bruges
  * til at sætte værdien af selectedCoordinat-variablen
  * Dernæst aktiveres et asynkront kald, i form af den prædefinerede metode, reverseGeocodeAsync.
  * reverseGeocodeAsync omsætter koordinatsættet til en række data, herunder område- og adresse data.
  * selectedAdress sættes til at være resultatet af det asynkrone kald
    */
    const handleSelectMarker = async coordinate =>{
        setSelectedCoordinate(coordinate)
        await Location.reverseGeocodeAsync(coordinate).then((data) => {
                setSelectedAddress(data)
            }
        )
    };


    //Metoden closeInfoBox nulstiller værdienne fro selectedAddress og selectedCoordinate
    const closeInfoBox = () =>
        setSelectedCoordinate(null) && setSelectedAddress(null)

    // RenderCurrentLocation tager props med som argument og tjekker om, der er givet adgang til enhedens lokationsdata
    // Er der ikke givet adgang returneres der en tekstkomponent med instruktioner til brugeren
    //Er der givet tilladelse og currenLocation ikke har en værdi, vil der fremvises en knap komponent
    //Er der givet tilladelse go currentlokation har en værdi, vil lokationsdata blive udskrvet i en infoboks
    const RenderCurrentLocation = (props) => {
        if (props.hasLocationPermission === null) {
            return null;
        }
        if (props.hasLocationPermission === false) {
            return <Text>No location access. Go to settings to change</Text>;
        }
        return (
            <View>
                <Button style title="update location" onPress={updateLocation} />
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

    const [region, setRegion] = React.useState({
        latitude: 55.676098,
        longitude: 12.568337,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    })

    const [place, setPlace] = React.useState({
        name: 'Rådhuspladsen'
    })


    function savePlace () {
        const {name, lati, longi, uid} = newSpotWish;
        try {
            firebase
                .database()
                .ref('/SpotWishlist/')
                .push({name, lati, longi, uid});
            Alert.alert(`Added to Wishlist :)`);
            setNewSpotWish(initialState)
        } catch (error) {
            console.log(`Error: ${error.message}`);
        }
    }

    function buttons () {
        Alert.alert (
            `${newSpotWish.name}`,
            'What do you wish to do with this spot?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel'
                },
                {
                    text: 'Add to Wishlist',
                    onPress: () => savePlace()
                },
                {
                    text: 'Rate the Spot',
                    onPress: () => console.log(newSpotWish)
                }
            ]
        )
    }



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

    }else
        /*
  * Dernæst kaldes RenderCurrenokation view
  * Mapview er fremviser et kort, der viser brugerens lokation
  * Dernæst aktiverer metoden handleLongPress igennem onLongPress
  * I Mapview vises tre markører ud fra vilkårlige koordinatsæt. Hver markør får en titel og en beskrivelse
  * Derudover vil alle koordinatsæt i userMarkerCoordinates blive vist som markører på kortet.
  * For hver af markørerne vil metoden handleSelectMarker blive aktiveret ved onPress,
  * hvorved selectedCoordinate og selectedAddres får en værdi og der udskrives data om den vaælgte markør
  *
  */


    {
        return (
            <View style= {styles.container}>
                {
                    // https://www.npmjs.com/package/react-native-google-places-autocomplete
                    // Video: https://www.youtube.com/watch?v=qlELLikT3FU&ab_channel=DarwinTech

                }
                <GooglePlacesAutocomplete
                    placeholder='Search'
                    minLenght={2}
                    autoFocus={false}
                    fetchDetails={true}
                    renderDescription={row=>row.description}

                    onPress={(data, details = null) => {
                        //TODO Herunder kan man tilføje logik, når der trykkes på det søgte

                        // Vil forsøge at gøre så man laver en "pin" og zoomer ind på stedet, når man søger
                        setRegion({
                            latitude: details.geometry.location.lat,
                            longitude: details.geometry.location.lng,
                            latitudeDelta: 0.05,
                            longitudeDelta: 0.0321,
                        })
                        setPlace({
                            name: details.name
                        })

                        setNewSpotWish({
                            name: details.name,
                            lati: details.geometry.location.lat,
                            longi: details.geometry.location.lng,
                            uid: firebase.auth().currentUser.uid,
                        })

                       // buttons();

                    }}
                    getDefaultValue={()=>''}
                    query={{
                        // Husk at krypter API key, fordi ellers er den tilgængelig for alle!
                        key: 'AIzaSyCc8mR9JJqFV35qcL7WXn8nBvFPNGZ101w',
                        language: 'en', // Resultatets sprog
                        types: "establishment",
                        components: "country:dk",
                        radius: 10000,



                    }}
                    styles={{
                        container: { flex: 0, position: "absolute", width: "100%", zIndex: 1, paddingTop: 60, paddingHorizontal: 10},
                        listView: {backgroundColor: "grey"},
                    }}
                    //currentLocation={true}
                    //currentLocationLabel='Current Location'
                    nearbyPlacesAPI='GooglePlacesSearch'
                    GoogleReverseGeocodingQuery={{
                        // ved ikke helt hvad man bruger dette til
                    }}
                    GooglePlacesSearchQuery={{
                        rankby: 'distance',
                        type: 'restaurant,bar,cafe'
                    }}
                    GooglePlacesDetailsQuery={{
                        fields: 'formatted_address,geometry,name'
                    }}
                    debounce={200} // devouncer req i ms. Sat til 0 for at fjerne debounce

                />

                {
                    <RenderCurrentLocation props={{hasLocationPermission: hasLocationPermission, currentLocation1: currentLocation1}} />
                }
                <MapView
                    provider={'google'}
                    initialRegion={region}
                    style={styles.map}
                    //style={styles.map}


                    showsUserLocation
                    onLongPress={handleLongPress}
                    >

                    <Marker
                        coordinate={region}
                        // TODO Skal lige have tilføjet en slags zoom funktion, så man følger pin
                    >
                        <Callout onPress={() => buttons()}>
                            <Text>{place.name}</Text>
                        </Callout>

                    </Marker>


                    {userMarkerCoordinates.map((coordinate, index) => (
                        <Marker
                            coordinate={coordinate}
                            key={index.toString()}
                            onPress={() => handleSelectMarker(coordinate)}
                        />
                    ))}



                </MapView>

                {selectedCoordinate && selectedAddress && (
                    <View style={styles.infoBox}>
                        <Text style={styles.infoText}>
                            {selectedCoordinate.latitude}, {selectedCoordinate.longitude}
                        </Text>
                        <Text style={styles.infoText}>
                            name: {selectedAddress[0].name}  region: {selectedAddress[0].region}
                        </Text>
                        <Button title="close" onPress={closeInfoBox} />
                    </View>
                )}

            </View>
        );
    }
}

//Lokal styling til brug i Map
const styles = StyleSheet.create({
    container: {
        //flex: 1,
        //justifyContent: 'center',
        //paddingTop: Constants.statusBarHeight,
        //backgroundColor: '#ecf0f1',
        //padding: 8,
    },
    map: {
        width: Dimensions.get("window").width,
        height: Dimensions.get("window").height,
    },
    infoBox: {
        height: 200,
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'yellow',
        justifyContent: 'center',
        alignItems: 'center',
    },
    infoText: {
        fontSize: 15,
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
        textAlign: 'left',
    }
});

//Eksport af Loginform, således denne kan importeres og benyttes i andre komponenter
export default Map;
