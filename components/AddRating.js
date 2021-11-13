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
    ScrollView,
    Image,
} from 'react-native';
import firebase from "firebase";
import {Card} from "react-native-paper";
import SignUpForm from "./SignUpForm";
import LoginForm from "./LoginForm";
import Spot_Rating from "../SpotRating/Spot_Rating";


const AddRating = ({navigation, route}) => {


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
        const initialState = {"Noget ekstra du vil dele?": ''}

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
            const {initialState} = newRating;

            if (initialState.length === 0) {
                return Alert.alert('Et af felterne er tomme');
            }

            if (isEditRating) {
                const id = route.params.rating[0];
                try {
                    firebase
                        .database()
                        .ref(`/Ratings/${id}`)
                        // Vi bruger update, så kun de felter vi angiver, bliver ændret
                        .update({initialState});
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
                        .push({initialState});
                    Alert.alert(`Saved`);
                    setNewRating(initialState)
                } catch (error) {
                    console.log(`Error: ${error.message}`);
                }
            }
        }

        const ratingObj = {
            ratings: 3,
            views: 34000
        }
        return (
            <SafeAreaView style={styles.container}>
                <ScrollView>
                    {
                        Object.keys(initialState).map((key, index) => {
                            return (
                                <View key={index}>
                                    <Text style={styles.label}>
                                        Hvor mange spots vil du give xx
                                    </Text>
                                    <Spot_Rating ratingObj={ratingObj} style={styles.rating}/>
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
                    }
                    {/*Hvis vi er inde på edit Rating, vis save changes i stedet for add Rating*/}
                    <Button title={isEditRating ? "Gem ændringer" : "Tilføj anmeldelse"} onPress={() => handleSave()}/>
                </ScrollView>
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
        textAlign: "center",
        fontSize: 20,
    },
    input: {
        borderWidth: 1,
        padding:10,
        height: 40,
        margin: 15,
        marginTop: 5,

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
    rating: {

    }
});