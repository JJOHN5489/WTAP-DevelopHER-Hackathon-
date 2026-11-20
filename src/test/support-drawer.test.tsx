import { fireEvent, screen, waitFor, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { btn, closeDialog, findDialog, link, open } from "./helpers";

describe("Seek Support", () => {
  it("is not anonymous and submits to a confirmation", async () => {
    await open("/");
    fireEvent.click(btn(/Seek Support/));
    const dialog = await findDialog();
    expect(dialog.querySelector('[role="switch"]')).not.toBeInTheDocument();
    expect(within(dialog).getByDisplayValue("Alex Carter")).toBeInTheDocument();
    const submit = within(dialog).getByText("Submit", { selector: "button" });
    expect(submit).toBeDisabled();
    fireEvent.click(within(dialog).getByText("Urgent Support / At-Risk Flag"));
    fireEvent.change(within(dialog).getByPlaceholderText(/Share any context/), { target: { value: "I need help" } });
    fireEvent.click(submit);
    await within(dialog).findByText("Request received");
    expect(within(dialog).getByText(/24–48 hours/)).toBeInTheDocument();
    await closeDialog(dialog);
  });
});

