import { useEffect, useState } from "react";

import {
  CTable,
  CTableBody,
  CTableCell,
  CTableHead,
  CTableHeadCell,
  CTableRow,
} from "../CTable";
import ReportService from "../../services/reportsService";
import { numberWithSpaces } from "../../utils/formatNumbers";

const SoldProductsTable = () => {
  const [loader, setLoader] = useState(false);
  const [data, setData] = useState([]);
  const [limit, setLimit] = useState(10);
  const [pagesCount, setCurrentPages] = useState(1);
   const fetchData = () => {
    setLoader(true);
    ReportService.sold_Products_getList()
      .then((res) => setData(res?.sold_products_data))
      .finally(() => setLoader(false));
  };
  const columns = [
    { key: "name", label: "Наименование", render: (record) => <>{record?.product_data?.name}</> },
    { key: "imei", label: "ИМЕИ", render: (record) => <>{record?.product_data?.imei}</> },
    { key: "mxik_code", label: "Мхик-Код ", render: (record) => <>{record?.product_data?.mxik_code}</> },
    { key: "unit", label: "Ед. изм" },
    { key: "count", label: "Кол-во"},
    { key: "sold_at", label: "Продано в"},
    { key: "client_name", label: "Клиент"},
    { key: "branch_name", label: "Филиал", },
    { key: "agent_name", label: "Агент",},
    { key: "price", label: "Сумма", render:(record)=><>{numberWithSpaces(record.price)}</>},
    { key: "merchant_name", label: "Покупатель" },
  ];
  useEffect(() => {
    fetchData();
  }, []);
  return (
    <CTable columnsCount={4} loader={loader}>
      {!loader && data.length ? (
        <CTableHead>
          <CTableRow>
            <CTableHeadCell width={10}>№</CTableHeadCell>
            {columns.map((col) => (
              <CTableHeadCell>{col.label}</CTableHeadCell>
            ))}
          </CTableRow>
        </CTableHead>
      ) : null}
      <CTableBody
        dataLength={data.length}
        style={{ textAlign: "center" }}
        loader={loader}
      >
        {!loader && data.length ? (
          <>
            {data?.map((row, rowIndex) => (
              <CTableRow style={{overflowX:"auto"}}  key={row.agent_id}>
                <CTableCell>{rowIndex + 1}</CTableCell>
                {columns.map((col) => (
                  <CTableCell key={col.key}>{col.render ? col.render(row):row[col.key]}</CTableCell>
                ))}
              </CTableRow>
            ))}
          </>
        ) : null}
      </CTableBody>
    </CTable>
  );
};

export default SoldProductsTable;
