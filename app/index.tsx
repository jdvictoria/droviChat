import { useEffect, useState } from "react";
import { Link } from "expo-router";

import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Image
} from "react-native";

import Dialog from "react-native-dialog";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";

export default function Index() {
    const groups = useQuery(api.groups.fetchAllGroups) || [];

    const [visible, setVisible] = useState<boolean>(false);
    const [userName, setUserName] = useState<string>("");

    useEffect(() => {
        const fetchUser = async () => {
            const user = await AsyncStorage.getItem("user");
            if (!user) {
                setTimeout(() => {
                    setVisible(true);
                }, 100);
            } else {
                setUserName(user);
            }
        };

        fetchUser();
    }, []);

    const handleUserSet = async () => {
        const fakeRandomId = (Math.random() + 1).toString(36).substring(7);
        const user = `${userName}#${fakeRandomId}`;

        await AsyncStorage.setItem("user", user);
        setUserName(userName);

        setVisible(false);
    };

    return (
        <View testID="main-view" style={{ flex: 1 }}>
            <ScrollView testID="scroll-view" style={{
                flex: 1,
                padding: 10,
                backgroundColor: "#F8F5EA",
            }}>
                {groups.map((group) => (
                    <Link
                        href={{ pathname: "/(chat)/[chat_uuid]", params: { chat_uuid: group._id } }}
                        key={group._id.toString()}
                        asChild
                    >
                        <TouchableOpacity
                            testID={`group-${group._id}`}
                            style={{
                                flexDirection: "row",
                                gap: 10,
                                alignItems: "center",
                                backgroundColor: "#fff",
                                padding: 10,
                                borderRadius: 10,
                                marginBottom: 10,
                                shadowColor: "#000",
                                shadowOffset: {
                                    width: 0,
                                    height: 1,
                                },
                                shadowOpacity: 0.22,
                                shadowRadius: 2.22,
                                elevation: 3,
                            }}
                        >
                            <Image testID="group-image" source={{ uri: group.icon }} style={{ width: 40, height: 40 }}/>
                            <View style={{ flex: 1 }}>
                                <Text>{group.title}</Text>
                                <Text testID="group-description" style={{ color: "#888" }}>{group.description}</Text>
                                <Text testID="group-uuid" style={{ color: "#888", marginTop: 5 }}>UUID: {group._id}</Text>
                            </View>
                        </TouchableOpacity>
                    </Link>
                ))}
            </ScrollView>

            <Dialog.Container visible={visible}>
                <Dialog.Title>Input Username</Dialog.Title>
                <Dialog.Description>Set your username to start chatting.</Dialog.Description>
                <Dialog.Input testID="username-input" onChangeText={setUserName}/>
                <Dialog.Button label="Set name" onPress={handleUserSet}/>
            </Dialog.Container>
        </View>
    );
}
