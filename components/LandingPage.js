
import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    Alert,
    Image,
    ImageBackground,
    Button
} from 'react-native';
import GlobalStyles from "../globalStyles/GlobalStyles";
import { useFonts, Inter_900Black } from '@expo-google-fonts/inter';
import FirstImage from "../assets/spices1.png"



const LandingPage = (props) => {
    let [fontsLoaded] = useFonts({
        Inter_900Black,
    });
    return (
        <View style={GlobalStyles.container}>
            <ImageBackground source={FirstImage} resizeMode="cover" style={styles.landingImage}>
                <Text style={GlobalStyles.logoName}>Taste Spots</Text>
                <TouchableOpacity style={[GlobalStyles.buttonContainer, styles.signupButton]}>
                    <Text style={styles.loginText}>Opret bruger</Text>
                </TouchableOpacity>
                <Text style={styles.loginLink}>Har du allerede en bruger?
                    <TouchableOpacity>
                        <Text style={styles.loginLink}>Login her</Text>
                    </TouchableOpacity>
                </Text>
            </ImageBackground>
        </View>
    );
}

export default LandingPage;

const styles = StyleSheet.create({
    landingImage: {
        flex: 1,
        justifyContent: 'center',
    },
    text: {
        color: 'black',
        fontSize: 42,
        lineHeight: 84,
        fontWeight: 'bold',
        textAlign: 'center'
    },
    signupButton: {
        backgroundColor: 'black',
    },
    loginLink: {
        textAlign: 'center',
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 20,
        marginLeft: "1%",
        marginTop: "1%"
    },
    loginText: {
        color: "#fff",
        fontSize: 20,
        fontWeight: "bold"
    }
});