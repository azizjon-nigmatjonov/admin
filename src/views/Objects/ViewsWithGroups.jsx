import { useCallback, useState } from "react";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import CreateButton from "../../components/Buttons/CreateButton";
import RectangleIconButton from "../../components/Buttons/RectangleIconButton";
import FiltersBlock from "../../components/FiltersBlock";
import TableCard from "../../components/TableCard";
import useTabRouter from "../../hooks/useTabRouter";
import ViewTabSelector from "./components/ViewTypeSelector";
import TableView from "./TableView";
import style from "./style.module.scss";
import TreeView from "./TreeView";
import SettingsButton from "./components/ViewSettings/SettingsButton";
import { useParams } from "react-router-dom";
import constructorObjectService from "../../services/constructorObjectService";
import { getRelationFieldTabsLabel } from "../../utils/getRelationFieldLabel";
import { CircularProgress } from "@mui/material";
import { useMutation, useQuery } from "react-query";
import useFilters from "../../hooks/useFilters";
import FastFilterButton from "./components/FastFilter/FastFilterButton";
import { useDispatch, useSelector } from "react-redux";
import { CheckIcon } from "../../assets/icons/icon";
import { tableSizeAction } from "../../store/tableSize/tableSizeSlice";
import PermissionWrapperV2 from "../../components/PermissionWrapper/PermissionWrapperV2";
import ExcelButtons from "./components/ExcelButtons";
import FormatLineSpacingIcon from "@mui/icons-material/FormatLineSpacing";
import MultipleInsertButton from "./components/MultipleInsertForm";
import CustomActionsButton from "./components/CustomActionsButton";
import { Clear, Edit, Save } from "@mui/icons-material";
import { useFieldArray, useForm } from "react-hook-form";

const ViewsWithGroups = ({
  views,
  selectedTabIndex,
  setSelectedTabIndex,
  view,
  fieldsMap,
  selectedMenuItem,
}) => {
  const { tableSlug } = useParams();
  const dispatch = useDispatch();
  const { filters } = useFilters(tableSlug, view.id);
  const tableHeight = useSelector((state) => state.tableSize.tableHeight);
  const [shouldGet, setShouldGet] = useState(false);
  const [heightControl, setHeightControl] = useState(false);
  const { navigateToForm } = useTabRouter();
  const [dataLength, setDataLength] = useState(null);
  const [formVisible, setFormVisible] = useState(false);
  const [selectedObjects, setSelectedObjects] = useState([]);
  const settings_permissions = useSelector((state) => state.auth.settings_permissions);

  const tableHeightOptions = [
    {
      label: "Small",
      value: "small",
    },
    {
      label: "Medium",
      value: "medium",
    },
    {
      label: "Large",
      value: "large",
    },
  ];

  const {
    control,
    reset,
    handleSubmit,
    watch,
    setValue: setFormValue,
  } = useForm({
    defaultValues: {
      multi: [],
    },
  });

  const { fields, remove, append } = useFieldArray({
    control,
    name: "multi",
  });

  const getValue = useCallback((item, key) => {
    return typeof item?.[key] === "object" ? item?.[key].value : item?.[key];
  }, []);

  const { mutate: updateMultipleObject, isLoading } = useMutation(
    (values) =>
      constructorObjectService.updateMultipleObject(tableSlug, {
        data: {
          objects: values.multi.map((item) => ({
            ...item,
            guid: item?.guid ?? "",
            doctors_id_2: getValue(item, "doctors_id_2"),
            doctors_id_3: getValue(item, "doctors_id_3"),
            specialities_id: getValue(item, "specialities_id"),
          })),
        },
      }),
    {
      onSuccess: () => {
        setShouldGet((p) => !p);
        setFormVisible(false);
      },
    }
  );

  const onSubmit = (data) => {
    updateMultipleObject(data);
  };

  const handleHeightControl = (val) => {
    dispatch(
      tableSizeAction.setTableHeight({
        tableHeight: val,
      })
    );
    setHeightControl(false);
  };

  const navigateToCreatePage = () => {
    navigateToForm(tableSlug);
  };

  const groupFieldId = view?.group_fields?.[0];
  const groupField = fieldsMap[groupFieldId];

  const { data: tabs, isLoading: loader } = useQuery(
    queryGenerator(groupField, filters)
  );

  return (
    <>
      <FiltersBlock
        extra={
          <>
            <FastFilterButton view={view} fieldsMap={fieldsMap} />
            <ExcelButtons filters={filters} fieldsMap={fieldsMap} />
            {view.type === "TABLE" && (
              <RectangleIconButton
                color="white"
                onClick={() => setHeightControl(!heightControl)}
              >
                <div style={{ position: "relative" }}>
                  <span
                    style={{
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <FormatLineSpacingIcon />
                  </span>
                  {heightControl && (
                    <div className={style.heightControl}>
                      {tableHeightOptions.map((el) => (
                        <div
                          key={el.value}
                          className={style.heightControl_item}
                          onClick={() => handleHeightControl(el.value)}
                        >
                          {el.label}
                          {tableHeight === el.value ? <CheckIcon /> : null}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </RectangleIconButton>
            )}
            {settings_permissions?.[0]?.read === 'Yes' && (
              <SettingsButton />
            )}
          </>
        }
      >
        <ViewTabSelector
          selectedTabIndex={selectedTabIndex}
          setSelectedTabIndex={setSelectedTabIndex}
          views={views}
          settings_read={settings_permissions?.[0]?.read ?? []}
        />
      </FiltersBlock>

      <Tabs direction={"ltr"} defaultIndex={0}>
        <TableCard type="withoutPadding">
          <div className={style.tableCardHeader}>
            <>
              <h2 className={style.mainTextArea}>{selectedMenuItem?.title}</h2>
              <TabList>
                {tabs?.map((tab) => (
                  <Tab key={tab.value}>{tab.label}</Tab>
                ))}
              </TabList>
            </>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <PermissionWrapperV2 tableSlug={tableSlug} type="write">
                <CreateButton type="secondary" onClick={navigateToCreatePage} />
              </PermissionWrapperV2>
              <PermissionWrapperV2 tableSlug={tableSlug} type="update">
                {formVisible ? (
                  <>
                    <RectangleIconButton
                      color="success"
                      size="small"
                      onClick={handleSubmit(onSubmit)}
                      loader={isLoading}
                    >
                      <Save color="success" />
                    </RectangleIconButton>
                    <RectangleIconButton
                      color="error"
                      onClick={() => {
                        setFormVisible(false);
                        if (fields.length > dataLength) {
                          remove(
                            Array(fields.length - dataLength)
                              .fill("*")
                              .map((i, index) => fields.length - (index + 1))
                          );
                        }
                      }}
                    >
                      <Clear color="error" />
                    </RectangleIconButton>
                  </>
                ) : (
                  <RectangleIconButton
                    color="success"
                    className="mr-1"
                    size="small"
                    onClick={() => {
                      setFormVisible(true);
                      // reset()
                    }}
                  >
                    <Edit color="primary" />
                  </RectangleIconButton>
                )}
              </PermissionWrapperV2>

              <MultipleInsertButton view={view} fieldsMap={fieldsMap} />
              <CustomActionsButton
                selectedObjects={selectedObjects}
                setSelectedObjects={setSelectedObjects}
                tableSlug={tableSlug}
              />
            </div>
          </div>

          {/* <>
            {view.type === "TREE" ? (
              <TreeView
                filters={filters}
                filterChangeHandler={filterChangeHandler}
                view={view}
              />
            ) : (
              <TableView
                filters={filters}
                filterChangeHandler={filterChangeHandler}
              />
            )}
          </> */}

          {loader ? (
            <div className={style.loader}>
              <CircularProgress />
            </div>
          ) : (
            <>
              {tabs?.map((tab) => (
                <TabPanel key={tab.value}>
                  {view.type === "TREE" ? (
                    <TreeView
                      tableSlug={tableSlug}
                      filters={filters}
                      view={view}
                      fieldsMap={fieldsMap}
                      tab={tab}
                    />
                  ) : (
                    <TableView
                      control={control}
                      setFormVisible={setFormVisible}
                      formVisible={formVisible}
                      filters={filters}
                      view={view}
                      fieldsMap={fieldsMap}
                      tab={tab}
                      selectedObjects={selectedObjects}
                      setSelectedObjects={setSelectedObjects}
                    />
                  )}
                </TabPanel>
              ))}

              {!tabs?.length && (
                <>
                  {view.type === "TREE" ? (
                    <TreeView
                      tableSlug={tableSlug}
                      filters={filters}
                      view={view}
                      fieldsMap={fieldsMap}
                    />
                  ) : (
                    <TableView
                      setDataLength={setDataLength}
                      shouldGet={shouldGet}
                      reset={reset}
                      fields={fields}
                      setFormValue={setFormValue}
                      control={control}
                      setFormVisible={setFormVisible}
                      formVisible={formVisible}
                      filters={filters}
                      view={view}
                      fieldsMap={fieldsMap}
                      selectedObjects={selectedObjects}
                      setSelectedObjects={setSelectedObjects}
                    />
                  )}
                </>
              )}
            </>
          )}
        </TableCard>
      </Tabs>
    </>
  );
};

const queryGenerator = (groupField, filters = {}) => {
  if (!groupField)
    return {
      queryFn: () => {},
    };

  const filterValue = filters[groupField.slug];
  const computedFilters = filterValue ? { [groupField.slug]: filterValue } : {};

  if (groupField?.type === "PICK_LIST" || groupField?.type === "MULTISELECT") {
    return {
      queryKey: ["GET_GROUP_OPTIONS", groupField.id],
      queryFn: () =>
        groupField?.attributes?.options?.map((el) => ({
          label: el?.label ?? el.value,
          value: el?.value,
          slug: groupField?.slug,
        })),
    };
  }

  if (groupField?.type === "LOOKUP" || groupField?.type === "LOOKUPS") {
    const queryFn = () =>
      constructorObjectService.getList(groupField.table_slug, {
        data: computedFilters ?? {},
      });

    return {
      queryKey: [
        "GET_OBJECT_LIST_ALL",
        { tableSlug: groupField.table_slug, filters: computedFilters },
      ],
      queryFn,
      select: (res) =>
        res?.data?.response?.map((el) => ({
          label: getRelationFieldTabsLabel(groupField, el),
          value: el.guid,
          slug: groupField?.slug,
        })),
    };
  }
};

export default ViewsWithGroups;
