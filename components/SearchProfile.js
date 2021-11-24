import React, {useEffect} from 'react';
import {
    Button,
    FlatList,
    StyleSheet,
    Text, TouchableOpacity,
    View
} from 'react-native';
import {useState} from 'react';
import {MOCKUP_USERS} from "../const";
import firebase from "firebase";


const SearchProfile = () => {
    const [followingArr, setFollowingArr] = useState([]);
    const [ratings, setRatings] = useState('');
    const [final, setFinal] = useState([]);

    useEffect(() =>{
        if(!ratings)
            firebase
                .database()
                .ref('/Ratings')
                .on('value', snapshot => {
                    setRatings(snapshot.val())
                });

    },[]);

    const test = () => {
        followingArr.forEach(follow => {
            Object.values(ratings).forEach(item => {
                if (item.uid === follow){
                    setFinal(final => [...final, item])
                }
            })
        })
    }





        const Profiles = Object.fromEntries(
            Object.entries(MOCKUP_USERS).map(([key, { name, email, id, follows}]) =>
                // Logik her?
                [name, id]
    )
        );



        const idArray = Object.values(Profiles)
        const usersKeys = Object.keys(Profiles)




        return (
            <View>
            <FlatList style={{paddingTop: 40}}
                      data={usersKeys}
                // Vi bruger ratingsKeys til at finde ID på den aktuelle bil og returnerer dette som key
                      keyExtractor={(item, index) => idArray[index]}
                      renderItem={({item, index}) => {
                          return (
                              // Er dette rigtigt tænkt?
                              <TouchableOpacity style={styles.container} onPress={() => setFollowingArr([...followingArr, idArray[index]])}>
                                  <Text>
                                      {
                                          //Måske vi skulle lave et gennemsnit af mad, service, atmosfære og value for money i stedet for bare maden
                                      }
                                      {item}
                                  </Text>
                                  <Text style={styles.follow}>
                                      Følg
                                  </Text>
                              </TouchableOpacity>
                          )
                      }}
            >
            </FlatList>
                <Button title={"filter"} onPress={() => test()}/>
                {final && final.map(item => {
                return <Text>{item.Sted}</Text>
                })}
            </View>
    )

}

export default SearchProfile;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        borderWidth: 1,
        borderRadius: 10,
        marginTop: "5%",
        padding: 5,
        height: 50,
        backgroundColor: '#fff'
    },
    follow: {
        textDecorationLine: "underline",
        textAlign: "center"
    }

})

