import React, { useEffect } from "react";
import { gapi } from "gapi-script";

const GoogleCalendar = () => {
  const CLIENT_ID =
    "734190329772-din3hcq6int7khniunf3sf4cmucesclk.apps.googleusercontent.com";
  const API_KEY = "YOUR_API_KEY";
  const SCOPES = "https://www.googleapis.com/auth/calendar.events";

  useEffect(() => {
    function start() {
      gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: [
          "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest",
        ],
        scope: SCOPES,
      });
    }
    gapi.load("client:auth2", start);
  }, []);

  const handleAuthClick = () => {
    gapi.auth2.getAuthInstance().signIn();
  };

  const handleSignOutClick = () => {
    gapi.auth2.getAuthInstance().signOut();
  };

  const listUpcomingEvents = () => {
    gapi.client.calendar.events
      .list({
        calendarId: "primary",
        timeMin: new Date().toISOString(),
        showDeleted: false,
        singleEvents: true,
        maxResults: 10,
        orderBy: "startTime",
      })
      .then((response) => {
        const events = response.result.items;
        console.log("Upcoming events:", events);
      });
  };

  return (
    <div>
      <button onClick={handleAuthClick}>Sign In with Google</button>
      <button onClick={handleSignOutClick}>Sign Out</button>
      <button onClick={listUpcomingEvents}>List Upcoming Events</button>
    </div>
  );
};

export default GoogleCalendar;
