import { redirect } from "next/navigation";

// Any URL that doesn't match a route (e.g. /asdfasdf) lands here.
// Redirect to the home page instead of showing a 404.
export default function NotFound() {
    redirect("/");
}
