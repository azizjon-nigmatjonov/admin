import request from "../utils/request"

const ReportService = {
  branch_Realization_getList: (data, params) => request.get(`/report/branch-realization`, data),
  agent_Realization_getList: (data, params) => request.get(`/report/agent-realization`, data),
  sold_Products_getList: (data, params) => request.get(`/report/sold-products`, data),
}

export default ReportService