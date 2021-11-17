import * as React from 'react';
import {useState, useEffect} from 'react';
import {
    Button,
    Text,
    View,
    TextInput,
    Alert,
    StyleSheet,
    SafeAreaView,
    ScrollView, Image,
} from 'react-native';
import firebase from "firebase";
import {Card} from "react-native-paper";
import SignUpForm from "./SignUpForm";
import LoginForm from "./LoginForm";
import LoginPls from "./LoginPls";
import {GooglePlacesAutocomplete} from "react-native-google-places-autocomplete";

const AddRating = ({navigation, route}) => {

    <LoginPls/>

    if (!firebase.auth().currentUser) {
        return (
            <ScrollView>
                <Image
                    source={require('../assets/welcomePic.jpeg')}
                    style={styles.image}/>
                <Text style={styles.paragraph}>
                    Opret eller Login for at dele hvor du har spist for nylig!
                </Text>
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
    } else {
        const initialState = {Sted: '', Maden: '', Atmosfaeren: '', Service: '', ValueForMoney: '', Eventuelt: ''}
        let stedValgt = ''
        const objects =  Object.keys(initialState)
        const slice = objects.slice(1)

        const [newRating, setNewRating] = useState(initialState);

        /*Returnerer true, hvis vi er på edit Rating*/
        const isEditRating = route.name === "Edit Rating";

        useEffect(() => {
            if (isEditRating) {
                const rating = route.params.rating[1];
                setNewRating(rating)
            }
            //Fjern data, når vi går væk fra screenen
            return () => {
                setNewRating(initialState)
            };
        }, []);

        const changeTextInput = (name, event) => {
            setNewRating({...newRating, [name]: event});
        }

        const handleSave = () => {
            const {Sted, Maden, Atmosfaeren, Service, ValueForMoney, Eventuelt} = newRating;
            //Sted = stedValgt
            if (Maden.length === 0 || Atmosfaeren.length === 0 || Service.length === 0 || ValueForMoney.length === 0) {
                return Alert.alert('Et af felterne er tomme');
            }

            if (isEditRating) {
                const id = route.params.rating[0];
                try {
                    firebase
                        .database()
                        .ref(`/Ratings/${id}`)
                        // Vi bruger update, så kun de felter vi angiver, bliver ændret
                        .update({Maden, Atmosfaeren, Service, ValueForMoney, Eventuelt});
                    // Når bilen er ændret, går vi tilbage.
                    Alert.alert("Din info er nu opdateret");
                    const raing = [id, newRating]
                    navigation.navigate("Ratings Details", {raing});
                } catch (error) {
                    console.log(`Error: ${error.message}`);
                }

            } else {

                try {

                    firebase
                        .database()
                        .ref('/Ratings/')
                        .push({Sted, Maden, Atmosfaeren, Service, ValueForMoney, Eventuelt});
                    Alert.alert(`Saved`);
                    setNewRating(initialState)
                } catch (error) {
                    console.log(`Error: ${error.message}`);
                }
            }
        }

        return (
            <SafeAreaView style={styles.container}>

                <View>
                    <GooglePlacesAutocomplete
                        placeholder='Search'
                        miniLenght={2}
                        autoFocus={false}
                        fetchDetails={true}
                        renderDescription={row=>row.description}

                        onPress={(data, details = null) => {
                            //TODO Herunder kan man tilføje logik, når der trykkes på det søgte

                            // 'details' is provided when fetchDetails = true
                            console.log(details);
                            // Måske der skal laves en try-catch her...
                            stedValgt = details.name


                        }}
                        getDefaultValue={()=>''}
                        query={{
                            // Husk at kryptér API key, fordi ellers er den tilgængelig for alle!
                            key: 'AIzaSyCc8mR9JJqFV35qcL7WXn8nBvFPNGZ101w', // Google Places API som vi har skabt
                            language: 'en', // Resultatets sprog
                            types: "establishment", // Viser kun businesses. Kan desværre ikke sætte det til kun restauranter fx...
                            components: "country:dk", // Viser kun resultater fra DK
                            // Forsøger at sætte søgning til at søge inden for en radius af 20km af KBH (Virker ikke)
                        }}
                        styles={{
                            container: { flex: 0, width: "100%", zIndex: 1},
                            listView: {backgroundColor: "grey"},
                        }}
                        currentLocation={true}
                        currentLocationLabel='Current Location'
                        nearbyPlacesAPI='GooglePlacesSearch'
                        GoogleReverseGeocodingQuery={{
                            // kan bruges til reverse geocoding
                        }}
                        GooglePlacesSearchQuery={{
                            rankby: 'distance',
                            type: 'restaurant'
                        }}
                        GooglePlacesDetailsQuery={{
                            // Man skal bare skille fields ad med et komma-tegn.
                            // Mulige req kan ses her: https://developers.google.com/maps/documentation/places/web-service/details
                            fields: 'name,place_id,geometry,url'

                        }}
                        debounce={200} // devouncer req i ms. Sat til 0 for at fjerne debounce

                    />
                    {

                        slice.map((key, index) => {

                            return (
                                <View style={styles.row} key={index}>

                                    <Text style={styles.label}>{key}</Text>
                                    <TextInput
                                        value={newRating[key]}
                                        onChangeText={(event) => changeTextInput(key, event)}
                                        style={styles.input}
                                    />
                                </View>
                            )
                        })
                    }
                    {/*Hvis vi er inde på edit Rating, vis save changes i stedet for add Rating*/}
                    <Button title={isEditRating ? "Gem ændringer" : "Tilføj anmeldelse"} onPress={() => handleSave()}/>
                </View>
            </SafeAreaView>
        );
    }
}

export default AddRating;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        paddingTop: '5%',
        backgroundColor: '#FFFFFF',
        padding: 8,
    },
    row: {
        flexDirection: 'row',
        height: 30,
        margin: 10,
    },
    label: {
        fontWeight: 'bold',
        width: 100
    },
    input: {
        borderWidth: 1,
        padding:5,
        flex: 1
    },
    image: {
        marginHorizontal: "10%",
        marginTop: "5%",
        width: "80%",
        height: "25%",
    },
    paragraph: {
        margin: '5%',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    paragraph2: {
        marginTop: '50%',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});