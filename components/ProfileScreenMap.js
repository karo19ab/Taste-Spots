// Funktionaliteter
import {
    View,
    Text,
    Image,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import React from 'react';
import firebase from 'firebase';

// Assets
import profileMap from "../assets/ProfileMap.png"
import profilepicture from "../assets/profilepicture.png";

// Ikoner
import IonIcon from 'react-native-vector-icons/Ionicons';


const ProfileScreenMap = (props) => {

    // Samme som i ProfileScreen.js
    const handleLogOut = async () => {
        await firebase.auth().signOut();
    };



    // I return() viser vi profilen + vores hjemmelavede tabs (som alle er beskrevet i ../ProfileScreen),
    // et dummy-billede som skal forestille et overblik over de steder man har anmeldt,
    // og til sidst en logud-knap (som også er beskrevet i ../ProfileScreen)
    return (
        <View style={styles.container} >

            {/* Vi viser en dummy profil øverst */}
            <View style={styles.header}>
                <View style={styles.headerContent}>
                    <Image source={profilepicture} style={styles.image}/>
                    <Text style={styles.name}>* Profilnavn * </Text>
                    <Text style={styles.UserInfo}> * Biografi * </Text>
                </View>

                {/* Vi viser dummy antal følgere, hvor mange man selv følger og hvor mange anbefalinger der er lavet af profilen */}
                <View style={[styles.userInfo, styles.bordered]}>
                    <View style={styles.section}>
                        <Text category='s1'>
                            33
                        </Text>
                        <Text appearance='hint' category='s2'>
                            Spots
                        </Text>
                    </View>
                    <View style={styles.section}>
                        <Text category='s1'>
                            423
                        </Text>
                        <Text appearance='hint' category='s2'>
                            Followers
                        </Text>
                    </View>
                    <View style={styles.section}>
                        <Text category='s1'>
                            249
                        </Text>
                        <Text appearance='hint' category='s2'>
                            Following
                        </Text>
                    </View>
                </View>
            </View>

            {/*Her kan man skifte mellem ens anmeldelser, kort over hvor man har spist og ønskeliste.*/}
            <View style={[styles.userInfo, styles.bordered]}>
                <View style={styles.section}>
                    <TouchableOpacity onPress={() => props.navigation.navigate('Profile Screen')}>
                        <IonIcon name="restaurant-outline" size={17} color="black"/>
                    </TouchableOpacity>
                </View>
                <View style={styles.section}>
                    <TouchableOpacity>
                        <IonIcon name="map" size={17} color="black"/>
                    </TouchableOpacity>
                </View>
                <View style={styles.section}>
                    <TouchableOpacity onPress={() => props.navigation.navigate('Profile Screen Wish')}>
                        <IonIcon name="star-outline" size={17} color="black"/>
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView>
                {/* Tilføjet dumy-billede */}
                <Image source={profileMap} style={styles.map}/>

                {/* Log ud knap som TouchableOpacity */}
                <TouchableOpacity style={styles.buttonContainer} onPress={() => handleLogOut()}>
                    <Text style={styles.loginText}>Log ud</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}

//Lokal styling til brug i ProfileScreen
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#fff',
    },
    image: {
        width: 90,
        height: 90,
        borderRadius: 63,
        borderWidth: 4,
        borderColor: "white",
        marginBottom:5,
        marginTop: '10%'
    },
    header:{
        backgroundColor: "#DFD0C0",
    },
    headerContent:{
        marginHorizontal: "6%",
        marginTop: '2%',
    },
    buttonContainer: {
        height: 50,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: '5%',
        width: 300,
        borderRadius: 15,
        marginLeft: '10%',
        backgroundColor: '#DFD0C0',
        shadowOpacity: 0.1,
    },
    name:{
        fontSize:22,
        color:"#000000",
        fontWeight:'600',
    },
    UserInfo:{
        fontSize:16,
        color:"#778899",
        fontWeight:'600',
    },
    section: {
        flex: 1,
        alignItems: 'center',
    },
    bordered: {
        borderBottomWidth: 1,
    },
    userInfo: {
        flexDirection: 'row',
        paddingVertical: 15,
    },
    map: {
        width: "100%",
        height: 380,

    }
});

//Eksport af Loginform, således denne kan importeres og benyttes i andre komponenter
export default ProfileScreenMap