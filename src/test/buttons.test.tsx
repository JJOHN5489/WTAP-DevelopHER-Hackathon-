import { fireEvent, screen, waitFor, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { btn, closeDialog, findDialog, link, open } from "./helpers";

describe("Header and navigation", () => {
  it("shows the logo, three nav links and Seek Support on every page", async () => {
    await open("/");
    expect(link("Home")).toBeInTheDocument();
    expect(link("Career Roadmap")).toBeInTheDocument();
    expect(link("Bi-Weekly Check-In")).toBeInTheDocument();
    expect(btn(/Seek Support/)).toBeInTheDocument();
  });

  it("nav links switch pages", async () => {
    await open("/");
    fireEvent.click(link("Career Roadmap"));
    await screen.findByText("Your Career Roadmap");
    fireEvent.click(link("Bi-Weekly Check-In"));
    await screen.findByText("Bi-Weekly Leaderboard");
    fireEvent.click(link("Home"));
    await screen.findByText("Interests & Hobbies");
  });
});

describe("Home", () => {
  it("adds and removes interest tags", async () => {
    await open("/");
    const inputs = screen.getAllByPlaceholderText("Add tag");
    fireEvent.change(inputs[0]!, { target: { value: "Cybersecurity" } });
    fireEvent.click(screen.getAllByLabelText("Add tag")[0]!);
    expect(screen.getByText("Cybersecurity")).toBeInTheDocument();
    fireEvent.click(screen.getByLabelText("Remove Cybersecurity"));
    expect(screen.queryByText("Cybersecurity")).not.toBeInTheDocument();
  });

  it("has no roadmap, timeline or LOB explorer", async () => {
    await open("/");
    expect(screen.queryByText(/Current Role & Timeline/)).not.toBeInTheDocument();
    expect(screen.queryByText(/LOB Explorer/)).not.toBeInTheDocument();
    expect(screen.getByText("I once climbed Mount Kilimanjaro!")).toBeInTheDocument();
  });
});


describe("Career Roadmap", () => {
  it("search sets the target role and goal checkboxes track progress", async () => {
    await open("/roadmap");
    const search = screen.getByPlaceholderText(/Search RBC full-time roles/);
    fireEvent.focus(search);
    fireEvent.change(search, { target: { value: "Quant" } });
    fireEvent.mouseDown(await screen.findByText("Quantitative Risk Analyst", { selector: "span" }));
    await screen.findByText("Goals toward Quantitative Risk Analyst");
    fireEvent.click(btn("Python & pandas"));
    expect(screen.getAllByText(/25% skills complete/).length).toBeGreaterThan(0);
  });

});

describe("Bi-Weekly Check-In", () => {
  it("counts down in real time to the next Friday 4:25 PM and Join opens Teams", async () => {
    vi.useFakeTimers({ toFake: ["Date"] });
    // Wednesday Nov 25, 2026, 2:00:00 PM local; next session cutoff is Fri Dec 4, 4:25 PM (anchor + 14d).
    vi.setSystemTime(new Date(2026, 10, 25, 14, 0, 0));
    const w = vi.spyOn(window, "open").mockReturnValue(null);
    await open("/check-in");
    expect(screen.getByText("9d 02:25:00")).toBeInTheDocument();
    vi.setSystemTime(new Date(2026, 10, 25, 14, 0, 3));
    await waitFor(() => expect(screen.getByText("9d 02:24:57")).toBeInTheDocument(), { timeout: 3000 });
    fireEvent.click(btn(/Join Virtual Meeting/));
    expect(w).toHaveBeenCalledWith("https://teams.microsoft.com", "_blank");
    vi.useRealTimers();
  });

  it("submitting updates the goal with its set date and unlocks the game", async () => {
    await open("/check-in");
    expect(screen.getByText("Bi-Weekly Check-In", { selector: "h2" })).toBeInTheDocument();
    expect(screen.queryByText(/Anonymous Pulse/)).not.toBeInTheDocument();
    const [a, b, c] = Array.from(document.querySelectorAll("textarea"));
    const submit = btn(/Submit Check-In/);
    expect(submit).toBeDisabled();
    fireEvent.change(a!, { target: { value: "Great onboarding" } });
    fireEvent.change(b!, { target: { value: "More feedback" } });
    fireEvent.change(c!, { target: { value: "Ship the dashboard demo" } });
    fireEvent.click(submit);
    expect(await screen.findByText(/"Ship the dashboard demo"/)).toBeInTheDocument();
    expect(screen.getByText(/updated from this check-in/)).toBeInTheDocument();
    expect(screen.getByText(/Partner: Submitted/)).toBeInTheDocument();
    expect(JSON.parse(localStorage.getItem("momentum.goal")!).text).toBe("Ship the dashboard demo");
  });

  it("game buttons work after unlock and finishing reveals the leaderboard", async () => {
    await open("/check-in");
    const [a, b, c] = Array.from(document.querySelectorAll("textarea"));
    for (const [el, v] of [[a, "x"], [b, "y"], [c, "z"]] as const) fireEvent.change(el!, { target: { value: v } });
    fireEvent.click(btn(/Submit Check-In/));
    await screen.findByText(/Partner: Submitted/);
    const submitGroup = btn("Submit Group");
    expect(submitGroup).toBeDisabled();
    fireEvent.click(btn(/Shuffle/));
    fireEvent.click(btn("Finish & Submit Game Score"));
    expect(await screen.findByText(/Your Team/)).toBeInTheDocument();
  });
});
