import { SendHorizontal } from "lucide-react-native";
import { useEffect, useRef, useState } from 'react';
import { useLocalSearchParams, useNavigation } from "expo-router";

import {
    SafeAreaView,
    KeyboardAvoidingView,
    View,
    Text,
    FlatList,
    ListRenderItem,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Keyboard
} from "react-native";

import { Doc, Id } from '../../convex/_generated/dataModel';
import { useConvex, useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api"

import * as Notifications from 'expo-notifications';
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ChatPage() {
    const { chat_uuid } = useLocalSearchParams();

    const convex = useConvex();
    const navigation = useNavigation();

    const [username, Username] = useState<string | null>(null);

    const listRef = useRef<FlatList>(null);
    const messages = useQuery(api.messages.fetchMessage, { chat_uuid: chat_uuid as Id<'groups'> }) || [];
    const addMessage = useMutation(api.messages.sendMessage);
    const [newMessage, setNewMessage] = useState<string>('');

    useEffect(() => {
        const loadGroup = async () => {
            const groupInfo = await convex.query(api.groups.fetchSingleGroup, { id: chat_uuid as Id<'groups'> });
            navigation.setOptions({ headerTitle: groupInfo!.title });
        };
        loadGroup();
    }, [chat_uuid]);

    useEffect(() => {
        const fetchUser = async () => {
            const user = await AsyncStorage.getItem('user');
            Username(user);
        };

        fetchUser();
    }, []);

    const handleSendMessage = async () => {
        Keyboard.dismiss();

        await addMessage({
            chat_uuid: chat_uuid as Id<'groups'>,
            message: newMessage,
            username: username || 'Anonymous',
        });
        setNewMessage('');
    };

    useEffect(() => {
        const notifyNewMessage = async () => {
            if (messages.length === 0) return;

            const latestMessage = messages[messages.length - 1];
            if (latestMessage.username !== username) {
                await Notifications.scheduleNotificationAsync({
                    content: {
                        title: `New message from ${latestMessage.username}`,
                        body: latestMessage.message,
                        data: { chat_uuid: latestMessage.chat_uuid as string },
                    },
                    trigger: null,
                });
            }

            setTimeout(() => {
                listRef.current?.scrollToEnd({ animated: true });
            }, 300);
        };

        notifyNewMessage();
    }, [messages]);

    const renderMessage: ListRenderItem<Doc<'messages'>> = ({ item }) => {
        const isUserMessage = item.username === username;

        return (
            <View style={[styles.messageContainer, isUserMessage ? styles.selfMessagesContainer : styles.otherMessageContainer]}>
                {item.message !== '' && <Text style={[styles.messageText, isUserMessage ? styles.userMessageText : null]}>{item.message}</Text>}
                
                <Text style={{
                    fontSize: 12,
                    color: '#474747',
                }}>
                    {new Date(item._creationTime).toLocaleTimeString()} - {item.username}
                </Text>
            </View>
        );
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
            <KeyboardAvoidingView style={{ flex: 1, backgroundColor: '#F8F5EA' }} behavior={'padding'} keyboardVerticalOffset={60}>
                <FlatList ref={listRef} data={messages} renderItem={renderMessage} keyExtractor={(item) => item._id.toString()} ListFooterComponent={<View style={{ padding: 5 }} />} />

                <View style={styles.inputContainer}>
                    <View style={{ flexDirection: 'row' }}>
                        <TextInput style={styles.textInput} value={newMessage} onChangeText={setNewMessage} placeholder="Type your message" multiline={true} />

                        <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage} disabled={newMessage === ''}>
                            <SendHorizontal color="#3F3F3F"/>
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    inputContainer: {
        padding: 10,
        backgroundColor: '#fff',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: -8,
        },
        shadowOpacity: 0.1,
        shadowRadius: 5,

        elevation: 3,
    },
    textInput: {
        flex: 1,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 5,
        paddingHorizontal: 10,
        minHeight: 40,
        backgroundColor: '#fff',
        paddingTop: 10,
    },
    sendButton: {
        backgroundColor: '#F9D949',
        borderRadius: 5,
        padding: 10,
        marginLeft: 10,
        alignSelf: 'flex-end',
    },
    messageContainer: {
        padding: 10,
        borderRadius: 10,
        marginTop: 10,
        marginHorizontal: 10,
        maxWidth: '80%',
    },
    selfMessagesContainer: {
        backgroundColor: '#F9D949',
        alignSelf: 'flex-end',
    },
    otherMessageContainer: {
        alignSelf: 'flex-start',
        backgroundColor: '#fff',
    },
    messageText: {
        fontSize: 16,
        flexWrap: 'wrap',
    },
    userMessageText: {
        color: '#3d3d3d',
    },
});
