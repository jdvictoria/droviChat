import { useState } from 'react';
import { useRouter } from 'expo-router';

import { Text, KeyboardAvoidingView, Platform, StyleSheet, TextInput, TouchableOpacity } from 'react-native';

import { useMutation } from 'convex/react';
import { api } from "../../convex/_generated/api";

export default function CreateGroupModal() {
    const router = useRouter();

    const createGroupChat = useMutation(api.groups.createGroup);

    const [groupName, setGroupName] = useState<string>('');
    const [groupDescription, setGroupDescription] = useState<string>('');
    const [groupIcon, setGroupIcon] = useState<string>('https://i.ibb.co/JHPgJz1/chat-icon.png'); // Set default icon url

    const handleGroupCreate = async () => {
        await createGroupChat({
            title: groupName,
            description: groupDescription,
            icon: groupIcon,
        });

        router.back();
    };

    return (
        <KeyboardAvoidingView
            style={{
                flex: 1,
                backgroundColor: '#F8F5EA',
                padding: 20,
            }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={100}
        >
            <Text style={styles.label}>Name</Text>
            <TextInput style={styles.textInput} value={groupName} onChangeText={setGroupName}/>

            <Text style={styles.label}>Description</Text>
            <TextInput style={styles.textInput} value={groupDescription} onChangeText={setGroupDescription}/>

            <TouchableOpacity
                style={{
                    backgroundColor: '#F9D949',
                    borderRadius: 5,
                    padding: 10,
                    marginVertical: 20,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
                onPress={handleGroupCreate}
            >
                <Text
                    style={{
                        color: '#3F3F3F',
                        textAlign: 'center',
                        fontSize: 16,
                        fontWeight: 'bold',
                }}>
                    Create
                </Text>
            </TouchableOpacity>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    label: {
        marginVertical: 10,
    },
    textInput: {
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 5,
        paddingHorizontal: 10,
        minHeight: 40,
        backgroundColor: '#fff',
    },
});
