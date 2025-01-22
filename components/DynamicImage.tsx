import React, { useState, useEffect } from 'react';
import { View, Image, Text, StyleSheet, StyleProp, ImageStyle, ViewStyle } from 'react-native';
import axios from 'axios';

const apiKey = 'AIzaSyCirptcZS6PrgHQphQSvcDEwdLhGRZahf0';

type DynamicImageProps = {
  placeName : string;
  containerStyle? : StyleProp<ViewStyle>;
  imageStyle? : StyleProp<ImageStyle>;
};

const DynamicImage = ({ placeName, containerStyle, imageStyle } : DynamicImageProps) => {
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchDynamicImage = async () => {
    try {
      // Step 1: Get Place Details
      const placeSearchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${placeName}&key=${apiKey}`;
      const placeSearchResponse = await axios.get(placeSearchUrl);

      const place = placeSearchResponse.data.results[0];
      const photoReference = place.photos[0].photo_reference;

      // Step 2: Get Photo URL
      const photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${photoReference}&key=${apiKey}`;

      setPhotoUrl(photoUrl);
    } catch (err) {
      setError('Failed to fetch place photo');
      console.error(err);
    }
  };

  useEffect(() => {
    fetchDynamicImage();
  }, [placeName]);

  if (error) {
    return <Text style={styles.error}>{error}</Text>;
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