import * as React from 'react';
import {useState, useEffect} from 'react';
import {
    Button,
    Text,
    View,
    TextInput,
    Alert,
    ActivityIndicator,
    StyleSheet,
    SafeAreaView,
    ScrollView, Image,
} from 'react-native';
import firebase from "firebase";
import {Card} from "react-native-paper";
import SignUpForm from "./SignUpForm";
import LoginForm from "./LoginForm";

const AddFood = ({navigation, route}) => {


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
        const initialState = {brand: '', model: '', year: '', licensePlate: ''}

        const [newCar, setNewCar] = useState(initialState);

        /*Returnerer true, hvis vi er på edit car*/
        const isEditCar = route.name === "Edit Car";

        useEffect(() => {
            if (isEditCar) {
                const car = route.params.car[1];
                setNewCar(car)
            }
            //Fjern data, når vi går væk fra screenen
            return () => {
                setNewCar(initialState)
            };
        }, []);

        const changeTextInput = (name, event) => {
            setNewCar({...newCar, [name]: event});
        }

        const handleSave = () => {
            const {brand, model, year, licensePlate} = newCar;

            if (brand.length === 0 || model.length === 0 || year.length === 0 || licensePlate.length === 0) {
                return Alert.alert('Et af felterne er tomme');
            }

            if (isEditCar) {
                const id = route.params.car[0];
                try {
                    firebase
                        .database()
                        .ref(`/Cars/${id}`)
                        // Vi bruger update, så kun de felter vi angiver, bliver ændret
                        .update({brand, model, year, licensePlate});
                    // Når bilen er ændret, går vi tilbage.
                    Alert.alert("Din info er nu opdateret");
                    const car = [id, newCar]
                    navigation.navigate("Car Details", {car});
                } catch (error) {
                    console.log(`Error: ${error.message}`);
                }

            } else {
                try {
                    firebase
                        .database()
                        .ref('/Cars/')
                        .push({brand, model, year, licensePlate});
                    Alert.alert(`Saved`);
                    setNewCar(initialState)
                } catch (error) {
                    console.log(`Error: ${error.message}`);
                }
            }
        }

        return (
            <SafeAreaView style={styles.container}>
                <ScrollView>
                    {
                        Object.keys(initialState).map((key, index) => {
                            return (
                                <View style={styles.row} key={index}>
                                    <Text style={styles.label}>{key}</Text>
                                    <TextInput
                                        value={newCar[key]}
                                        onChangeText={(event) => changeTextInput(key, event)}
                                        style={styles.input}
                                    />
                                </View>
                            )
                        })
                    }
                    {/*Hvis vi er inde på edit car, vis save changes i stedet for add car*/}
                    <Button title={isEditCar ? "Save changes" : "Add car"} onPress={() => handleSave()}/>
                </ScrollView>
            </SafeAreaView>
        );
    }
}

export default AddFood;

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