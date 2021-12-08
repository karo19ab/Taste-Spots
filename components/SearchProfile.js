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
import GlobalStyles from '../globalStyles/GlobalStyles'


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
                    // https://javascript.plainenglish.io/how-to-add-to-an-array-in-react-state-3d08ddb2e1dc
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
            <View style={styles.container}>
                <View>
                    <Text style={styles.logoName}>
                        Følg dine venners madoplevelser
                    </Text>
                    <FlatList style={{paddingTop: 10}}
                              data={usersKeys}
                        // Vi bruger ratingsKeys til at finde ID på den aktuelle bruger og returnerer dette som key
                              keyExtractor={(item, index) => idArray[index]}
                              renderItem={({item, index}) => {
                                  return (
                                      // Er dette rigtigt tænkt?
                                      <View>
                                          <View>
                                              <Text style={styles.text}>
                                                  {
                                                      //Måske vi skulle lave et gennemsnit af mad, service, atmosfære og value for money i stedet for bare maden
                                                  }
                                                  {item}
                                              </Text>
                                              <TouchableOpacity style={styles.boks} onPress={() => setFollowingArr([...followingArr, idArray[index]])}>
                                                  <Text style={styles.follow}>
                                                      Følg
                                                  </Text>
                                              </TouchableOpacity>
                                          </View>
                                      </View>
                                  )
                              }}
                    >
                    </FlatList>
                    {/*Knap der viser de anmeldelser som personen du følger har anmeldt*/}
                    <View style={{alignItems: 'center', marginTop: '5%'}}>
                        <TouchableOpacity onPress={() => test()} style={GlobalStyles.generalButton}>
                            <Text>Filter</Text>
                        </TouchableOpacity>
                    </View>
                    {/*Herunder bliver de steder som personen du følger har anmeldt blive vist*/}
                    <View style={styles.steder}>
                        <Text style={{textAlign: 'center', fontSize: 20, fontWeight: 'bold'}}> Din ven har været disse steder:</Text>
                        {final && final.map(item => {
                            return <Text style={styles.text}> {item.Sted}</Text>
                        })}
                    </View>

                </View>
            </View>
    )
}

export default SearchProfile;

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
    },
    boks: {
        flex: 1,
        borderWidth: 1,
        borderRadius: 10,
        marginTop: '1.5%',
        padding: 3,
        height: 30,
        width: 60,
        justifyContent: 'center',
        backgroundColor: '#fff',
        marginLeft: '42%'

    },
    follow: {
        textAlign: "center",
        fontWeight: 'bold',
    },
    logoName: {
        fontSize: 40,
        color: "black",
        marginTop: '15%',
        textAlign: 'center',
    },
    steder: {
        alignItems: 'center',
        marginTop: '5%'
    },
    text: {
        fontSize: 17,
        marginTop: '3%',
        textAlign: 'center',
        flexDirection: 'row'
    }
})

