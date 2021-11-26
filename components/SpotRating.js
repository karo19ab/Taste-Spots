import StarRating from 'react-native-star-rating';
import * as React from 'react';
import {Component, useState} from "react";
import {StyleSheet} from "react-native";
import GlobalStyles from "../globalStyles/GlobalStyles"

//Find ud af hvad component betyder
class SpotRating extends Component {

    constructor(props) {
        super(props);
        this.state = {
            starCount: 3
        };
    }

    //Når man trykker
    onStarRatingPress(rating) {
        this.setState({
            starCount: rating
        });
    }

    render() {
        // const [newRating, setNewRating] = useState(0);

        return (
            <StarRating
                disabled={false}
                emptyStar={'ios-location-outline'}
                fullStar={'ios-location-sharp'}
                iconSet={'Ionicons'}
                maxStars={6}
                rating={this.state.starCount}
                selectedStar={(rating) => this.onStarRatingPress(rating)}
                fullStarColor={'#B45626'}
            />

        );
    }
}

export default SpotRating
