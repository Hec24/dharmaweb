import { google } from "googleapis";
import { JWT } from "google-auth-library";
import * as path from "path";

async function main() {
  const keyPath = path.resolve(__dirname, "../credenciales/dharmabookings-63805b9a99e5.json");
  const credentials = require(keyPath);

  // Tipamos GoogleAuth a JWT para mayor claridad
  const auth = new google.auth.GoogleAuth<JWT>({
    credentials,
    scopes: [
      "https://www.googleapis.com/auth/calendar",
      "https://www.googleapis.com/auth/calendar.events",
    ],
    clientOptions: {
      subject: "info@dharmaenruta.com", // impersonation (DWD)
    },
  });

  // 👇 PASA *EL GoogleAuth*, no el cliente
  google.options({ auth });

  const calendar = google.calendar("v3");

  const res = await calendar.events.insert({
    calendarId: "primary",
    sendUpdates: "all",
    requestBody: {
      summary: "Prueba DWD (auth global con GoogleAuth)",
      start: { dateTime: "2025-09-22T17:00:00", timeZone: "Europe/Madrid" },
      end:   { dateTime: "2025-09-22T18:00:00", timeZone: "Europe/Madrid" },
      attendees: [{ email: "tuemail@ejemplo.com" }],
      guestsCanInviteOthers: false,
      guestsCanModify: false,
      guestsCanSeeOtherGuests: false,
      reminders: { useDefault: true },
    },
  });

  console.log("OK →", res.data.htmlLink);
}

main().catch(e => {
  console.error("Fallo:", e?.response?.data || e);
  process.exit(1);
});
