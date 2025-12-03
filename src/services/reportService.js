import api from "./axios";


export const createReport = (data) =>
  api.post("/reports/", data);

export const listReports = () =>
  api.get("/reports/");

export const getReportById = (report_id) =>
  api.get(`/reports/${report_id}`);

export const approveReport = (report_id) =>
  api.post(`/reports/${report_id}/approve`);

export const dismissReport = (report_id) =>
  api.post(`/reports/${report_id}/dismiss`);
