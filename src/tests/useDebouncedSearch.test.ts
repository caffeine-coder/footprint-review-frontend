import { test, expect, jest } from "@jest/globals";
import { act, renderHook } from "@testing-library/react";
import useDebouncedSearch from "../hooks/useDebouncedSearch";

test("should update search after 700ms", () => {
    jest.useFakeTimers();

    const { result, rerender } = renderHook(
        ({ text }) => useDebouncedSearch(text),
        {
            initialProps: { text: "" }
        }
    );

    rerender({ text: "steel" });

    expect(result.current).toBe("");

    act(() => {
        jest.advanceTimersByTime(700);
    });

    expect(result.current).toBe("steel");

    jest.useRealTimers();
});
