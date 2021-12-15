// Funktionaliteter
import {
    View,
    Text,
    Alert,
    Button,
    Platform,
    StyleSheet,
} from 'react-native';
import * as React from 'react';
import firebase from 'firebase';
import {useEffect, useState} from "react";

const RatingDetails = ({route, navigation}) => {
    // useState til rating
    const [rating, setRating] = useState({});

    useEffect(() => {
        // Henter rating values og sætter dem
        setRating(route.params.rating[1]);

        //Når vi forlader screen tømmes rating
        return () => {
            setRating({})
        }
    });

    // Nedenfor ses logik for når man trykker på delete raiting
    const confirmDelete = () =>{
        // Vi sikrer os først at man er på en iPhone eller Android
        if(Platform.OS ==='ios' || Platform.OS ==='android'){
            // Hvis man er det, så laver vi følgende besked
            Alert.alert('Are you sure?', 'Do you want to delete the rating?', [
                // Tilføjer muligheden for at annullere
                { text: 'Cancel', style: 'cancel' },
                // Vi bruger handleDelete som eventHandler til onPress hvis man trykker på 'Delete'
                { text: 'Delete', style: 'destructive', onPress: () => handleDelete() },
            ]);
        }
    }

    // Logik til når man trykke på 'Delete' i koden ovenfor.
    const handleDelete = () =>{
        // Først instantieres den pågældende anmeldelses id
        const id = route.params.rating[0];
        // Herefter laver vi en try/catch der sletter anmeldelsen vha. prædefinerede Firebase-funktioner.
        try {
            firebase
                .database()
                // Vi sætter anmeldelsens ID ind i ref-stien
                .ref(`/Ratings/${id}`)
                // Derefter fjerner data derfra
                .remove();
            // Og går tilbage når det er udført
            navigation.goBack();
        // Vi catcher med fejlmeddelelse som en alert-boks
        }catch (error){
            Alert.alert(error.message)
        }
    }

    // Er man kommet ind på en detalje-side på en anmeldelse som IKKE findes, så returnerer vi bare følgende besked
    if (!rating){
        return <Text>Can't seem to find the rating...</Text>;
    }

    // Hvis man derimod kommer ind på en detalje-side på en anmeldelse som rent faktisk findes, så bliver følgende kode returneret.
    return (
        <View style={styles.container}>

            {/* Øverst viser vi Delete-knappen */}
            <Button title='Delete' onPress={() =>confirmDelete()}/>

            {
                // Derefter bliver detaljerne fra anmeldelsen returneret.
                Object.entries(rating).map((item,index)=>{
                    return(
                        <View style={styles.row} key={index}>
                            {/*Vores rating keys navn*/}
                            <Text style={styles.label}>{item[0]} </Text>
                            {/*Vores rating values navne */}
                            <Text style={styles.value}>{item[1]}</Text>
                        </View>
                    )
                })

            }
        </View>
    )
}

export default RatingDetails;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        marginTop: "10%"
    },
    row: {
        margin: 5,
        padding: 5,
        flexDirection: 'row',
    },
    label: { width: 100, fontWeight: 'bold' },
    value: { flex: 1 },
});