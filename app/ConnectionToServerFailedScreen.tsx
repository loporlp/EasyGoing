// ConnectionToServerFailedScreen.tsx
import { View, Text, StyleSheet, Button } from "react-native";
import { useRouter } from "expo-router";

const ConnectionToServerFailedScreen = () => {
    const router = useRouter();

    const returnToSignInScreen = () => {
        router.replace("/SignInScreen");
    }

    return (
        <View style={styles.container}>
            <Text style={styles.textError}>Connection to server failed!</Text>
            <Button title="Retry" onPress={ returnToSignInScreen}></Button>
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