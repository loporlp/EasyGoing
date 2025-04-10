import React, { useState, useEffect } from 'react';
import { View, Image, Text, StyleSheet, StyleProp, ImageStyle, ViewStyle } from 'react-native';
import axios from 'axios';
import {getIdToken} from '../scripts/getFirebaseID'
import { auth } from '@/firebaseConfig';
//import { encode as base64Encode } from 'base-64';


type DynamicImageProps = {
  placeName : string;
  containerStyle? : StyleProp<ViewStyle>;
  imageStyle? : StyleProp<ImageStyle>;
};

const DynamicImage = ({ placeName, containerStyle, imageStyle } : DynamicImageProps) => {
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchDynamicImage = async () => {
    const idToken = await getIdToken(auth);
    try {
      // Step 1: Get Place Details
      const placeSearchUrl = `https://ezgoing.app/api/place/textsearch?query=${placeName}`;
      const placeSearchResponse = await axios.get(placeSearchUrl, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${idToken}`, // Include the ID token in the header
        },
    });

      const place = placeSearchResponse.data.results[0];
      const photoReference = place.photos[0].photo_reference;
      const place_id = place.place_id;

      // Step 2: Get Photo URL
      const photoUrl = `https://ezgoing.app/api/place/photo?maxwidth=400&photo_reference=${photoReference}&place_id=${place_id}`;

      setPhotoUrl(photoUrl);
    } catch (err) {
      setError('Unknown Photo');
      console.error(err);
    }
  };

  useEffect(() => {
    fetchDynamicImage();
  }, [placeName]);

  if (error) {
    //default to blue when no image found
    <View style={[styles.container, containerStyle]}>
      <Image source={require('../assets/images/blue.png')} style={[styles.image, imageStyle]} />
    </View>
  }

  return (
    <View style={[styles.container, containerStyle]}>
      {photoUrl ? (
        <Image source={{ uri: photoUrl }} style={[styles.image, imageStyle]} />
      ) : (
        <Text>Loading...</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 400,
    height: 300,
    borderRadius: 8,
  },
  error: {
    color: 'red',
    textAlign: 'center',
  },
});

export default DynamicImage;