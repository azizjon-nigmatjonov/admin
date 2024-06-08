import request from "../utils/request";

const constructorObjectService = {
  getList: (tableSlug, data) =>
    request.post(`/object/get-list/${tableSlug}`, data),
  update: (tableSlug, data) => request.put(`/object/${tableSlug}`, data),
  updateMultiple: (tableSlug, data) =>
    request.post(`/object-upsert/${tableSlug}`, data),
  create: (tableSlug, data) => request.post(`/object/${tableSlug}`, data),
  getById: (tableSlug, id) => request.get(`/object/${tableSlug}/${id}`),
  delete: (tableSlug, id) =>
    request.delete(`/object/${tableSlug}/${id}`, { data: { data: {} } }),
  updateManyToMany: (data) => request.put("/many-to-many", data),
  updateMultipleObject: (tableSlug, data) =>
    request.put(`/object/multiple-update/${tableSlug}`, data),
  deleteManyToMany: (data) => request.delete("/many-to-many", { data }),
  downloadExcel: (tableSlug, data) =>
    request.post(`/object/excel/${tableSlug}`, data),
  finishInventory: (guid) => request.post(`/finish-inventory/${guid}`),
  beginInventory: (guid) => request.post(`/begin-inventory/${guid}`),
  getIncomeList: (guid) => request.post(`/income/${guid}`),
  postSaleList: (guid) => request.post(`/sale/${guid}`),
  postTransferSend: (guid) => request.post(`/transfer-send/${guid}`),
  postTransferReceive: (guid, data) => request.post(`/transfer-receive/${guid}`, data),
  rejected: (guid) => request.post(`/reject-sale/${guid}`),




};

export default constructorObjectService;
