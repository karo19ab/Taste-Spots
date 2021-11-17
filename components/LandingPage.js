
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

import FirstImage from "../assets/spices1.png"
import LoginForm from "./LoginForm";



const LandingPage = (props) => {

    return (
        <View style={GlobalStyles.container}>
            <ImageBackground source={FirstImage} resizeMode="cover" style={styles.landingImage}>
                <Text style={GlobalStyles.logoName}>Taste Spots</Text>
                <TouchableOpacity style={[GlobalStyles.buttonContainer, styles.signupButton]}>
                    <Text style={styles.loginText}>Opret bruger</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={LoginForm}>
                    <Text style={styles.loginLink}>Har du allerede en bruger? <Text style={styles.loginHer}>Login her</Text></Text>
                </TouchableOpacity>
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
        backgroundColor: '#DFD0C0',
    },
    loginLink: {
        textAlign: 'center',
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 18,
        textShadowColor: 'black',
        textShadowOffset: {width: -1, height: 1},
        textShadowRadius: 10
    },
    loginText: {
        color: "#fff",
        fontSize: 20,
        fontWeight: "bold",
    },
    loginHer: {
        color: '#FFCC00'
    }
});