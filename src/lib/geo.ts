// Reverse-geocode latitude/longitude into a city name using the free
// OpenStreetMap Nominatim service. No API key required, but please respect
// their usage policy (1 request/second, identifying User-Agent).
export async function reverseGeocodeCity(lat: number, lon: number): Promise<string | null> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}&zoom=10&addressdetails=1`,
      { headers: { Accept: "application/json" } },
    );
    if (!res.ok) return null;
    const data = await res.json();
    const a = data?.address ?? {};
    return (
      a.city ||
      a.town ||
      a.village ||
      a.municipality ||
      a.county ||
      a.state_district ||
      a.state ||
      null
    );
  } catch {
    return null;
  }
}

export function getBrowserPosition(): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (!("geolocation" in navigator)) {
      reject(new Error("Geolocation is not supported by this browser."));
      return;
    }
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: false,
      timeout: 8000,
      maximumAge: 60_000,
    });
  });
}
