import * as React from 'react';
import {useState, useEffect} from 'react';
import {
    Button,
    FlatList,
    Text,
    View,
    StyleSheet,
    TouchableOpacity,
    Image,
    ScrollView,
} from 'react-native';
import firebase from "firebase";
import {Card} from "react-native-paper";
import SignUpForm from "./SignUpForm";
import LoginForm from "./LoginForm";
import GlobalStyles from "../globalStyles/GlobalStyles"

import {MOCKUP_USERS} from "../const";

const Feed = ({navigation}) => {

    //Hvis der af en eller anden grund ikke skulle være muligt at fremfinde den aktive bruger,
    //skal der udprintes en besked om dette igennem en tekstkomponent

    const [ratings, setRatings] = useState('');

    useEffect(() =>{
        if(!ratings)
            firebase
                .database()
                .ref('/Ratings')
                .on('value', snapshot => {
                    setRatings(snapshot.val())
                });
    },[]);

    // Vi viser ingenting hvis der ikke er data
    if (!ratings) {

        return (
            <View style={styles.container}>
                <Image
                    source={require('../assets/welcomePic.jpeg')}
                    style={styles.image}/>
                <Text>
                    No posts found :(
                </Text>
                <TouchableOpacity style={styles.container} onPress={() => {
                    const rating = null
                    navigation.navigate('Add', rating)
                }}>
                    <Text>
                        Press here to rate a venue
                    </Text>
                </TouchableOpacity>
                <Text>Current user: { firebase.auth().currentUser && firebase.auth().currentUser.email}</Text>
            </View>
        );
    }

    const handleSelectRating = id => {
        /*Her søger vi direkte i vores array af ratings og finder rating objektet som matcher det vi har tilsendt*/
        const rating = Object.entries(ratings).find(rating => rating[0] === id /*id*/)
        navigation.navigate('Ratings Details', {rating});
    }

    // Flatlist forventer et array. Derfor tager vi alle values fra vores cars objekt, og bruger som array til listen
    const ratingsArray = Object.values(ratings);
    const ratingsKeys = Object.keys(ratings);

    // ratingsArray.forEach(item => console.log(item.uid))

    return (
        <View style={styles.page}>
            <Text style={styles.logoName}>Taste Spots</Text>
            <FlatList
                data={ratingsArray}
                // Vi bruger ratingsKeys til at finde ID på den aktuelle bil og returnerer dette som key
                keyExtractor={(item, index) => ratingsKeys[index]}
                renderItem={({item,index}) => { return(
                    <TouchableOpacity style={styles.container} onPress={() => handleSelectRating(ratingsKeys[index])}>
                        <Text>
                            {
            //Måske vi skulle lave et gennemsnit af mad, service, atmosfære og value for money i stedet for bare maden
                            }
                            {item.Sted}
                        </Text>
                    </TouchableOpacity>
                ) } }
            >
            </FlatList>
        </View>
    )
}

export default Feed;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        borderWidth: 1,
        borderRadius:10,
        marginTop: "5%",
        padding: 5,
        height: 50,
        justifyContent:'center',
        backgroundColor: '#fff'
    },
    page: {
        backgroundColor: "#fff"
    },
    label: {
        fontWeight: 'bold'
    },
    image: {
        marginHorizontal: "10%",
        marginTop: "10%",
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
        marginBottom: '30%'
    },
    logoName: {
        fontSize: 50,
        color: "black",
        marginLeft: "23%"
    }
});