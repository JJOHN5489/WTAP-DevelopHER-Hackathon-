import { fireEvent, screen, waitFor, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { btn, closeDialog, findDialog, link, open } from "./helpers";

describe("Career Roadmap drawer", () => {
  it("flowchart node opens the drawer and Request Coffee Chat works", async () => {
    await open("/roadmap");
    fireEvent.click(screen.getByText("Target Role").closest("button")!);
    const dialog = await findDialog();
    expect(within(dialog).getByText("Required skills")).toBeInTheDocument();
    fireEvent.click(within(dialog).getAllByText(/Request Coffee Chat/)[0]!);
    expect(await screen.findByText(/Coffee chat requested with/)).toBeInTheDocument();
    await closeDialog(dialog);
  });

});
