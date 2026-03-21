export async function getLocationName(lat: number, lon: number) {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
    );

    const data = await res.json();
    console.log("LOCATION API:", data); // 👈 add this

    return data.display_name || "Unknown";
  } catch (err) {
    console.error("Location fetch failed:", err);
    return "Unknown";
  }
}