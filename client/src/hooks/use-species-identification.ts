import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export interface SpeciesPrediction {
  species: string;
  confidence: number;
  scientificName: string;
  category: "plant" | "insect";
  impactLevel: "low" | "medium" | "high";
  nativeTo: string;
}

export interface IdentificationResult {
  id: string;
  predictions: SpeciesPrediction[];
  createdAt: string;
}

export function useSpeciesIdentification() {
  const queryClient = useQueryClient();

  const identifySpecies = useMutation({
    mutationFn: async ({ image, regionCode }: { image: File; regionCode?: string }) => {
      const formData = new FormData();
      formData.append('image', image);
      if (regionCode) {
        formData.append('regionCode', regionCode);
      }

      const response = await fetch('/api/identify', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to identify species');
      }

      return response.json() as Promise<IdentificationResult>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/identifications'] });
      queryClient.invalidateQueries({ queryKey: ['/api/stats'] });
    },
  });

  return {
    identifySpecies,
    isLoading: identifySpecies.isPending,
    error: identifySpecies.error,
    data: identifySpecies.data,
  };
}

export function useIdentificationHistory() {
  return useQuery({
    queryKey: ['/api/identifications'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/identifications');
      return response.json();
    },
  });
}

export function useAppStats() {
  return useQuery({
    queryKey: ['/api/stats'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/stats');
      return response.json();
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  });
}

export function useSubmitReport() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (report: { speciesName: string; location: string; notes?: string }) => {
      const response = await apiRequest('POST', '/api/reports', report);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/reports'] });
    },
  });
}

export function useRecentReports() {
  return useQuery({
    queryKey: ['/api/reports'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/reports');
      return response.json();
    },
  });
}

export function useAPIHealth() {
  return useQuery({
    queryKey: ['/api/health'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/health');
      return response.json();
    },
    refetchInterval: 60000, // Check every minute
  });
}
