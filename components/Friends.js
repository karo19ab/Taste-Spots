// Funktionaliteter
import {
    Text,
    View,
    FlatList,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import firebase from "firebase";
import React, {useState , useEffect} from 'react';
import GlobalStyles from '../globalStyles/GlobalStyles';

// Dummy-brugerdata
import {MOCKUP_USERS} from "../const";

const Friends = () => {
    // useState til at diverse brug
    const [followingArr, setFollowingArr] = useState([]);
    const [ratings, setRatings] = useState('');
    const [final, setFinal] = useState([]);

    // Bruger useEffect til at finde anmeldelser
    useEffect(() => {
        if (!ratings)
            firebase
                .database()
                .ref('/Ratings')
                .on('value', snapshot => {
                    setRatings(snapshot.val())
                });

    }, []);

    // Her laves funktionaliteten til at slette listen, der vises. Den fungerer ikke 100%, da man skal trykke to gange
    // for at kunne slette listen. Jeg tænker det har noget at gøre med rækkefølgen i al koden, der gør, at den ikke fanger det 1. tryk.
    // Først sætter vi followingArr og derefter sætter vi final før vi kalder showFollowing som meget gerne skulle ende med at vise ingenting.
    const clear = () => {
        setFollowingArr([]);
        setFinal([]);
        showFollowing();
    }

    // Her kalder vi en metode, hvor vi transformerer key-value par om til et objekt. Vi er nemlig kun interesseret i nogle af objekterne i MOCKUP_USERS
    // Det gøres da MOCKUP_USERS består af 4 brugere - altså 4 objekter - der alle indeholder værdier, vi gerne vil nå ind til.
    // Det er disse vi når ind til ved at lave .fromEntries af de map'ede objekter.
    const Profiles = Object.fromEntries(
        // Vi laver array'ene med name og id om til objekter for at kunne arbejde med dem senere.
        Object.entries(MOCKUP_USERS).map(([key, {name, email, id, follows}]) =>
            // Vi skal kun bruge navnet og id'et, hvorfor disse laves om til et array
            [name, id]
        )
    );

    // Vi skiller id og name fra hinanden som objekter til brug senere.
    const idArray = Object.values(Profiles)
    const usersKeys = Object.keys(Profiles)


    // Nu laver vi en funktion der gerne skal vise
    const showFollowing = () => {
        // Vi bruger en forEach til at loope igennem alle dem vi har trykket "Følg" på.
        followingArr.forEach(followingId => {
            // Vi laver samme slags forEach, men bare for anmeldelserne som vi hentet længere oppe.
            Object.values(ratings).forEach(item => {
                // Hvis uid'et i anmeldelsen er det samme som id'et på dem man følger, sætter vi final til at være et array
                // med anmeldelserne fra dem man følger. Dermed består "final" af anmeldelserne fra dem man har trykket "Følg" ved.
                if (item.uid === followingId) {
                    setFinal(final => [...final, item])
                }
            })
        })
    }


    return (
        <View style={styles.container}>
            <View>
                <Text style={styles.logoName}>
                    Følg dine venners madoplevelser
                </Text>
                {/* Herunder laver vi en flatlist der viser vores brugere og en knap til hver af dem */}
                <FlatList style={{paddingTop: 10}}
                          // Den data vi bruger i flatlisten er name fra vores dummy-data
                          data={usersKeys}
                          // Vi bestemmer keys til at være den pågældende brugers id
                          keyExtractor={(item, index) => idArray[index]}
                          renderItem={({item, index}) => {
                              return (
                                  <View>
                                      <View>
                                          <Text style={styles.text1}>
                                              {/* Vi kalder her item, som er divers name fra vores dummy-data*/}
                                              {item}
                                          </Text>
                                          {
                                              /* Vi laver her en knap, der ændrer på listen med ens følgere
                                              ved at tilføje id'et fra den nyligt fulgte til listen med dem man følger.
                                              */
                                          }
                                          <TouchableOpacity style={styles.boks}
                                                            onPress={() => setFollowingArr([...followingArr, idArray[index]])}>
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
                {/* Knap der viser de anmeldelser som personen du følger har anmeldt ved at kalde showFollowing() */}
                <View style={{alignItems: 'center', marginTop: '2%'}}>
                    <TouchableOpacity onPress={() => showFollowing()} style={GlobalStyles.generalButton}>
                        <Text>Vis dine fulgte venners anmeldelser</Text>
                    </TouchableOpacity>

                    {/* Vi kalder funktionen fra clear() for at cleare listen. Man skal trykke to gange før det lykkes... */}
                    <TouchableOpacity onPress={() => clear()} style={{
                        borderWidth: 1,
                        borderRadius: 10,
                        padding: 8,
                        justifyContent: 'center',
                        backgroundColor: '#fff',
                    }}>
                        <Text style={{textDecorationLine: "underline"}}>
                            Clear liste
                        </Text>
                    </TouchableOpacity>
                </View>

                {/*Herunder bliver de steder vist, som persone(r)n(e) du følger, har anmeldt*/}
                <View style={styles.steder}>
                    <Text style={{textAlign: 'center', fontSize: 20, fontWeight: 'bold'}}> Din ven har været disse
                        steder:</Text>
                    {
                        // Vi kalder en conditional rendering, der viser final vha. .map() hvis der er noget i final.
                        final && final.map(item => {
                            return (
                                <View>
                                    <TouchableOpacity style={{
                                        borderWidth: 1,
                                        justifyContent: 'center',
                                        backgroundColor: '#fff',
                                        marginTop: "2%"
                                    }}>
                                        {/* Vi lægger stedet og vurderingen ind i hver TouchableOpacity */}
                                        <Text style={styles.text1}> {item.Sted}</Text>
                                        <Text style={styles.text2}> ⭐️{item.Vurdering}/6</Text>

                                        {/* Vi kunne nok godt have tilføjet noget logik der sendte en videre til RatingDetails,
                                         men det følte vi sgu ikke vi hacde tid til*/}
                                    </TouchableOpacity>
                                </View>
                            )
                        })}
                </View>
            </View>
        </View>
    )
}

export default Friends;

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
        fontSize: 25,
        color: "black",
        marginTop: '5%',
        textAlign: 'center',
        fontWeight: 'bold',
    },
    steder: {
        //alignItems: 'center',
        marginTop: '5%'
    },
    text1: {
        fontSize: 17,
        textAlign: 'center',
        flexDirection: 'row',
        fontWeight: "bold",
    },
    text2: {
        fontSize: 15,
        textAlign: 'center',
        flexDirection: 'row',
    }
})

