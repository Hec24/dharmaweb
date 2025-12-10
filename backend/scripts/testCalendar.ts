import "dotenv/config"; // Load env before other imports
import { _debugImpersonationAndAccess } from "../googleCalendar";

async function main() {
  console.log("Testing Google Calendar Integration...");
  const result = await _debugImpersonationAndAccess();
  if (result.ok) {
    console.log("SUCCESS! Connected to Calendar.");
    console.log("Calendars found:", result.calendars?.length);
    console.log("Target Calendar access:", "OK");
  } else {
    console.error("FAILURE:", result.error);
    process.exit(1);
  }
}

main().catch(console.error);
