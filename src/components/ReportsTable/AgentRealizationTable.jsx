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

const AgentRealizationTable = () => {
  const [loader, setLoader] = useState(false);
  const [data, setData] = useState([]);
  const [limit, setLimit] = useState(10);
  const [pagesCount, setCurrentPages] = useState(1);
  const realizationCountTotal =
    data.length &&
    data?.reduce(
      (accumulator, currentValue) =>
        accumulator + currentValue?.realization?.realization_count,
      0
    );
  const realizationSumTotal =
    data.length &&
    data?.reduce(
      (accumulator, currentValue) =>
        accumulator + currentValue?.realization?.realization_sum,
      0
    );
  const transferSumTotal =
    data.length &&
    data?.reduce(
      (accumulator, currentValue) =>
        accumulator + currentValue?.transfer?.transfer_sum,
      0
    );
  const transferCountTotal =
    data.length &&
    data?.reduce(
      (accumulator, currentValue) =>
        accumulator + currentValue?.transfer?.transfer_count,
      0
    );
  const performanceTotal =
    data.length &&
    data?.reduce(
      (accumulator, currentValue) => accumulator + currentValue?.performance,
      0
    );
  const fetchData = () => {
    setLoader(true);
    ReportService.agent_Realization_getList()
      .then((res) => setData(res?.agent_realization_data))
      .finally(() => setLoader(false));
  };
  useEffect(() => {
    fetchData();
  }, []);
  return (
    <CTable columnsCount={4} loader={loader}>
      {!loader && data.length ? (
        <CTableHead>
          <CTableRow>
            <CTableHeadCell rowspan={2} width={10}>
              №
            </CTableHeadCell>
            <CTableHeadCell rowspan={2} width={10}>
              Наименование
            </CTableHeadCell>
            <CTableHeadCell rowspan={2} width={10}>
              Ед. изм.
            </CTableHeadCell>
            <CTableHeadCell colspan={2} width={10}>
              Реализация
            </CTableHeadCell>
            <CTableHeadCell colspan={2} width={10}>
              Перемещение
            </CTableHeadCell>
            <CTableHeadCell width={10}>Производительность</CTableHeadCell>
          </CTableRow>
          <CTableRow>
            <CTableHeadCell width={10}>Кол-во</CTableHeadCell>
            <CTableHeadCell width={10}>Сумма</CTableHeadCell>
            <CTableHeadCell width={10}>Кол-во</CTableHeadCell>
            <CTableHeadCell width={10}>Сумма</CTableHeadCell>
            <CTableHeadCell width={10}>%</CTableHeadCell>
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
              <CTableRow key={row.agent_id}>
                <CTableCell>{rowIndex + 1}</CTableCell>
                <CTableCell>{row.agent_name}</CTableCell>
                <CTableCell>{row.unit}</CTableCell>
                <CTableCell>{numberWithSpaces(row.realization?.realization_count)}</CTableCell>
                <CTableCell>{numberWithSpaces(row.realization?.realization_sum)}</CTableCell>
                <CTableCell>{numberWithSpaces(row.transfer?.transfer_count)}</CTableCell>
                <CTableCell>{numberWithSpaces(row.transfer?.transfer_sum)}</CTableCell>
                <CTableCell>{row.performance}</CTableCell>
              </CTableRow>
            ))}
              <CTableRow className="font-bold">
                <CTableCell style={{ textAlign: "left" }} colspan={3}>Итого:</CTableCell>
                <CTableCell>{numberWithSpaces(realizationCountTotal)}</CTableCell>
                <CTableCell>{numberWithSpaces(realizationSumTotal)}</CTableCell>
                <CTableCell>{numberWithSpaces(transferCountTotal)}</CTableCell>
                <CTableCell>{numberWithSpaces(transferSumTotal)}</CTableCell>
                <CTableCell>{numberWithSpaces(performanceTotal)}</CTableCell>
              </CTableRow>
          </>
        ) : null}
      </CTableBody>
    </CTable>
  );
};

export default AgentRealizationTable;
