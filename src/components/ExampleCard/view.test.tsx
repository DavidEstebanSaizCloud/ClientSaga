import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import ExampleCard from "./view";

describe("ExampleCard", () => {
  it("renders card title and description", () => {
    render(<ExampleCard title="Test" description="Descripción" />);

    expect(screen.getByText("Test")).toBeInTheDocument();
    expect(screen.getByText(/Descripción/)).toBeInTheDocument();
  });
});
