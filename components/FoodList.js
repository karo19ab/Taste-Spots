import * as React from 'react';
import {useState, useEffect} from 'react';
import {
    Button,
    FlatList,
    Text,
    View,
    TextInput,
    ActivityIndicator,
    StyleSheet,
    TouchableOpacity, Image, ScrollView,
} from 'react-native';
import firebase from "firebase";
import AddFood from "./AddFood";
import {Card} from "react-native-paper";
import SignUpForm from "./SignUpForm";
import LoginForm from "./LoginForm";

const FoodList = ({navigation}) => {


    //Hvis der af en eller anden grund ikke skulle være muligt at fremfinde den aktive bruger,
    //skal der udprintes en besked om dette igennem en tekstkomponent
    if (!firebase.auth().currentUser) {

        //Her oprettes bruger state variblen
        const [user, setUser] = useState({loggedIn: false});

        //onAuthstatechanged er en prædefineret metode, forsynet af firebase, som konstant observerer brugerens status (logget ind vs logget ud)
        //Pba. brugerens status foretages et callback i form af setUSer metoden, som håndterer user-state variablens status.
        function onAuthStateChange(callback) {
            return firebase.auth().onAuthStateChanged(user => {
                if (user) {
                    callback({loggedIn: true, user: user});
                } else {
                    callback({loggedIn: false});
                }
            });
        }

        //Heri aktiverer vi vores listener i form af onAuthStateChanged, så vi dynamisk observerer om brugeren er aktiv eller ej.
        useEffect(() => {
            const unsubscribe = onAuthStateChange(setUser);
            return () => {
                unsubscribe();
            };
        }, []);


        return (
            <ScrollView>
                <Image
                    source={require('../assets/feedPic.jpeg')}
                    style={styles.image}/>

                <Text style={styles.paragraph}>
                    Opret eller Login for at se hvor dine venner har spist for nylig!
                </Text>

                <Card style={{padding:20}}>
                    <SignUpForm />
                </Card>

                <Card style={{padding:20}}>
                    <LoginForm />
                </Card>
                <Text style={styles.paragraph2}>
                    Tekst der skaber lidt plads til login-knap
                </Text>
            </ScrollView>
        );
    }


    const [cars, setCars] = useState('');


    useEffect(() =>{
        if(!cars)
            firebase
                .database()
                .ref('/Cars')
                .on('value', snapshot => {
                    setCars(snapshot.val())
                });
    },[]);

    // Vi viser ingenting hvis der ikke er data
    if (!cars) {

        return (
            <View>
                <Image
                    source={require('../assets/welcomePic.jpeg')}
                    style={styles.image}/>
                <Text>
                    No posts found :(
                </Text>
                <TouchableOpacity style={styles.container} onPress={() => {
                    const car = null
                    navigation.navigate('Add Car', car)
                }}>
                    <Text>
                        Press here to add a car
                    </Text>
                </TouchableOpacity>
                <Text>Current user: {firebase.auth().currentUser.email}</Text>
                <Button onPress={() => handleLogOut()} title="Log out" />
            </View>

        );
    }

    const handleSelectCar = id => {
        /*Her søger vi direkte i vores array af biler og finder bil objektet som matcher idet vi har tilsendt*/
        const car = Object.entries(cars).find(car => car[0] === id /*id*/)
        navigation.navigate('Car Details', {car});
    }

    // Flatlist forventer et array. Derfor tager vi alle values fra vores cars objekt, og bruger som array til listen
    const carArray = Object.values(cars);
    const carKeys = Object.keys(cars);

    return (
        <FlatList
            data={carArray}
            // Vi bruger carKeys til at finde ID på den aktuelle bil og returnerer dette som key,
            // og giver det med som ID til CarListItem
            keyExtractor={(item, index) => carKeys[index]}
            renderItem={({item,index}) => { return(
                <TouchableOpacity style={styles.container} onPress={() => handleSelectCar(carKeys[index])}>
                    <Text>
                        {item.brand}, {item.model}
                    </Text>
                </TouchableOpacity>
            ) } }
        >
        </FlatList>
    )
}

export default FoodList;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        borderWidth: 1,
        borderRadius:10,
        marginTop: "5%",
        padding: 5,
        height: 50,
        justifyContent:'center'
    },
    label: { fontWeight: 'bold' },
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
    },
});