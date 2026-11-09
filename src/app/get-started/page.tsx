import { redirect } from "next/navigation";

// Old placeholder route: send visitors to the real sign-up page.
export default function GetStartedPage() {
  redirect("/sign-up");
}
