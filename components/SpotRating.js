import StarRating from 'react-native-star-rating';
import * as React from 'react';
import {Component} from "react";
import {StyleSheet} from "react-native";

class SpotRating extends Component {

    constructor(props) {
        super(props);
        this.state = {
            starCount: 3
        };
    }

    onStarRatingPress(rating) {
        this.setState({
            starCount: rating
        });
    }

    render() {
        return (
            <StarRating
                disabled={false}
                emptyStar={'ios-location-outline'}
                fullStar={'ios-location-sharp'}
                iconSet={'Ionicons'}
                maxStars={6}
                rating={this.state.starCount}
                selectedStar={(rating) => this.onStarRatingPress(rating)}
                fullStarColor={'black'}
            />
        );
    }
}

export default SpotRating


