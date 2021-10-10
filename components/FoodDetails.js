import * as React from 'react';
import { View, Text, Platform, FlatList, StyleSheet, Button, Alert } from 'react-native';
import firebase from 'firebase';
import {useEffect, useState} from "react";

const FoodDetails = ({route, navigation}) => {
    const [car, setCar] = useState({});

    useEffect(() => {
        /*Henter car values og sætter dem*/
        setCar(route.params.car[1]);

        /*Når vi forlader screen, tøm object*/
        return () => {
            setCar({})
        }
    });

    const handleEdit = () =>{
        // Vi navigerer videre til EditCar skærmen og sender bilen videre med
        const car = route.params.car
        navigation.navigate('Edit Car', { car });
    }

    const confirmDelete = () =>{
        if(Platform.OS ==='ios' || Platform.OS ==='android'){
            Alert.alert('Are you sure?', 'Do you want to delete the car?', [
                { text: 'Cancel', style: 'cancel' },
                // Vi bruger this.handleDelete som eventHandler til onPress
                { text: 'Delete', style: 'destructive', onPress: () => handleDelete() },
            ]);
        }
    }

    const handleDelete = () =>{
        const id = route.params.car[0];
        try {
            firebase
                .database()
                // Vi sætter bilens ID ind i stien
                .ref(`/Cars/${id}`)
                // Og fjerner data fra den sti
                .remove();
            // Og går tilbage når det er udført
            navigation.goBack();
        }catch (error){
            Alert.alert(error.message)
        }
    }

    if (!car){
        return <Text>Can't seem to find the car...</Text>;
    }

    return (
        <View style={styles.container}>
            <Button title='Edit' onPress={() => handleEdit()}/>
            <Button title='Delete' onPress={() =>confirmDelete()}/>
            {
                Object.entries(car).map((item,index)=>{
                    return(
                        <View style={styles.row} key={index}>
                            {/*Vores car keys navn*/}
                            <Text style={styles.label}>{item[0]} </Text>
                            {/*Vores car values navne */}
                            <Text style={styles.value}>{item[1]}</Text>
                        </View>
                    )
                })

            }
        </View>
    )
}

export default FoodDetails;

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