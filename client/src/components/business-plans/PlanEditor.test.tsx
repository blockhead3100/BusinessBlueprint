import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import PlanEditor from "./PlanEditor";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { jest } from "@jest/globals";

const queryClient = new QueryClient();

describe("PlanEditor Component", () => {
  const mockOnBack = jest.fn();

  beforeEach(() => {
    queryClient.clear();
  });

  it("renders PlanEditor with default props", () => {
    const { asFragment } = render(
      <QueryClientProvider client={queryClient}>
        <PlanEditor planId={null} templateId={"standard"} onBack={mockOnBack} />
      </QueryClientProvider>
    );

    expect(screen.getByText("Create New Business Plan")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter business plan name")).toBeInTheDocument();
    expect(asFragment()).toMatchSnapshot();
  });

  it("calls onBack when the Back button is clicked", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <PlanEditor planId={null} templateId={"standard"} onBack={mockOnBack} />
      </QueryClientProvider>
    );

    const backButton = screen.getByText(/Back/i);
    fireEvent.click(backButton);

    expect(mockOnBack).toHaveBeenCalled();
  });

  it("renders the correct template sections", () => {
    const { asFragment } = render(
      <QueryClientProvider client={queryClient}>
        <PlanEditor planId={null} templateId={"tech-startup"} onBack={mockOnBack} />
      </QueryClientProvider>
    );

    expect(screen.getByText("Problem")).toBeInTheDocument();
    expect(screen.getByText("Solution")).toBeInTheDocument();
    expect(asFragment()).toMatchSnapshot();
  });

  // Phase Two: Advanced tests (to be implemented)
  it("handles all user interactions and generates a report", () => {
    // Placeholder for advanced testing logic
    // Simulate button clicks, redirects, nested components, etc.
    // Generate a report of what works and what doesn't
  });
});