import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { getDirectionsBetweenLocations } from '../scripts/routeHelpers';

interface DirectionsListProps {
  origin: string;
  destination: string;
  mode: string;
}

interface DirectionStep {
  instruction: string;
  duration: string;
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
  
    useEffect(() => {
        const fetchDirections = async () => {
            setLoading(true);
            setError('');
            try {
                // Get the directions
                const routeData = await getDirectionsBetweenLocations(origin, destination, mode);
        
                if (routeData) {
                    setDirections(routeData.directions);
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
                    <Text style={styles.heading}>Directions from {origin} to {destination}</Text>
                    <Text style={styles.subHeading}>Mode: {mode}</Text>
                    <Text style={styles.subHeading}>Total Duration: {duration}</Text>

                    {directions.map((item, index) => (
                        <View key={index} style={styles.directionStep}>
                            <View style={styles.directionContainer}>
                                {/* Color block next to each instruction */}
                                <View
                                    style={{
                                        ...styles.colorBlock,
                                        backgroundColor: modeColors[mode.toUpperCase()] || '#000',
                                    }}
                                />
                                {/* Direction instruction */}
                                <Text style={styles.instruction}>{item.instruction} ({item.duration})</Text>
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
        backgroundColor: '#f9f9f9',
        padding: 20,
    },
    heading: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'black',
        marginBottom: 10,
    },
    subHeading: {
        fontSize: 16,
        color: 'gray',
        marginBottom: 5,
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
        flex: 1,
    },
    colorBlock: {
        width: 20,
        height: 20,
        marginRight: 12,
        borderRadius: 50,
    },
    instruction: {
        fontSize: 16,
        color: 'black',
        flexShrink: 1,
    },
    error: {
        color: 'red',
        fontSize: 18,
        textAlign: 'center',
    },
    loading: {
        fontSize: 18,
        color: '#666',
        textAlign: 'center',
    },
});

export default DirectionsList;
