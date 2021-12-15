// Funktionaliteter
import {
    View,
    Image,
    Text,
    Platform,
    TouchableOpacity
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import React, { useState, useEffect } from 'react';
import GlobalStyles from "../globalStyles/GlobalStyles"

export default function UploadPicture() {
    // Laver en useState for billedet til senere brug
    const [image, setImage] = useState(null);

    // Bruger useEffect til at kunne bede om tilladelse til at foto-albummet
    useEffect(() => {
        (async () => {
            // Hvis platformen ikke er web, så køres følgende kode
            if (Platform.OS !== 'web') {
                // Vi bruger ImagePickers prædefinerede funktion til at spørge om tilladelse til foto-albummet
                const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
                if (status !== 'granted') {
                    alert('Sorry, we need camera roll permissions to make this work!');
                }
            }
        })();
    }, []);

    // Logik til at vælge et billede fra sit album
    const pickImage = async () => {
        // Endnu engang bruger vi en prædefineret funktion - denne gang til at finde billedet
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.cancelled) {
            setImage(result.uri);
        }
    };

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding:15, marginTop: "35%"}}>
            <TouchableOpacity style={GlobalStyles.generalButton} onPress={pickImage} >
                <Text>Tilføj billede</Text>
            </TouchableOpacity>
            {/* Nedenfor kaldes det billede, som man har tilføjet */}
            {image && <Image source={{ uri: image }} style={{ width: 250, height: 250}} />}
        </View>
    );
}

