import { WifiOff } from "lucide-react-native";

import { View, Text, StyleSheet } from "react-native";

export default function Fallback() {
    return (
        <View style={styles.container}>
            <WifiOff size={100} color="#3F3F3F" />
            <Text style={styles.text}>Weak / No Internet</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F9D949",
        justifyContent: "center",
        alignItems: "center",
    },
    text: {
        marginTop: 16,
        fontSize: 18,
        color: "#3F3F3F",
    },
});
