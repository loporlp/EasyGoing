// ConnectionToServerFailedScreen.tsx
import { View, Text, StyleSheet, Button } from "react-native";
import { useRouter } from "expo-router";
import { fetchData } from '../scripts/fetchData';
import { CommonActions, useNavigation } from '@react-navigation/native';

const ConnectionToServerFailedScreen = () => {
    const navigation = useNavigation();

    const returnToSignInScreen = () => {
        navigation.dispatch(
        CommonActions.reset({
              index: 0,
              routes: [{ name: "index" }] // redirects user to the "Sign In" page
            })
          );
    }

    const isServerRunning = async () => {
        const isRunning = await fetchData();
        if(isRunning){
            returnToSignInScreen();
        } else{
            alert('Server is down. Please try again later.');
        }
        
    }

    return (
        <View style={styles.container}>
            <Text style={styles.textError}>Connection to server failed!</Text>
            <Button title="Retry" onPress={ isServerRunning}></Button>
        </View>
    );
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },

    textError: {
        color: "red",
        fontSize: 20,
        marginBottom: 15,
    }
});

export default ConnectionToServerFailedScreen;