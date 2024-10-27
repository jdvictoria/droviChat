import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import Index from "../app/index";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useQuery } from "convex/react";


jest.mock("convex/react");
jest.mock("@react-native-async-storage/async-storage", () =>
    require("@react-native-async-storage/async-storage/jest/async-storage-mock")
);

describe("Index Component", () => {
    const mockGroups = [
        { _id: "1", title: "Group 1", description: "Description 1", icon: "https://example.com/icon1.png" },
        { _id: "2", title: "Group 2", description: "Description 2", icon: "https://example.com/icon2.png" },
    ];

    beforeEach(() => {
        jest.clearAllMocks();
        // @ts-ignore
        useQuery.mockReturnValue(mockGroups);
        // @ts-ignore
        AsyncStorage.getItem.mockResolvedValue(null);
        // @ts-ignore
        AsyncStorage.setItem.mockResolvedValue();
    });

    it("shows dialog for username input when no user is set", async () => {
        const { getByText } = render(<Index />);

        await waitFor(() => {
            expect(getByText("Input Username")).toBeTruthy();
        });
    });

    it("sets user name correctly", async () => {
        // @ts-ignore
        AsyncStorage.getItem.mockResolvedValue(null);
        const { getByText, getByTestId } = render(<Index />);

        await waitFor(() => {
            expect(getByText("Input Username")).toBeTruthy();
        });

        const usernameInput = getByTestId("username-input");
        fireEvent.changeText(usernameInput, "TestUser");
        fireEvent.press(getByText("Set name"));

        expect(AsyncStorage.setItem).toHaveBeenCalledWith("user", expect.any(String));
    });

    it("renders groups correctly", async () => {
        const { getByText } = render(<Index />);

        await waitFor(() => {
            expect(getByText("Group 1")).toBeTruthy();
            expect(getByText("Group 2")).toBeTruthy();
        });
    });

    it("applies the correct styles to the container", () => {
        const { getByTestId, getAllByTestId } = render(<Index />);

        const mainView = getByTestId("main-view");
        expect(mainView.props.style).toEqual(
            expect.objectContaining({
                flex: 1,
            })
        );

        const scrollView = getByTestId("scroll-view");

        expect(scrollView.props.style).toEqual(
            expect.objectContaining({
                flex: 1,
                padding: 10,
                backgroundColor: "#F8F5EA",
            })
        );

        const group1Item = getByTestId("group-1");
        expect(group1Item.props.style).toEqual(
            expect.objectContaining({
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: "#fff",
                padding: 10,
                borderRadius: 10,
                marginBottom: 10,
            })
        );

        const groupImages = getAllByTestId("group-image");

        groupImages.forEach((image) => {
            expect(image.props.style).toEqual(
                expect.objectContaining({
                    width: 40,
                    height: 40,
                })
            );
        });

        const groupDescriptions = getAllByTestId("group-description");
        groupDescriptions.forEach((description) => {
            expect(description.props.style).toEqual(
                expect.objectContaining({
                    color: "#888"
                })
            );
        });

        const group_uuids = getAllByTestId("group-uuid");
        group_uuids.forEach((uuid) => {
            expect(uuid.props.style).toEqual(
                expect.objectContaining({
                    color: "#888",
                    marginTop: 5
                })
            );
        });
    });
});
