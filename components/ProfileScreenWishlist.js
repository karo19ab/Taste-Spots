// Funktionaliteter
import {
    View,
    Text,
    Image,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import React from 'react';
import firebase from 'firebase';

// Assets
import mogk from "../assets/mogk.png";
import hoest from "../assets/hoest.png";
import norrebro from "../assets/norrebro.png";
import restaurantSilo from "../assets/restaurantSilo.png";
import profilepicture from "../assets/profilepicture.png";

// Ikoner
import IonIcon from 'react-native-vector-icons/Ionicons';


const ProfileScreenWishlist = (props) => {

    // Samme som i ProfileScreen.js
    const handleLogOut = async () => {
        await firebase.auth().signOut();
    };

    return (
        <View style={styles.container}>

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
                        <Text category='s1' >
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

            {/* Her kan man skifte mellem ens anmeldelser, kort over hvor man har spist og ønskeliste */}
            <View style={[styles.userInfo, styles.bordered]}>
                <View style={styles.section}>
                    <TouchableOpacity onPress={() => props.navigation.navigate('Profile Screen')}>
                        <IonIcon name="restaurant-outline" size={17} color="black"/>
                    </TouchableOpacity>
                </View>
                <View style={styles.section}>
                    <TouchableOpacity onPress={() => props.navigation.navigate('Profile Screen Map')}>
                        <IonIcon name="map-outline" size={17} color="black"/>
                    </TouchableOpacity>
                </View>
                <View style={styles.section}>
                    <TouchableOpacity>
                        <IonIcon name="star" size={17} color="black"/>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Her viser vi en dummy- ønskeliste */}
            <ScrollView>
                <View style={styles.widgetlayout}>
                    <View>
                        <Image source={restaurantSilo} style={styles.widget}/>
                    </View>
                    <View>
                        <Image source={hoest} style={styles.widget}/>
                    </View>
                </View>
                <View style={styles.widgetlayout}>
                    <View>
                        <Image source={mogk} style={styles.widget}/>
                    </View>
                    <View>
                        <Image source={norrebro} style={styles.widget}/>
                    </View>
                </View>

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
        marginBottom: 5,
        marginTop: '10%'
    },
    header: {
        backgroundColor: "#DFD0C0",
    },
    headerContent: {
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
    name: {
        fontSize: 22,
        color: "#000000",
        fontWeight: '600',
    },
    UserInfo: {
        fontSize: 16,
        color: "#778899",
        fontWeight: '600',
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
    widget: {
        width: 170,
        height: 170,
        marginHorizontal: "2%",
        borderRadius: 15,
    },
    widgetlayout: {
        flexDirection: 'row',
        margin: '4%',
        alignItems: 'center'
    }
});

export default ProfileScreenWishlist