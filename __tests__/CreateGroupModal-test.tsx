import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import { useRouter } from "expo-router";
import { useMutation } from "convex/react";
import CreateGroupModal from "../app/(modal)/create";

jest.mock("expo-router", () => ({
    useRouter: jest.fn(),
}));

jest.mock("convex/react", () => ({
    useMutation: jest.fn(),
}));

describe("CreateGroupModal", () => {
    const mockBack = jest.fn();
    const mockCreateGroup = jest.fn();

    beforeEach(() => {
        mockBack.mockClear();
        mockCreateGroup.mockClear();

        // @ts-ignore
        useRouter.mockReturnValue({ back: mockBack });
        // @ts-ignore
        useMutation.mockReturnValue(mockCreateGroup);
    });

    it("renders correctly", () => {
        const { getByText, getByTestId } = render(<CreateGroupModal />);

        expect(getByText("Name")).toBeTruthy();
        expect(getByText("Description")).toBeTruthy();
        expect(getByText("Create")).toBeTruthy();
        expect(getByTestId("nameInput")).toBeTruthy();
        expect(getByTestId("descriptionInput")).toBeTruthy();
    });

    it("handles input change and group creation", async () => {
        const { getByTestId } = render(<CreateGroupModal />);

        const nameInput = getByTestId("nameInput");
        const descriptionInput = getByTestId("descriptionInput");
        const createButton = getByTestId("createButton");

        fireEvent.changeText(nameInput, "My Group");
        fireEvent.changeText(descriptionInput, "This is a test group");

        fireEvent.press(createButton);

        await waitFor(() => {
            expect(mockCreateGroup).toHaveBeenCalledWith({
                title: "My Group",
                description: "This is a test group",
                icon: "https://i.ibb.co/JHPgJz1/chat-icon.png",
            });
        });

        expect(mockBack).toHaveBeenCalled();
    });

    it("applies styles correctly to the container", () => {
        const { getByTestId, getByText } = render(<CreateGroupModal />);

        const container = getByTestId('container');

        const stylesArray = container.props.style;

        expect(stylesArray).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ flex: 1 }),
                expect.objectContaining({ backgroundColor: '#F8F5EA' }),
                expect.objectContaining({ padding: 20 }),
            ])
        );

        expect(stylesArray).toContainEqual(expect.objectContaining({ paddingBottom: 0 }));

        const nameLabel = getByText("Name");
        expect(nameLabel.props.style).toEqual(
            expect.objectContaining({
                marginVertical: 10
            })
        );

        const nameInput = getByTestId("nameInput");
        expect(nameInput.props.style).toEqual(
            expect.objectContaining({
                borderWidth: 1,
                borderColor: "gray",
                borderRadius: 5,
                paddingHorizontal: 10,
                minHeight: 40,
                backgroundColor: "#fff"
            })
        );

        const descriptionLabel = getByText("Description");
        expect(descriptionLabel.props.style).toEqual(
            expect.objectContaining({
                marginVertical: 10
            })
        );

        const descriptionInput = getByTestId("descriptionInput");
        expect(descriptionInput.props.style).toEqual(
            expect.objectContaining({
                borderWidth: 1,
                borderColor: "gray",
                borderRadius: 5,
                paddingHorizontal: 10,
                minHeight: 40,
                backgroundColor: "#fff"
            })
        );

        const createLabel = getByText("Create");
        expect(createLabel.props.style).toEqual(
            expect.objectContaining({
                color: '#3F3F3F',
                textAlign: 'center',
                fontSize: 16,
                fontWeight: 'bold',
            })
        );
        
        const createButton = getByTestId("createButton");
        expect(createButton.props.style).toEqual(
            expect.objectContaining({
                backgroundColor: '#F9D949',
                borderRadius: 5,
                padding: 10,
                marginVertical: 20,
                justifyContent: 'center',
                alignItems: 'center',
            })
        );
    });
});
