"use client";

import { useMemo } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import L from "leaflet";
import { format } from "date-fns";
import { Countdown } from "@/components/Countdown";
import { UTSG_BOUNDS, UTSG_CENTER } from "@/lib/scraper/geocode";
import { eventStatus } from "@/lib/status";
import type { FoodEvent } from "@/models/Event";
import "leaflet/dist/leaflet.css";

function pinIcon(event: FoodEvent) {
  const status = eventStatus(event);
  const emoji = event.foodType.toLowerCase().includes("pizza")
    ? "🍕"
    : event.foodType.toLowerCase().includes("donut")
      ? "🍩"
      : event.foodType.toLowerCase().includes("tea")
        ? "🧋"
        : event.foodType.toLowerCase().includes("lunch")
          ? "🍱"
          : "🍪";
  return L.divIcon({
    className: "food-pin",
    html: `<div class="food-pin-inner ${status}">${emoji}</div>`,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
  });
}

export function CampusMap({ events }: { events: FoodEvent[] }) {
  const mapbox = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
  const tileUrl = mapbox
    ? `https://api.mapbox.com/styles/v1/mapbox/light-v11/tiles/{z}/{x}/{y}?access_token=${mapbox}`
    : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
  const attribution = mapbox
    ? "&copy; Mapbox &copy; OpenStreetMap"
    : "&copy; OpenStreetMap contributors";

  const markers = useMemo(() => events, [events]);

  return (
    <MapContainer
      center={UTSG_CENTER}
      zoom={16}
      maxBounds={UTSG_BOUNDS}
      scrollWheelZoom
      className="h-full w-full rounded-2xl"
    >
      <TileLayer attribution={attribution} url={tileUrl} />
      {markers.map((event) => (
        <Marker key={event.id} position={[event.lat, event.lng]} icon={pinIcon(event)}>
          <Popup>
            <div className="min-w-[220px] space-y-2">
              <p className="text-xs uppercase tracking-wide text-[var(--tomato)]">{event.foodType}</p>
              <h3 className="text-base font-semibold text-[var(--navy)]">{event.title}</h3>
              <p className="text-sm">{event.hostClub}</p>
              <p className="text-sm">
                {format(new Date(event.startAt), "EEE h:mm a")}
                {" · "}
                {event.room ? `${event.room}, ` : ""}
                {event.building}
              </p>
              <Countdown event={event} />
              <a
                className="mt-2 inline-block rounded-full bg-[var(--navy)] px-3 py-1 text-sm text-white"
                href={event.sourceUrl}
                target="_blank"
                rel="noreferrer"
              >
                View original post
              </a>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
