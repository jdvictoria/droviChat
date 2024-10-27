import React from "react";
import { render } from "@testing-library/react-native";
import Fallback from "../app/fallback";

describe("Fallback Component", () => {
    it("renders the WifiOff icon and the correct text", () => {
        const { getAllByTestId, getByText } = render(<Fallback />);

        const wifiOffIcon = getAllByTestId("wifiOffIcon");
        expect(wifiOffIcon.length).toBeGreaterThan(0);

        const text = getByText("Weak / No Internet");
        expect(text).toBeTruthy();
    });

    it("applies the correct styles to the container", () => {
        const { getByTestId, getByText } = render(<Fallback />);

        const container = getByTestId("container");
        expect(container.props.style).toEqual(
            expect.objectContaining({
                flex: 1,
                backgroundColor: "#F9D949",
                justifyContent: "center",
                alignItems: "center",
            })
        );

        const text = getByText("Weak / No Internet");
        expect(text.props.style).toEqual(
            expect.objectContaining({
                marginTop: 16,
                fontSize: 18,
                color: "#3F3F3F",
            })
        );
    });
});
