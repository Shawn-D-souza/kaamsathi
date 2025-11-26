"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function addZone(prevState: any, formData: FormData) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { error: "Not authenticated", success: false };
  }

  const latStr = formData.get("lat") as string;
  const lngStr = formData.get("lng") as string;
  const radiusStr = formData.get("radius") as string;

  if (!latStr || !lngStr || !radiusStr) {
    return { error: "Please select a location and radius.", success: false };
  }

  const radius = parseInt(radiusStr);
  // PostGIS format: POINT(longitude latitude)
  const locationString = `POINT(${parseFloat(lngStr)} ${parseFloat(latStr)})`;

  const { error } = await supabase
    .from("provider_locations")
    .insert({
      provider_id: user.id,
      location: locationString,
      radius_meters: radius,
    });

  if (error) {
    console.error("Add Zone Error:", error);
    return { error: "Failed to add service zone.", success: false };
  }

  revalidatePath("/profile/locations");
  return { success: true, error: "" };
}

export async function deleteZone(zoneId: string) {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase
    .from("provider_locations")
    .delete()
    .eq("id", zoneId)
    .eq("provider_id", user.id);

  if (error) {
    console.error("Delete Zone Error:", error);
    return { error: "Failed to delete zone." };
  }

  revalidatePath("/profile/locations");
  return { error: "" };
}