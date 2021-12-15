// Funktionaliteter
import {
    Text,
    View,
    FlatList,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import * as React from 'react';
import firebase from "firebase";
import {useState, useEffect} from 'react';


const Feed = (props) => {
    // Vi starter ud med at lave en useState til vores anmeldelser
    const [ratings, setRatings] = useState('');

    // Herefter finder vi anmeldelserne og sætter ratings til at indeholde anmeldelserne
    useEffect(() => {
        if (!ratings)
            firebase
                .database()
                .ref('/Ratings')
                .on('value', snapshot => {
                    setRatings(snapshot.val())
                });
    }, []);

    // Vi viser en semi-tom side hvis der ikke findes nogen anmeldelser i databasen.
    if (!ratings) {
        return (
            <View style={styles.container}>
                <Text>
                    No posts found :(
                </Text>
            </View>
        );
    }


    const handleSelectRating = id => {
        // Her søger vi direkte i vores array af anmeldelser og finder ratings-objektet som matcher det vi har tilsendt
        const rating = Object.entries(ratings).find(rating => rating[0] === id /*id*/)
        // Efterfølgende navigerer vi videre hen til RatingDetails og sender den pågældende anmeldelse med
        props.navigation.navigate('Ratings Details', {rating});
    }

    // Flatlist forventer et array. Derfor tager vi alle values fra vores ratings-objekt, og bruger det som array til listen
    const ratingsArray = Object.values(ratings);
    // Det samme gøres for at finde keys
    const ratingsKeys = Object.keys(ratings);


    return (
        <View style={styles.page}>
            <Text style={styles.logoName}>Taste Spots</Text>
            <FlatList
                // Som sagt skal smider vi vores ratings-objekters values ind som data
                data={ratingsArray}

                // Vi bruger ratingsKeys til at finde ID på den aktuelle bil og returnerer dette som key
                keyExtractor={(item, index) => ratingsKeys[index]}
                renderItem={({item, index}) => {
                    return (

                        // Vi laver en TouchableOpacity der kalder handleSelectRating når man trykker.
                        <TouchableOpacity style={styles.container}
                                          onPress={() => handleSelectRating(ratingsKeys[index])}>
                            <Text style={{fontWeight: 'bold', fontSize: 20}}>
                                {item.Sted}
                            </Text>
                            <Text style={{fontSize: 18}}>
                                ⭐️ {item.Vurdering}/6
                            </Text>
                            <Text style={{fontSize: 15}}>
                                Anbefaling: {item.Anbefaling}
                            </Text>

                        </TouchableOpacity>
                    )
                }}
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
        borderRadius: 10,
        marginTop: "5%",
        padding: 5,
        justifyContent: 'center',
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
        textAlign: 'center'
    }
});