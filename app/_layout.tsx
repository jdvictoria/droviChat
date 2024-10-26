import { MessageSquarePlus, X, ScanQrCode, Link as LinkIcon } from 'lucide-react-native';

import { useEffect, useState } from "react";
import { Stack, Link, useRouter, useGlobalSearchParams } from "expo-router";

import { TouchableOpacity, View } from "react-native";
import Fallback from "./fallback";

import QRCode from "react-native-qrcode-svg";
import * as Notifications from 'expo-notifications';
import NetInfo from '@react-native-community/netinfo';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
    }),
});

import { ConvexReactClient, ConvexProvider } from "convex/react";

const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL!, {
    unsavedChangesWarning: false
});

export default function RootLayoutNav() {
    const router = useRouter();
    const params = useGlobalSearchParams();

    const chatUuid = Array.isArray(params.chat_uuid) ? params.chat_uuid[0] : params.chat_uuid;
    const [showQRCode, setShowQRCode] = useState(false);

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
                        headerLeft: () => (
                            <TouchableOpacity>
                                <ScanQrCode/>
                            </TouchableOpacity>
                        ),
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
                <Stack.Screen
                    name="(chat)/[chat_uuid]"
                    options={{
                        headerTitle: 'Chat',
                        headerRight: () => (
                            <TouchableOpacity onPress={() => setShowQRCode(prev => !prev)}>
                                <LinkIcon/>
                            </TouchableOpacity>
                        )
                    }}
                />
            </Stack>
            {showQRCode && (
                <View style={{ alignItems: "center", margin: 20 }}>
                    <QRCode value={chatUuid} size={200} />
                </View>
            )}
        </ConvexProvider>
    )
}
