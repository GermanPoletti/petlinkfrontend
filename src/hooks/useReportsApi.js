import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as reportApi from "../services/reportService"; // Corregido el path

export const useReportsApi = () => {
  const queryClient = useQueryClient();

  // --------------------
  // QUERIES
  // --------------------
  const useListReports = () =>
    useQuery({
      queryKey: ["reports"],
      queryFn: reportApi.listReports,
    });


  const useGetReportsCount = () => 
      useQuery({
        queryKey: ["countReports"], 
        queryFn: () => reportApi.countAllReports(),
        refetchInterval: 10000,
    });

  const useGetReportById = (report_id) =>
    useQuery({
      queryKey: ["report", report_id],
      queryFn: () => reportApi.getReportById(report_id),
      enabled: !!report_id,
    });

  // --------------------
  // MUTATIONS
  // --------------------
  const createReport = useMutation({
    mutationFn: reportApi.createReport,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["reports"] }),
  });

  const approveReport = useMutation({
    mutationFn: reportApi.approveReport,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["reports"] }),
  });

  const dismissReport = useMutation({
    mutationFn: reportApi.dismissReport,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["reports"] }),
  });

  return {
    useListReports,
    useGetReportById,
    useGetReportsCount,
    createReport,
    approveReport,
    dismissReport,
  };
};