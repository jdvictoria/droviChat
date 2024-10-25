import { MessageSquarePlus, X } from 'lucide-react-native';

import { Stack, Link } from "expo-router";
import { TouchableOpacity } from "react-native";

import { ConvexReactClient, ConvexProvider } from "convex/react";

const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL!, {
    unsavedChangesWarning: false
});

export default function RootLayoutNav() {
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
                        headerTitle: 'My Chats',
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
                        headerTitle: 'Start a Chat',
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
                <Stack.Screen name="(chat)/[chatuuid]" options={{ headerTitle: 'Chat' }} />
            </Stack>
        </ConvexProvider>
    )
}
