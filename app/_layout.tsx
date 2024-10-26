import { MessageSquarePlus, X } from 'lucide-react-native';

import { useEffect, useState } from "react";
import { Stack, Link, useRouter } from "expo-router";

import { TouchableOpacity } from "react-native";
import Fallback from "./fallback";

import NetInfo from '@react-native-community/netinfo';

import { ConvexReactClient, ConvexProvider } from "convex/react";

const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL!, {
    unsavedChangesWarning: false
});

export default function RootLayoutNav() {
    const router = useRouter();
    const [isConnected, setIsConnected] = useState(true);

    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(state => {
            if (state.isConnected) {
                setIsConnected(true);
            } else {
                setIsConnected(false);
            }
        });

        return () => unsubscribe();
    }, [router]);

    if (!isConnected) {
        return <Fallback/>;
    }

    return (
        <ConvexProvider client={convex}>
            <Stack
                screenOptions={{
                    headerStyle: {
                        backgroundColor: "#F9D949"
                    },
                    headerTintColor: "#3F3F3F"
                }}>
                <Stack.Screen
                    name="index"
                    options={{
                        headerTitle: 'Chats',
                        headerRight: () => (
                            <Link href={'/(modal)/create'} asChild>
                                <TouchableOpacity>
                                    <MessageSquarePlus/>
                                </TouchableOpacity>
                            </Link>
                        ),
                    }}
                />
                <Stack.Screen
                    name="(modal)/create"
                    options={{
                        headerTitle: 'Create Group',
                        presentation: 'modal',
                        headerLeft: () => (
                            <Link href={'/'} asChild>
                                <TouchableOpacity>
                                    <X/>
                                </TouchableOpacity>
                            </Link>
                        ),
                    }}
                />
                <Stack.Screen name="(chat)/[chat_uuid]" options={{ headerTitle: 'Chat' }}/>
            </Stack>
        </ConvexProvider>
    )
}
