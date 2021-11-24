import * as React from 'react';
import {useState, useEffect} from 'react';
import {
    Button,
    Text,
    View,
    FlatList,
    TextInput,
    Alert,
    StyleSheet,
    SafeAreaView,
    ScrollView,
    Image, TouchableOpacity,
} from 'react-native';
import firebase from "firebase";
import {Card} from "react-native-paper";
import SignUpForm from "./SignUpForm";
import LoginForm from "./LoginForm";
// import LoginPls from "./LoginPls";
import {GooglePlacesAutocomplete} from "react-native-google-places-autocomplete";
import SpotRating from "./SpotRating";
import UploadPicture from "./UploadPicture";
import GlobalStyles from "../globalStyles/GlobalStyles"

const AddRating = ({navigation, route}) => {

    const initialState = {uid: '', Sted: '', Anbefaling: ''}
    const [newRating, setNewRating] = useState(initialState);
    // newSted laves, så den set'es i google-places, mens den kan kaldes efterfølgende.
    const [newSted, setNewSted] = useState('');


    const changeAnbefalingInput = (text) => {
        // Hver gang man skriver noget i text-inputtet, så bliver newRating set'et med disse værdier.
        setNewRating({Anbefaling: text, Sted: newSted, uid: firebase.auth().currentUser.uid});
        //console.log(<SpotRating.state.starCount/>)
    }


    function handleSave() {
        // Den rating som er lavet når man skriver i inputfeltet vil blive pushet.
        // Hvis ikke der står noget i Anbefalingsfeltet, så vil der komme en alert.

        if (newRating.Anbefaling === '' || newRating.Sted === '') {
            Alert.alert(`Et eller flere af felterne mangler at blive udfyldt :)`);
        } else {
            const {uid, Sted, Anbefaling} = newRating;
            try {

                firebase
                    .database()
                    .ref('/Ratings/')
                    .push({uid, Sted, Anbefaling});
                Alert.alert(`Saved`);
                setNewRating(initialState)
            } catch (error) {
                console.log(`Error: ${error.message}`);
            }
        }

    }


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


    return (
        <SafeAreaView style={styles.container}>
            <GooglePlacesAutocomplete
                placeholder='Search'
                minLenght={2}
                autoFocus={false}
                fetchDetails={true}
                renderDescription={row => row.description}

                onPress={(data, details = null) => {
                    //TODO Herunder kan man tilføje logik, når der trykkes på det søgte

                    // newSted sættes til at være det navnet på stedet du trykker på.
                    setNewSted(details.name)


                    // buttons();

                }}
                getDefaultValue={() => ''}
                query={{
                    // Husk at krypter API key, fordi ellers er den tilgængelig for alle!
                    key: 'AIzaSyCc8mR9JJqFV35qcL7WXn8nBvFPNGZ101w',
                    language: 'en', // Resultatets sprog
                    types: "establishment",
                    components: "country:dk",
                }}
                styles={{
                    container: {
                        flex: 0,
                        borderWidth: 1,
                        padding: 5,
                        margin: 15,
                        borderColor: "grey",
                        borderRadius: 20
                    },
                    listView: {backgroundColor: "grey"},
                }}
                //currentLocation={true}
                //currentLocationLabel='Current Location'
                nearbyPlacesAPI='GooglePlacesSearch'
                GoogleReverseGeocodingQuery={{
                    // ved ikke helt hvad man bruger dette til
                }}
                GooglePlacesSearchQuery={{
                    // Tror ikke noget af det her virker :(
                    rankby: 'distance',
                    type: 'restaurant,bar,cafe'
                }}
                GooglePlacesDetailsQuery={{
                    fields: 'formatted_address,geometry,name'
                }}
                debounce={200} // devouncer req i ms. Sat til 0 for at fjerne debounce

            />

            {/*
                    Object.keys(initialState).map((key, index) => {
                        return (
                            <View key={index}>
                                <Text style={styles.label}>
                                    Hvor mange spots vil du give stedet?
                                </Text>
                                <SpotRating/>
                                <Text style={styles.label}>{key}</Text>
                                <TextInput
                                    value={newRating[key]}
                                    onChangeText={(event) => changeTextInput(key, event)}
                                    style={styles.input}
                                    placeholder={"Hvad skal dine venner vide?"}
                                />
                            </View>
                        )
                    })
                    */
            }
            <Text style={styles.label}>
                Hvor mange spots vil du give stedet?
            </Text>
            <SpotRating/>
            <TextInput
                //value={newRating}
                onChangeText={(text) => changeAnbefalingInput(text)}
                style={styles.input}
                placeholder={"Hvad skal dine venner vide?"}
            />
            {/*Hvis vi er inde på edit Rating, vis save changes i stedet for add Rating*/}
            <View>
                <UploadPicture/>
            </View>
            <View style={{ flex: 1, alignItems: 'center', padding:15, marginTop: '5%'}}>
                <TouchableOpacity style={GlobalStyles.generalButton} onPress={() => handleSave()} >
                    <Text style={GlobalStyles.buttonTxt}>Tilføj anmeldelse</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

export default AddRating;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#fff',
    },
    row: {
        flexDirection: 'row',
        height: 30,
        margin: 10,
    },
    label: {
        fontWeight: 'bold',
        textAlign: "center",
        fontSize: 25,
        marginTop: 20
    },
    input: {
        borderWidth: 1,
        borderColor: "grey",
        padding: 10,
        height: 40,
        margin: 15,
        marginTop: "10%",

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