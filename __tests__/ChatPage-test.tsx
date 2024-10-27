import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import ChatPage from '../app/(chat)/[chat_uuid]';

jest.mock('convex/react', () => ({
    useMutation: jest.fn(),
    useQuery: jest.fn(),
    useConvex: jest.fn(),
}));

jest.mock('expo-router', () => ({
    useRouter: jest.fn(),
    useLocalSearchParams: jest.fn(),
}));

jest.mock("@react-native-async-storage/async-storage", () =>
    require("@react-native-async-storage/async-storage/jest/async-storage-mock")
);

describe('ChatPage', () => {
    const chat_uuid = 'test-chat-uuid';
    const mockAddMessage = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();

        // @ts-ignore
        const useConvex = require('convex/react').useConvex;
        useConvex.mockReturnValue({
            query: jest.fn(() => Promise.resolve({ title: 'Test Group' })),
        });
        const { useMutation } = require('convex/react');
        useMutation.mockReturnValue(mockAddMessage);

        const { useLocalSearchParams } = require('expo-router');
        useLocalSearchParams.mockReturnValue({ chat_uuid });

        const AsyncStorage = require('@react-native-async-storage/async-storage');
        AsyncStorage.getItem.mockResolvedValue(null);
        AsyncStorage.setItem.mockResolvedValue();
    });


    test('renders ChatPage and elements', async () => {
        const { getByTestId } = render(<ChatPage />);

        const chatPage = getByTestId("chat-page");
        expect(chatPage).toBeTruthy();

        const inputContainer = getByTestId("input-container");
        expect(inputContainer).toBeTruthy();

        const messageInput = getByTestId("message-input");
        expect(messageInput).toBeTruthy();

        const sendButton = getByTestId("send-button");
        expect(sendButton).toBeTruthy();
    });

    test('sends message when send button is pressed', async () => {
        const { getByTestId } = render(<ChatPage />);

        const messageInput = getByTestId("message-input");
        const sendButton = getByTestId("send-button");

        fireEvent.changeText(messageInput, 'Hello World!');

        fireEvent.press(sendButton);

        await waitFor(() => {
            expect(mockAddMessage).toHaveBeenCalledWith({
                chat_uuid: expect.any(String),
                message: 'Hello World!',
                username: expect.any(String),
            });

            expect(messageInput.props.value).toBe('');
        });
    });

    it("applies styles correctly to the container", () => {
        const { getByTestId } = render(<ChatPage />);

        const chatPage = getByTestId("chat-page");
        expect(chatPage.props.style).toEqual(
            expect.objectContaining({
                flex: 1,
                backgroundColor: '#fff'
            })
        );

        const keyboardPage = getByTestId("keyboard-page");
        expect(keyboardPage.props.style).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    flex: 1,
                    backgroundColor: '#F8F5EA'
                }),
            ])
        );

        const inputContainer = getByTestId("input-container");
        expect(inputContainer.props.style).toEqual(
            expect.objectContaining({
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
            })
        );

        const composerContainer = getByTestId("composer-container");
        expect(composerContainer.props.style).toEqual(
            expect.objectContaining({
                flexDirection: 'row'
            })
        );

        const messageInput = getByTestId("message-input");
        expect(messageInput.props.style).toEqual(
            expect.objectContaining({
                flex: 1,
                borderWidth: 1,
                borderColor: 'gray',
                borderRadius: 5,
                paddingHorizontal: 10,
                minHeight: 40,
                backgroundColor: '#fff',
                paddingTop: 10,
            })
        );

        const sendButton = getByTestId("send-button");
        expect(sendButton.props.style).toEqual(
            expect.objectContaining({
                backgroundColor: '#F9D949',
                borderRadius: 5,
                padding: 10,
                marginLeft: 10,
                alignSelf: 'flex-end',
            })
        );
    });
});
