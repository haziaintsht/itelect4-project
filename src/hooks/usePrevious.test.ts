import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import usePrevious from "./usePrevious";

describe("usePrevious", () => {
    it("has nothing to return on the first render", () => {
        const { result } = renderHook(() => usePrevious("first"));
        expect(result.current).toBeUndefined();
    });

    it("returns the value from before the last change", () => {
        const { result, rerender } = renderHook(({ value }) => usePrevious(value), {
            initialProps: { value: "first" },
        });

        rerender({ value: "second" });
        expect(result.current).toBe("first");

        rerender({ value: "third" });
        expect(result.current).toBe("second");
    });
});
