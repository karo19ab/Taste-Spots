//I denne mappe kan der defineres en række styles som er fælles for alle komponenter.
import {StyleSheet} from "react-native";

const GlobalStyles = StyleSheet.create({
        container: {
            flex: 1,
        },
        text: {
            color: 'black',
            fontSize: 42,
            lineHeight: 84,
            fontWeight: 'bold',
            textAlign: 'center'
        },
        buttonContainer: {
            height:50,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop:'130%',
            width:300,
            borderRadius:15,
            marginLeft: '10%',
        },
        logoName: {
            fontSize: 50,
            color: "#fff",
            marginLeft: "23%"
        },
        inputField: {
            borderColor: 'black',
            backgroundColor: '#fff',
            borderRadius:30,
            borderWidth: 1,
            width:250,
            height:45,
            marginBottom:15,
            flexDirection: 'row',
            alignItems:'center',
            textAlign: 'center',
            marginLeft: '15%'
        },

});

export default GlobalStyles