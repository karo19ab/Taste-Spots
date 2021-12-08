import React, {useEffect, useState} from 'react';
import {
    View,
    Text,
    Button,
    StyleSheet,
    Image,
    ScrollView,
    TouchableOpacity,
    SafeAreaView,
    FlatList
} from 'react-native';
import firebase from 'firebase';
import {Card} from "react-native-paper";
import SignUpForm from "./SignUpForm";
import LoginForm from "./LoginForm";
import Feed from "./Feed";
import GlobalStyles from "../globalStyles/GlobalStyles";
import kasperProfile from "../assets/kasperProfile.png";
import profileMap from "../assets/profileMap.png"
import IonIcon from 'react-native-vector-icons/Ionicons';
import ProfileScreen from './ProfileScreen'


const ProfileScreenMap = (props) => {
    //useState til at vise ratings på profilside.
    const [ratings, setRatings] = useState('');

    //handleLogout håndterer log ud af en aktiv bruger.
    //Metoden er en prædefineret metode, som firebase stiller tilrådighed
    //Metoden er et asynkrontkald.
    const handleLogOut = async () => {
        console.log(firebase.auth().currentUser);
        await firebase.auth().signOut();
    };


    //Finder ud af om der er nogle ratings i firebase.
    useEffect(() =>{
        if(!ratings)
            firebase
                .database()
                .ref('/Ratings')
                .on('value', snapshot => {
                    setRatings(snapshot.val())
                });
    });
    console.log(ratings)

    // Flatlist forventer et array. Derfor tager vi alle values fra vores ratings objekt, og bruger som array til listen
    const ratingsArray = Object.values(ratings).filter(item => item.uid === firebase.auth().currentUser.uid);
    const ratingsKeys = Object.keys(ratings);

    //Hvis der af en eller anden grund ikke skulle være muligt at fremfinde den aktive bruger,
    //skal der udprintes en besked om dette igennem en tekstkomponent
    //I return() udnyttes en prædefineret metode, som firebase stiller til rådighed.
    // Metoden returnerer mailadressen af den aktive bruger.
    // Mailadressen udskrives ved brug af en tekstkomponent.

    return (
        <View style={styles.container} >
            {/*Et sted til at profilbillede og info om profilen*/}
            <View style={styles.header}>
                <View style={styles.headerContent}>
                    <Image source={kasperProfile} style={styles.image} />
                    <Text style={styles.name}>Kasper Rønbøg </Text>
                    <Text style={styles.UserInfo}>Østerbro </Text>
                </View>
                {/*Viser antal følgere, hvor mange man selv følger og hvor mange anbefalinger der er lavet af profilen*/}
                <View style={[styles.userInfo, styles.bordered]}>
                    <View style={styles.section}>
                        <Text category='s1' style={styles.space}>
                            33
                        </Text>
                        <Text appearance='hint' category='s2'>
                            Spots
                        </Text>
                    </View>
                    <View style={styles.section}>
                        <Text category='s1' style={styles.space}>
                            0
                        </Text>
                        <Text appearance='hint' category='s2'>
                            Followers
                        </Text>
                    </View>
                    <View style={styles.section}>
                        <Text category='s1' style={styles.space}>
                            0
                        </Text>
                        <Text appearance='hint' category='s2'>
                            Following
                        </Text>
                    </View>
                </View>
            </View>
            {/*Her kan man skifte mellem ens anmeldelser, mapview over hvor man har spist og ønskeliste.*/}
            <View style={[styles.userInfo, styles.bordered]}>
                <View style={styles.section}>
                    <TouchableOpacity onPress={() => props.navigation.navigate('Profile Screen')}>
                        <IonIcon name="restaurant-outline" size={17} color="black"></IonIcon>
                    </TouchableOpacity>
                </View>
                <View style={styles.section}>
                    <TouchableOpacity>
                        <IonIcon name="map" size={17} color="black"></IonIcon>
                    </TouchableOpacity>
                </View>
                <View style={styles.section}>
                    <TouchableOpacity onPress={() => props.navigation.navigate('Profile Screen Wish')}>
                        <IonIcon name="star-outline" size={17} color="black"></IonIcon>
                    </TouchableOpacity>
                </View>
            </View>
            {/*Nederst på profilsiden, hvor anmeldelserne oprettet af profilen bliver vist*/}
            <View>
                <Image source={profileMap} style={styles.map}/>
            </View>

            {/*Log ud knap*/}
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
    feedContainer: {
        flex: 1,
        borderWidth: 1,
        borderRadius:10,
        marginTop: "5%",
        padding: 5,
        height: 50,
        justifyContent:'center',
        backgroundColor: '#fff'
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
        margin: '8%',
    },
    paragraph2: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    buttonContainer: {
        height:50,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop:'5%',
        width:300,
        borderRadius:15,
        marginLeft: '10%',
        backgroundColor: '#B45626',
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
    space: {
        marginBottom: 3,//Mellemrum mellem fx "spots" og antal.
    },
    separator: {
        alignSelf: 'center',
        flexDirection: 'row',
        width: 1,
    },
    text: {
        color: 'black'
    },
    userInfo: {
        flexDirection: 'row',
        paddingVertical: 15,
    },
    map: {
        width: 400,
        height: 410,

    }
});

//Eksport af Loginform, således denne kan importeres og benyttes i andre komponenter
export default ProfileScreenMap