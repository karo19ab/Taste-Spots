// Funktionaliteter
import {
    Text,
    View,
    TextInput,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import firebase from 'firebase';
import React, {useState} from 'react';


const LoginForm = (props) => {
    //Instantiering af state-variabler, der skal benyttes i SignUpForm
    const [email, setEmail] = useState('h@kr.kr');
    const [password, setPassword] = useState('qwerty');
    const [errorMessage, setErrorMessage] = useState(null)

    /*
    Metoden herunder håndterer oprettelse af brugere ved at anvende den prædefinerede metode, som stilles til rådighed af firebase.
    signInWithEmailAndPassword tager en email og et password med som argumenter og foretager et asynkront kald, der eksekverer et login i firebase
    Opstår der fejl under forsøget på login, vil der i catch blive fremsat en fejlbesked, som, ved brug af
    setErrorMessage, angiver værdien for state-variablen, errormessage
    */
    const handleSubmit = async() => {
        try {
            await firebase.auth().signInWithEmailAndPassword(email, password).then((data)=>{
            });
        } catch (error){
            setErrorMessage(error.message)
        }
    }

    // I return oprettes en tekstkomponent, der angiver at dette er Login-formen
    // Dernæst er der to inputfelter, som løbende sætter værdien af state-variablerne, mail og password
    // Derefter angives det at, hvis errorMessage får fastsat en værdi, skal denne udskrives i en tekstkomponent
    // Ved tryk på knappen kaldes handleSubmit ovenfor
    return (
        <View style={styles.container}>
            <Text style={styles.header}>Log in</Text>
            <TextInput
                style={{borderWidth:1}}
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
            <TouchableOpacity style={[styles.buttonContainer, styles.loginButton]} onPress={() => handleSubmit(props.navigation.navigate('MainNavigator'))}>
                <Text style={styles.loginText}>Login</Text>
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
        borderColor: 'black',
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
    loginButton: {
        backgroundColor: '#B45626',
        shadowOpacity: 0.1,
    },
});

//Eksport af LoginForm, således denne kan importeres og benyttes i andre komponenter
export default LoginForm;