
import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    Alert,
    Image,
    ImageBackground, Button
} from 'react-native';

import FirstImage from "../assets/spices1.png"


const LandingPage = (props) => {

    return (
        <View style={styles.container}>
            <ImageBackground source={FirstImage} resizeMode="cover" style={styles.image}>
                <TouchableOpacity style={[styles.buttonContainer, styles.loginButton]}>
                    <Text style={styles.loginText}>Opret bruger</Text>
                </TouchableOpacity>
                <Text style={styles.loginLink}>Har du allerede en bruger? <Button title={"Log in her"}/></Text>
            </ImageBackground>


        </View>
    );
}

export default LandingPage;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    image: {
        flex: 1,
        justifyContent: 'center',
    },
    text: {
        color: 'white',
        fontSize: 42,
        lineHeight: 84,
        fontWeight: 'bold',
        textAlign: 'center',
        backgroundColor: '#fff',
    },
    buttonContainer: {
        height:45,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop:'130%',
        width:300,
        borderRadius:15,
        marginLeft: '10%'
    },
    loginButton: {
        backgroundColor: '#fff',
    },
    loginLink: {
        textAlign: 'center',
        color: 'white',
        fontWeight: 'bold',
    }
});