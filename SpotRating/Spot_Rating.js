import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image
} from 'react-native';

type Props = {
    ratingObj : {
        ratings: number;
        views: number;
    }
};

export default class Spot_Rating extends Component <Props>{
    render() {
        // Recieve the ratings object from the props
        let ratingObj = this.props.ratingObj;

        // This array will contain our star tags. We will include this
        // array between the view tag.
        let stars = [];
        // Loop 5 times
        for (var i = 1; i <= 5; i++) {
            // Set the path to filled stars
            let path = require('../SpotRating/filled.png');
            // If ratings is lower, set the path to unfilled stars
            if (i > ratingObj.ratings) {
                path = require('../SpotRating/unfilled.png');
            }
            // Push the Image tag in the stars array
            stars.push((<Image style={styles.image} source={path} />));
        }
        return (
            <View style={ styles.container }>
                { stars }
                <Text style={styles.text}>({ratingObj.views})</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        height: 50,
        marginTop: 20,
        justifyContent: "center",
        flexDirection: "row"
    },
    image: {
        width: 25,
        height: 25,
    }
});