import { fireEvent, screen, waitFor, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { btn, closeDialog, findDialog, link, open } from "./helpers";

describe("Career Roadmap suggestions", () => {
  it("AI suggestions offer Set as target, Details and Coffee chat; no LOB explorer", async () => {
    await open("/roadmap");
    expect(screen.getByText("AI Role Suggestions & Mentorship")).toBeInTheDocument();
    expect(screen.queryByText(/internal openings/)).not.toBeInTheDocument();
    const card = screen.getAllByText("AI match")[0]!.parentElement!;
    const title = within(card).getAllByText(/./)[1]!.textContent!;
    fireEvent.click(within(card).getByText("Set as target"));
    await screen.findByText(`Goals toward ${title}`);
    fireEvent.click(within(card).getByText("Details"));
    const details = await findDialog();
    expect(details).toBeInTheDocument();
    await closeDialog(details);
  });
});

