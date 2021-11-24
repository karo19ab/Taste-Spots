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



    } else {

        const Profiles = Object.fromEntries(
            Object.entries(MOCKUP_USERS).map(([key, { name, email, id, follows}]) =>
                // Logik her?
                [name, id]
    )
        );



        const idArray = Object.values(Profiles)
        const usersKeys = Object.keys(Profiles)
        console.log(idArray)
        console.log(usersKeys)
        console.log("Object.values(ratings).forEach(item => console.log(item))")
        console.log(Object.values(ratings).forEach(item => console.log(item.uid)))


        const handleFollowProfile = id => {
            /*Her søger vi direkte i vores array af biler og finder bil objektet som matcher i det vi har tilsendt*/
            const follow = Object.entries(Profiles).find(follow => follow[0] === id /*id*/)
            console.log(follow)
            // forEach igennem idArray med en if firebase.auth().currentUser.uid === idArray[] så skal

        }

console.log("final")
console.log(final)

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

