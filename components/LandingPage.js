// Funktionaliteter
import {
    Text,
    View,
    StyleSheet,
    ImageBackground,
    TouchableOpacity,
} from 'react-native';
import React from 'react';
import GlobalStyles from "../globalStyles/GlobalStyles";

// Assets
import FirstImage from "../assets/spices1.png"

const LandingPage = (props) => {
    return (
        <View style={GlobalStyles.container}>
            <ImageBackground source={FirstImage} resizeMode="cover" style={styles.landingImage}>
                <Text style={GlobalStyles.logoName}>Taste Spots</Text>

                {/* Knap til sign up */}
                <TouchableOpacity style={[GlobalStyles.buttonContainer, styles.signupButton]} onPress={() => props.navigation.navigate('SignUpForm')}>
                    <Text style={styles.loginText}>Opret bruger</Text>
                </TouchableOpacity>

                {/* Knap til login */}
                <TouchableOpacity onPress={() => props.navigation.navigate('Login')}>
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
    signupButton: {
        backgroundColor: '#B45626',
        shadowOpacity: 0.1,
    },
    loginLink: {
        textAlign: 'center',
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 18,
        textShadowColor: 'black',
        textShadowOffset: {width: -1, height: 1},
        textShadowRadius: 10,
        marginTop: '5%'
    },
    loginText: {
        color: "#fff",
        fontSize: 20,
    },
    loginHer: {
        color: '#FFBA0A'
    }
});