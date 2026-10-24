import apiClient from "../../api/client";
import API_ENDPOINTS from "../../api/endpoints";

export interface InternetPackage {
  id: number;
  name: string;
  description: string;
  price: string;
  duration_hours: number;
  speed_mbps: number;
  data_limit_gb: string | number | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  duration_display: string;
  data_limit_display: string;
}

interface PaginatedPackageResponse {
  results: InternetPackage[];
}

export const packageService = {
  async getPackages(): Promise<InternetPackage[]> {
    const response = await apiClient.get<
      InternetPackage[] | PaginatedPackageResponse
    >(API_ENDPOINTS.packages.list);

    const data = response.data;

    const packages = Array.isArray(data) ? data : data.results;

    return packages.filter((item) => item.is_active);
  },

  async getPackageById(id: number): Promise<InternetPackage> {
    const response = await apiClient.get<InternetPackage>(
      API_ENDPOINTS.packages.detail(id),
    );

    return response.data;
  },
};
