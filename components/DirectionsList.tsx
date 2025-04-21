import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { getDirectionsBetweenLocations } from '../scripts/routeHelpers';
import RenderHtml from 'react-native-render-html';
import { Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';

interface DirectionsListProps {
  origin: string;
  destination: string;
  mode: string;
}

interface DirectionStep {
  instruction: string;
  duration: string;
  travelMode: string;
}

const DirectionsList: React.FC<DirectionsListProps> = ({ origin, destination, mode }) => {
  const [directions, setDirections] = useState<DirectionStep[]>([]);
  const [duration, setDuration] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const modeColors: Record<string, string> = {
    DRIVING: '#FF0000',
    WALKING: '#0000FF',
    BICYCLING: '#00FF00',
    TRANSIT: '#800080',
    BUS: '#006400',
    TRAIN: '#800000',
    SUBWAY: '#000080',
    TRAM: '#808080',
    FERRY: '#40E0D0',
  };

  const renderTransportIcon = (mode: string) => {
    switch (mode) {
      case "DRIVING":
        return <Ionicons name="car" size={24} color={modeColors[mode.toUpperCase()]} style={{marginRight: 5}}/>;
      case "WALKING":
        return <MaterialIcons name="directions-walk" size={24} color={modeColors[mode.toUpperCase()]} style={{marginRight: 5}}/>;
      case "BICYCLING":
        return <Ionicons name="bicycle" size={24} color={modeColors[mode.toUpperCase()]} style={{marginRight: 5}}/>;
      case "TRANSIT":
        return <MaterialCommunityIcons name="dots-horizontal" size={24} color={modeColors[mode.toUpperCase()]} style={{marginRight: 5}}/>;
      case "BUS":
        return <MaterialCommunityIcons name="bus" size={24} color={modeColors[mode.toUpperCase()]} style={{marginRight: 5}}/>;
      case "TRAIN":
        return <MaterialCommunityIcons name="train" size={24} color={modeColors[mode.toUpperCase()]} style={{marginRight: 5}}/>;
      case "SUBWAY":
        return <MaterialCommunityIcons name="subway" size={24} color={modeColors[mode.toUpperCase()]} style={{marginRight: 5}}/>;
      case "TRAM":
        return <MaterialCommunityIcons name="tram" size={24} color={modeColors[mode.toUpperCase()]} style={{marginRight: 5}}/>;
      case "FERRY":
        return <MaterialCommunityIcons name="ferry" size={24} color={modeColors[mode.toUpperCase()]} style={{marginRight: 5}}/>;
      default:
        return <MaterialIcons name="question-mark" size={24} color={'#000'} />
    }
  }

  useEffect(() => {
    const fetchDirections = async () => {
      setLoading(true);
      setError('');
      try {
        const routeData = await getDirectionsBetweenLocations(origin, destination, mode);
        console.log("routeData:", routeData);

        if (routeData) {
          // Map the directions and modes together
          setDirections(routeData.directions.map((instruction, index) => ({
            instruction,
            duration: routeData.duration,
            travelMode: routeData.travel_modes[index],
          })));
          setDuration(routeData.duration);
        } else {
          setError('Unable to fetch directions.');
        }
      } catch (err) {
        console.error(err);
        setError('Failed to load directions.');
      } finally {
        setLoading(false);
      }
    };

    fetchDirections();
  }, [origin, destination, mode]);

  return (
    <View style={styles.container}>
      {loading && <ActivityIndicator size="large" color="#0000ff" />}
      {error && <Text style={styles.error}>{error}</Text>}
      {!loading && !error && (
        <>
          {directions.map((item, index) => (
            <View key={index} style={styles.directionStep}>
              <View style={styles.directionContainer}>
                {/* Color block next to each instruction */}
                <View>
                  {renderTransportIcon(item.travelMode)}
                </View>

                {/* Render HTML instruction */}
                <RenderHtml
                  contentWidth={350} // Adjust here if not right size
                  source={{ html: item.instruction }}
                />
              </View>
            </View>
          ))}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  directionStep: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    padding: 10,
    backgroundColor: '#ffffff',
    borderRadius: 5,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  directionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  error: {
    color: 'red',
    fontSize: 18,
    textAlign: 'center',
  },
});

export default DirectionsList;
