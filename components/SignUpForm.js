import React, {useState} from 'react';
import {
    Button,
    Text,
    View,
    TextInput,
    ActivityIndicator,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import firebase from 'firebase';
import StackNavigator from "@react-navigation/stack/src/navigators/createStackNavigator";
import Feed from "./Feed";

const SignUpForm = (props) => {

    //Instantiering af state-variabler, der skal benyttes i SignUpForm
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    //const [isCompleted, setIsCompleted] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null)

    /*
  * Metoden herunder håndterer oprettelse af brugere ved at anvende den prædefinerede metode, som stilles til rådighed af firebase
  * signInWithEmailAndPassword tager en mail og et password med som argumenter og foretager et asynkront kald, der eksekverer en brugeroprettelse i firebase
  * Opstår der fejl under forsøget på oprettelse, vil der i catch blive fremsat en fejlbesked, som, ved brug af
  * setErrorMessage, angiver værdien for state-variablen, errormessage
  */

    const handleSubmit = async() => {
        try {
            await firebase.auth().createUserWithEmailAndPassword(email, password).then((data)=>{
            });
        } catch (error){
            setErrorMessage(error.message+"hej")
        }
    }

    //I return oprettes en tekstkomponent, der angiver at dette er SignUpfrom
    //Dernæst er der to inputfelter, som løbeende sætter værdien af state-variablerne, mail og password.
    // Afslutningsvis, angives det at, hvis errorMessage får fastsat en værdi, skal denne udskrives i en tekstkomponent.
    return (
        <View style={styles.container}>

            <Text style={styles.header}>Opret Bruger</Text>
            <TextInput
                placeholder="Email"
                value={email}
                onChangeText={(email) => setEmail(email)}
                style={styles.inputField}
            />
            <TextInput
                placeholder="Password"
                value={password}
                onChangeText={(password) => setPassword(password)}
                secureTextEntry
                style={styles.inputField}
            />
            {errorMessage && (
                <Text style={styles.error}>Error: {errorMessage}</Text>
            )}
            <TouchableOpacity style={[styles.buttonContainer, styles.signUpButton]} onPress={() => handleSubmit(props.navigation.navigate('MainNavigator'))}>
                <Text style={styles.loginText}>Opret bruger</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#DFD0C0'
    },
    header: {
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: "bold",
        fontSize: 40,
    },
    inputField: {
        backgroundColor: '#fff',
        borderRadius:30,
        borderWidth: 1,
        width:250,
        height:45,
        marginBottom:15,
        flexDirection: 'row',
        alignItems:'center',
        textAlign: 'center'
    },
    buttonContainer: {
        height:45,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom:20,
        width:250,
        borderRadius:30,
    },
    signUpButton: {
        backgroundColor: '#B45626',
        shadowOpacity: 0.1,
    },
});

//Eksport af SignUpForm, således denne kan importeres og benyttes i andre komponenter
export default SignUpForm;