import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "react-query";

import constructorObjectService from "../../../services/constructorObjectService";
import { pageToOffset } from "../../../utils/pageToOffset";
import useTabRouter from "../../../hooks/useTabRouter";
import useFilters from "../../../hooks/useFilters";
import FastFilter from "../components/FastFilter";
import styles from "./styles.module.scss";
import { useDispatch, useSelector } from "react-redux";
import ObjectDataTable from "../../../components/DataTable/ObjectDataTable";
import useCustomActionsQuery from "../../../queries/hooks/useCustomActionsQuery";
import { showAlert } from "../../../store/alert/alert.thunk";

const TableView = ({
  tab,
  view,
  shouldGet,
  reset = () => {},
  fieldsMap,
  isDocView,
  formVisible,
  setFormVisible,
  selectedObjects,
  setDataLength,
  setSelectedObjects,
  ...props
}) => {
  const { navigateToForm } = useTabRouter();
  const { tableSlug } = useParams();
  const { new_list } = useSelector((state) => state.filter);
  const dispatch = useDispatch();
  const branch_id_receiver = useSelector((state) => state.auth?.branchId?.[0]?.object_id);
  const clientType = useSelector((state) => state.auth.clientType.name);

  const { filters, filterChangeHandler } = useFilters(tableSlug, view.id);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [deleteLoader, setDeleteLoader] = useState(false);
  const colorMap = new Map([
    // [Head color, Body color]
    ["income", ["#BBDEFB", "RGBA(144,202,249,0.2)"]],
    ["sale", ["#C8E6C9", "RGBA(165,214,167,0.2)"]],
    ["remaining", ["#E1BEE7", "RGBA(206,147,216,0.2)"]],
  ]);

  const columns = useMemo(() => {
    return view?.columns?.map((el) => fieldsMap[el])?.filter((el) => el);
  }, [view, fieldsMap]);

  const clientTypePermissionField = (client_type,table_slug, value)=>{
    if (clientType===client_type && tableSlug ===table_slug) {
      return value
    } else return 
  }

  const {
    data: { tableData, pageCount } = { tableData: [], pageCount: 1 },
    refetch,
    isLoading: tableLoader,
  } = useQuery({
    queryKey: [
      "GET_OBJECTS_LIST",
      {
        tableSlug,
        currentPage,
        limit,
        filters: { ...filters, [tab?.slug]: tab?.value },
        shouldGet,
      },
    ],
    queryFn: () => {
      return constructorObjectService.getList(tableSlug, {
        data: {
          offset: pageToOffset(currentPage),
          limit,
          ...filters,
          branch_id_2: clientTypePermissionField("CASHIER","transfer_receive",branch_id_receiver),
          [tab?.slug]: tab?.value,
        },
      });
    },
    select: (res) => {
      // setDataLength(res.data?.response.length ?? 0)
      return {
        tableData: res.data?.response ?? [],
        pageCount: isNaN(res.data?.count)
          ? 1
          : Math.ceil(res.data?.count / limit),
      };
    },
  });

  useEffect(() => {
    if (tableData?.length) {
      reset({
        multi: tableData.map((i) => i),
      });
    }
  }, [tableData, reset]);

  const { data: { custom_events: customEvents = [] } = {} } =
    useCustomActionsQuery({
      tableSlug,
    });

  const onCheckboxChange = (val, row) => {
    if (val) setSelectedObjects((prev) => [...prev, row.guid]);
    else setSelectedObjects((prev) => prev.filter((id) => id !== row.guid));
  };

  const deleteHandler = async (row) => {
    setDeleteLoader(true);
    try {
      await constructorObjectService.delete(tableSlug, row.guid);
      refetch();
    } finally {
      setDeleteLoader(false);
    }
  };
  const onRejected = async (row) => {
    setDeleteLoader(true);
    try {
      const response = await constructorObjectService.rejected(row.guid);
      dispatch(showAlert(response, "success"));
      refetch();
    } finally {
      setDeleteLoader(false);
    }
  };

  const navigateToEditPage = (row) => {
    navigateToForm(tableSlug, "EDIT", row);
  };

  return (
    <div className={styles.wrapper}>
      {(view?.quick_filters?.length > 0 ||
        (new_list[tableSlug] &&
          new_list[tableSlug].some((i) => i.checked))) && (
        <div className={styles.filters}>
          <p>Фильтры</p>
          <FastFilter view={view} fieldsMap={fieldsMap} isVertical />
        </div>
      )}
      <ObjectDataTable
        formVisible={formVisible}
        setFormVisible={setFormVisible}
        isRelationTable={false}
        removableHeight={isDocView ? 150 : 215}
        currentPage={currentPage}
        pagesCount={pageCount}
        columns={columns}
        limit={limit}
        setLimit={setLimit}
        onPaginationChange={setCurrentPage}
        loader={tableLoader || deleteLoader}
        data={tableData}
        disableFilters
        isChecked={(row) => selectedObjects?.includes(row.guid)}
        onCheckboxChange={!!customEvents?.length && onCheckboxChange}
        filters={filters}
        filterChangeHandler={filterChangeHandler}
        onRowClick={navigateToEditPage}
        onDeleteClick={deleteHandler}
        tableSlug={tableSlug}
        onRejectedClick={onRejected}
        backClr={
          colorMap.get(tableSlug) ? colorMap.get(tableSlug) : ["#fff", "#fff"]
        }
        tableStyle={{
          borderRadius: 0,
          border: "none",
          borderBottom: "1px solid #E5E9EB",
          width: view?.quick_filters?.length ? "calc(100vw - 254px)" : "100%",
        }}
        isResizeble={true}
        {...props}
      />
    </div>
  );
};

export default TableView;
