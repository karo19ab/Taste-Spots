// Funktionaliteter
import {
    Text,
    View,
    Alert,
    TextInput,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import * as React from 'react';
import {useState} from 'react';
import firebase from "firebase";
import StarRating from "react-native-star-rating";
import GlobalStyles from "../globalStyles/GlobalStyles";
import {GooglePlacesAutocomplete} from "react-native-google-places-autocomplete";

// Komponenter
import UploadPicture from "./UploadPicture";


const AddRating = () => {

    // Vi laver nogle useStates for at kunne håndtere de forskellige parametre i anmeldelsen
    const initialState = {uid: '', Sted: '', Vurdering: 3, Anbefaling: ''}
    const [newRating, setNewRating] = useState(initialState);
    // newSted laves, så den set'es i google-places, mens den kan kaldes efterfølgende.
    const [newSted, setNewSted] = useState('');
    const [newVurdering, setNewVurdering] = useState(3);


    // Logik til feltet hvor man kan skrive sin anbefaling.
    const changeAnbefalingInput = (text) => {
        // Hver gang man skriver noget i text-inputtet, så bliver newRating set'et med disse værdier.
        setNewRating({Anbefaling: text, Sted: newSted, Vurdering: newVurdering, uid: firebase.auth().currentUser.uid});

    }


    function handleSave() {
        // Hvis man ikke har skrevet noget i anbefaling eller i feltet til stedet vil man modtage en fejlmeddelelse
        if (newRating.Anbefaling === '' || newRating.Sted === '') {
            Alert.alert(`Et eller flere af felterne mangler at blive udfyldt :)`);

            // Hvis man derimod har skrevet noget i begge felter, vil følgende kode køres
        } else {
            // Vi starter med at instantiere vores forskellige parametre til at være vores newRating-useState
            const {uid, Sted, Vurdering, Anbefaling} = newRating;

            // Herefter foretager vi en try/catch med prædefinerede funktioner til at push'e de forskellige parametre ind i databasen.
            try {
                firebase
                    .database()
                    .ref('/Ratings/')
                    .push({uid, Sted, Vurdering, Anbefaling});
                Alert.alert(`Saved`);
                // Vi slutter af med at sætte newRating tilbage til dens initialState
                setNewRating(initialState)
                // Catch eventuel fejl med meddelelse i konsollen
            } catch (error) {
                console.log(`Error: ${error.message}`);
            }
        }

    }

    //Når man trykker på en af vores spots (fungerer som man normalt ville gøre med stjerner), så sætter vi useState til mængden af spots
    function onStarRatingPress(rating) {
        setNewVurdering(rating)
    }


    return (
        <View style={styles.container}>

            {
                /*
                GooglePlacesAutocomplete er smart fordi den kører på Google's API over steder.
                Den fungerer som et input felt der foreslår steder som vi definerer dem i koden nedenfor.
                */
            }
            <GooglePlacesAutocomplete
                placeholder='Search'
                minLenght={2}
                autoFocus={false}
                // Når vi sætter nedenstående til true, vil man kunne få Details med som kan bruges længere nede
                fetchDetails={true}
                renderDescription={row => row.description}

                /*
                Det er i onPress det mest spændende sker.
                Der er altså tale om logik, når man trykker på det Google's foreslåede sted
                */
                onPress={(data, details = null) => {
                    // useStaten newSted sættes til at være det navnet på stedet du trykker på
                    // fetchDetails satte til at være true længere oppe, hvilket er resulterer i at vi kan vælge den nedenfor.
                    // .name har vi valgt samme sted længere nede skulle være en mulighed at sende med.
                    setNewSted(details.name)
                }}
                getDefaultValue={() => ''}
                query={{
                    // Husk at kryptere API key hvis det skal være en rigtig app, fordi ellers er den tilgængelig for alle!
                    key: 'AIzaSyCc8mR9JJqFV35qcL7WXn8nBvFPNGZ101w', // API-nøgle
                    language: 'en', // Resultatets sprog
                    types: "establishment", // Der skal kun dukke virksomheder op i søgningen
                    components: "country:dk", // Kun resultater fra Danmark
                }}
                // Input-feltets style
                styles={{
                    container: {
                        flex: 0,
                        borderWidth: 1,
                        padding: 5,
                        margin: 15,
                        borderColor: "grey",
                        borderRadius: 10
                    },
                    listView: {backgroundColor: "grey"},
                }}
                nearbyPlacesAPI='GooglePlacesSearch'
                GoogleReverseGeocodingQuery={{
                    // ved ikke helt hvad man bruger dette til
                }}
                GooglePlacesSearchQuery={{
                    // Jeg synes ikke noget af det her virker, selvom jeg har prøvet at lege en del med det.
                    rankby: 'distance',
                    type: 'restaurant,bar,cafe'
                }}
                GooglePlacesDetailsQuery={{
                    // Hernede vælger vi så, hvad der skal kunne bruges når man skriver details... oppe i onPress.
                    fields: 'formatted_address,geometry,name'
                }}
                debounce={200} // devouncer req i ms

            />

            <Text style={styles.label}>
                Hvor mange spots vil du give stedet?
            </Text>

            {/* Koden til vores den mængde stjerner eller "spots" som man ønsker at tillægge restauranten */}
            <StarRating
                disabled={false}
                emptyStar={'ios-location-outline'}
                fullStar={'ios-location-sharp'}
                iconSet={'Ionicons'}

                // Her bestemmes hvor mange spots der skal kunne tildeles
                maxStars={6}

                // Nedenfor bestemmes hvor mange spots der skal vises
                rating={newVurdering}

                // Nu bestemmes hvad der skal ske, når man trykker på et spot
                selectedStar={(rating) => onStarRatingPress(rating)}
                fullStarColor={'#B45626'}
            />
            <Text style={styles.label}>
                Hvad skal dine venner vide?
            </Text>

            {
                /*
                Nedenfor har ret stor betydning for anmeldelserne, da det når man skriver ting ind i anbefaling at vi sætter
                de forskellige useStates såsom stedet man har valgt og antallet af spots man vil give.
                Dette betyder, at man ikke kan skrive en anbefaling før man vælger sted og/eller stjerner, for så bliver de ikke
                skrevet ind i databasen
                */
            }
            <TextInput
                onChangeText={(text) => changeAnbefalingInput(text)}
                style={styles.input}
                placeholder={"Fx maden, atmosfære, betjening, value for money.."}
            />

            <View>
                {/* Koden til at uploade et billede. Desværre har vi ikke sat det op med databasen for anmeldelser endnu */}
                <UploadPicture/>
            </View>

            {/* Knap til at uploade anmeldelsen til databasen */}
            <View style={{flex: 1, alignItems: 'center', padding: 15, bottom: 0}}>
                <TouchableOpacity style={GlobalStyles.generalButton} onPress={() => handleSave()}>
                    <Text>Tilføj anmeldelse</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

export default AddRating;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        marginTop: "11%"
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
        marginTop: "1%"
    },
    input: {
        borderWidth: 1,
        borderColor: "grey",
        padding: 10,
        height: 40,
        margin: 15,
        borderRadius: 10

    },
    image: {
        marginHorizontal: "10%",
        marginTop: "5%",
        width: "80%",
        height: "25%",
    },
});