import React from 'react';
import {
    StyleSheet,
} from 'react-native';
import { useState } from 'react';
import { Searchbar } from "react-native-paper";

const SearchProfile = (props) => {

    //Her oprettet search state variablen
    const [searchQuery, setSearchQuery] = useState('');

    const onChangeSearch = query => setSearchQuery(query);

    return (
        //Viser input boks hvor brugere kan søge efter andre brugere og spisesteder
        <Searchbar
            placeholder="Search for a profile or place" //Det der står i inputfeltet når det er "empty"
            onChangeText={onChangeSearch} //Callback som kaldes når teksten i inputfeltet ændres
            value={searchQuery} //Værdien af inputfeltet
        />
    );
}

export default SearchProfile;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});