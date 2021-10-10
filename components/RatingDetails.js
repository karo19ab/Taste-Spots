import * as React from 'react';
import { View, Text, Platform, StyleSheet, Button, Alert } from 'react-native';
import firebase from 'firebase';
import {useEffect, useState} from "react";

const RatingDetails = ({route, navigation}) => {
    const [rating, setRating] = useState({});

    useEffect(() => {
        /*Henter rating values og sætter dem*/
        setRating(route.params.rating[1]);

        /*Når vi forlader screen, tøm object*/
        return () => {
            setRating({})
        }
    });

    const handleEdit = () =>{
        // Vi navigerer videre til EditRating skærmen og sender bilen videre med
        const rating = route.params.rating
        navigation.navigate('Edit Rating', { rating });
    }

    const confirmDelete = () =>{
        if(Platform.OS ==='ios' || Platform.OS ==='android'){
            Alert.alert('Are you sure?', 'Do you want to delete the rating?', [
                { text: 'Cancel', style: 'cancel' },
                // Vi bruger this.handleDelete som eventHandler til onPress
                { text: 'Delete', style: 'destructive', onPress: () => handleDelete() },
            ]);
        }
    }

    const handleDelete = () =>{
        const id = route.params.rating[0];
        try {
            firebase
                .database()
                // Vi sætter bilens ID ind i stien
                .ref(`/Ratings/${id}`)
                // Og fjerner data fra den sti
                .remove();
            // Og går tilbage når det er udført
            navigation.goBack();
        }catch (error){
            Alert.alert(error.message)
        }
    }

    if (!rating){
        return <Text>Can't seem to find the rating...</Text>;
    }

    return (
        <View style={styles.container}>
            <Button title='Edit' onPress={() => handleEdit()}/>
            <Button title='Delete' onPress={() =>confirmDelete()}/>
            {
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
    container: { flex: 1, justifyContent: 'flex-start' },
    row: {
        margin: 5,
        padding: 5,
        flexDirection: 'row',
    },
    label: { width: 100, fontWeight: 'bold' },
    value: { flex: 1 },
});