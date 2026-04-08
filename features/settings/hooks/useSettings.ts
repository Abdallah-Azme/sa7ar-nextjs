import { useQuery } from "@tanstack/react-query";
import { fetchGlobalSettings, settingsKeys } from "../services/settingsService";

export function useGlobalSettingsQuery() {
  return useQuery({
    queryKey: settingsKeys.global(),
    queryFn: fetchGlobalSettings,
  });
}
