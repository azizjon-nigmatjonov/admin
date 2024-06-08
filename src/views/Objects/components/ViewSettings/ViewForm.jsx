import { Delete, FilterAlt, JoinInner, TableChart } from "@mui/icons-material";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { Tab, TabList, Tabs, TabPanel } from "react-tabs";
import CancelButton from "../../../../components/Buttons/CancelButton";
import SaveButton from "../../../../components/Buttons/SaveButton";
import FRow from "../../../../components/FormElements/FRow";
import HFSelect from "../../../../components/FormElements/HFSelect";
import HFTextField from "../../../../components/FormElements/HFTextField";
import useWatch from "../../../../hooks/useWatch";
import constructorViewService from "../../../../services/constructorViewService";
import { viewTypes } from "../../../../utils/constants/viewTypes";
import CalendarSettings from "./CalendarSettings";
import ColumnsTab from "./ColumnsTab";
import GanttSettings from "./GanttSettings";
import GroupsTab from "./GroupsTab";
import MultipleInsertSettings from "./MultipleInsertSettings";
import QuickFiltersTab from "./QuicFiltersTab";
import styles from "./style.module.scss";

const ViewForm = ({
  initialValues,
  closeForm,
  refetchViews,
  setIsChanged,
  columns,
  relationColumns,
}) => {
  const { tableSlug, appId } = useParams();
  const [btnLoader, setBtnLoader] = useState(false);
  const [deleteBtnLoader, setDeleteBtnLoader] = useState(false);

  const computedViewTypes = viewTypes?.map((el) => ({ value: el, label: el }));

  const form = useForm();

  const type = form.watch("type");

  const computedColumns = useMemo(() => {
    if (type !== "CALENDAR" && type !== "GANTT") {
      return columns;
    } else {
      return [...columns, ...relationColumns];
    }
  }, [columns, relationColumns, type]);

  useEffect(() => {
    form.reset(
      getInitialValues(initialValues, tableSlug, columns, relationColumns)
    );
  }, [initialValues, tableSlug, form]);

  useWatch(() => {
    // const formColumns = form.getValues('columns')?.filter(el => el?.is_checked).map(el => el.id)
    const formQuickFilters = form
      .getValues("quick_filters")
      ?.filter((el) => el?.is_checked)
      ?.map((el) => ({ field_id: el.id }));

    // form.setValue('columns', computeColumns(formColumns, computedColumns))
    form.setValue(
      "quick_filters",
      computeQuickFilters(
        formQuickFilters,
        type === "CALENDAR" || type === "GANTT"
          ? [...columns, ...relationColumns]
          : columns
      )
    );
  }, [type]);

  const onSubmit = (values) => {
    setBtnLoader(true);

    const computedValues = {
      ...values,
      columns:
        values.columns?.filter((el) => el.is_checked).map((el) => el.id) ?? [],
      quick_filters:
        values.quick_filters
          ?.filter((el) => el.is_checked)
          .map((el) => ({
            field_id: el.id,
            default_value: el.default_value ?? "",
          })) ?? [],
      app_id: appId,
    };

    if (initialValues === "NEW") {
      constructorViewService
        .create(computedValues)
        .then(() => {
          closeForm();
          refetchViews();
          setIsChanged(true);
        })
        .finally(() => setBtnLoader(false));
    } else {
      constructorViewService
        .update(computedValues)
        .then(() => {
          closeForm();
          refetchViews();
          setIsChanged(true);
        })
        .finally(() => setBtnLoader(false));
    }
  };

  const deleteView = () => {
    setDeleteBtnLoader(true);
    constructorViewService
      .delete(initialValues.id)
      .then(() => {
        closeForm();
        refetchViews();
      })
      .catch(() => setDeleteBtnLoader(false));
  };

  return (
    <div className={styles.formSection}>
      <div className={styles.viewForm}>
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionTitle}>Main info</div>
          </div>

          <div className={styles.sectionBody}>
            <div className={styles.formRow}>
              <FRow label="Название">
                <HFTextField control={form.control} name="name" fullWidth />
              </FRow>
              <FRow label="Тип">
                <HFSelect
                  options={computedViewTypes}
                  control={form.control}
                  name="type"
                  fullWidth
                />
              </FRow>
            </div>
          </div>
        </div>

        {type === "CALENDAR" && (
          <CalendarSettings form={form} columns={columns} />
        )}

        {type === "GANTT" && <GanttSettings form={form} columns={columns} />}

        <MultipleInsertSettings form={form} columns={columns} />

        <Tabs>
          <div className={styles.section}>
            <TabList>
              <Tab>
                {" "}
                <FilterAlt /> Quick filters
              </Tab>
              <Tab>
                {" "}
                <TableChart />
                Columns
              </Tab>
              <Tab>
                {" "}
                <JoinInner /> Group by
              </Tab>
            </TabList>
            <TabPanel>
              <QuickFiltersTab form={form} />
            </TabPanel>
            <TabPanel>
              <ColumnsTab form={form} />
            </TabPanel>
            <TabPanel>
              <GroupsTab columns={computedColumns} form={form} />
            </TabPanel>
          </div>
        </Tabs>
      </div>

      <div className={styles.formFooter}>
        {initialValues !== "NEW" && (
          <CancelButton
            loading={deleteBtnLoader}
            onClick={deleteView}
            title={"Delete"}
            icon={<Delete />}
          />
        )}
        <CancelButton onClick={closeForm} />
        <SaveButton onClick={form.handleSubmit(onSubmit)} loading={btnLoader} />
      </div>
    </div>
  );
};

const getInitialValues = (
  initialValues,
  tableSlug,
  columns,
  relationColumns
) => {
  if (initialValues === "NEW")
    return {
      type: "TABLE",
      users: [],
      name: "",
      main_field: "",
      time_interval: 60,
      status_field_slug: "",
      disable_dates: {
        day_slug: "",
        table_slug: "",
        time_from_slug: "",
        time_to_slug: "",
      },
      columns: columns?.map((el) => ({ ...el, is_checked: true })) ?? [],
      quick_filters: columns ?? [],
      group_fields: [],
      table_slug: tableSlug,
      updated_fields: [],
      multiple_insert: false,
      multiple_insert_field: "",
    };

  return {
    type: initialValues?.type ?? "TABLE",
    users: initialValues?.users ?? [],
    name: initialValues?.name ?? "",
    main_field: initialValues?.main_field ?? "",
    status_field_slug: initialValues?.status_field_slug ?? "",
    disable_dates: {
      day_slug: initialValues?.disable_dates?.day_slug ?? "",
      table_slug: initialValues?.disable_dates?.table_slug ?? "",
      time_from_slug: initialValues?.disable_dates?.time_from_slug ?? "",
      time_to_slug: initialValues?.disable_dates?.time_to_slug ?? "",
    },
    columns: computeColumns(initialValues?.columns, columns),
    quick_filters:
      computeQuickFilters(
        initialValues?.quick_filters,
        initialValues?.type === "CALENDAR" || initialValues?.type === "GANTT"
          ? [...columns, ...relationColumns]
          : columns
      ) ?? [],
    group_fields: computeGroupFields(
      initialValues?.group_fields,
      initialValues?.type === "CALENDAR" || initialValues?.type === "GANTT"
        ? [...columns, ...relationColumns]
        : columns
    ),
    table_slug: tableSlug,
    id: initialValues?.id,
    calendar_from_slug: initialValues?.calendar_from_slug ?? "",
    calendar_to_slug: initialValues?.calendar_to_slug ?? "",
    time_interval: initialValues?.time_interval ?? 60,
    updated_fields: initialValues?.updated_fields ?? [],
    multiple_insert: initialValues?.multiple_insert ?? false,
    multiple_insert_field: initialValues?.multiple_insert_field ?? "",
  };
};

const computeColumns = (checkedColumnsIds = [], columns) => {
  const selectedColumns =
    checkedColumnsIds
      ?.filter((id) => columns.find((el) => el.id === id))
      ?.map((id) => ({
        ...columns.find((el) => el.id === id),
        is_checked: true,
      })) ?? [];
  const unselectedColumns =
    columns?.filter((el) => !checkedColumnsIds?.includes(el.id)) ?? [];
  return [...selectedColumns, ...unselectedColumns];
};

const computeQuickFilters = (quickFilters = [], columns) => {
  const selectedQuickFilters =
    quickFilters
      ?.filter((filter) => columns.find((el) => el.id === filter.field_id))
      ?.map((filter) => ({
        ...columns.find((el) => el.id === filter.field_id),
        ...filter,
        is_checked: true,
      })) ?? [];
  const unselectedQuickFilters =
    columns?.filter(
      (el) => !quickFilters?.find((filter) => filter.field_id === el.id)
    ) ?? [];
  return [...selectedQuickFilters, ...unselectedQuickFilters];
};

const computeGroupFields = (groupFields = [], columns) => {
  return (
    groupFields?.filter((groupFieldID) =>
      columns?.some((column) => column.id === groupFieldID)
    ) ?? []
  );
};

export default ViewForm;
