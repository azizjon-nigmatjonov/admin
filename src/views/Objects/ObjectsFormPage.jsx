import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useParams } from "react-router-dom";
import PageFallback from "../../components/PageFallback";
import constructorObjectService from "../../services/constructorObjectService";
import constructorSectionService from "../../services/constructorSectionService";
import { sortByOrder } from "../../utils/sortByOrder";
import MainInfo from "./MainInfo";
import RelationSection from "./RelationSection";
import styles from "./style.module.scss";
import Footer from "../../components/Footer";
import useTabRouter from "../../hooks/useTabRouter";
import { Save } from "@mui/icons-material";
import SecondaryButton from "../../components/Buttons/SecondaryButton";
import { useQueryClient } from "react-query";
import { sortSections } from "../../utils/sectionsOrderNumber";
import constructorViewRelationService from "../../services/constructorViewRelationService";
import PermissionWrapperV2 from "../../components/PermissionWrapper/PermissionWrapperV2";
import FiltersBlock from "../../components/FiltersBlock";
import PrimaryButton from "../../components/Buttons/PrimaryButton";
import FormCustomActionButton from "./components/CustomActionsButton/FormCustomActionButtons";
import useSidebarElements from "../../hooks/useSidebarElements";
import { showAlert } from "../../store/alert/alert.thunk";
import { PermissionWrapButton } from "../../components/PermissionButton/PermissionWrapButton";
import CustomWrapperModal from "../../components/CustomModal/CustomWrapperModal";
import FormPageBackButton from "./components/FormPageBackButton";

const ObjectsFormPage = () => {
  const dispatch = useDispatch();
  const { tableSlug, id, appId } = useParams();
  const { pathname, state = {} } = useLocation();
  const { removeTab, navigateToForm, tabs, addNewTab } = useTabRouter();
  const location = useLocation();
  const queryClient = useQueryClient();
  const { elements } = useSidebarElements();
  const [sidebarActive, setSidebarActive] = useState(true);
  const userId = useSelector((state) => state.auth.userId);

  const [selectedMenuItem, setSelectedMenuItem] = useState({});

  useEffect(() => {
    setSelectedMenuItem(elements?.filter((el) => el.slug === tableSlug)?.[0]);
  }, [elements, tableSlug]);

  const tablesList = useSelector((state) => state.constructorTable.list);

  const [loader, setLoader] = useState(true);
  const [btnLoader, setBtnLoader] = useState(false);
  const [responseData, serResponseData] = useState();
  const [branchSend, setBranchSend] = useState("");
  const [disabledBtn, setDisabledBtn] = useState(false);

  const [sections, setSections] = useState([]);
  const [tableRelations, setTableRelations] = useState([]);
  const [countItem, setCountItem] = useState(0);
  const tableInfo = useMemo(() => {
    return tablesList.find((el) => el.slug === tableSlug);
  }, [tablesList, tableSlug]);

  const sectionMap = new Map([
    ["income", { text: "Сделать приход", func: () => postIncome() }],
    [
      responseData?.status && responseData?.status[0] !== "done" && "sale",
      { text: "Совершить продажу", func: () => postSale() },
    ],
    ["transfer_send", { text: "Отправить", func: () => postTransferSend() }],
    [
      "transfer_receive",
      { text: "Принять", func: () => postTransferReceive() },
    ],
  ]);

  const computedSections = useMemo(() => {
    return (
      sections
        ?.map((section) => ({
          ...section,
          fields: section.fields?.sort(sortByOrder) ?? [],
        }))
        .sort(sortByOrder) ?? []
    );
  }, [sections]);

  const getAllData = async () => {
    const getSections = constructorSectionService.getList({
      table_slug: tableSlug,
    });

    const getFormData = constructorObjectService.getById(tableSlug, id);

    const getRelations = constructorViewRelationService.getList({
      table_slug: tableSlug,
    });

    try {
      const [
        { sections = [] },
        { data = {} },
        { relations: view_relations = [] },
      ] = await Promise.all([getSections, getFormData, getRelations]);

      setSections(sortSections(sections));
      serResponseData(data?.response);

      // setTableRelations(relations?.sort(sortByOrder)?.map(el => el.relation ?? el?.view_relation_type === 'FILE' ? el : {}))

      const relations =
        view_relations?.map((el) => ({
          ...el,
          ...el.relation,
        })) ?? [];

      setTableRelations(
        relations.map((relation) => ({
          ...relation,
          relatedTable:
            relation.table_from?.slug === tableSlug
              ? relation.table_to?.slug
              : relation.table_from?.slug,
        }))
      );

      reset(data.response ?? {});

      const hasCurrentTab = tabs?.some((tab) => tab.link === location.pathname);

      if (!hasCurrentTab) addNewTab(appId, tableSlug, id, data.response);
    } catch (error) {
      console.error(error);
    } finally {
      setLoader(false);
    }
  };

  const getFields = async () => {
    try {
      const getSections = constructorSectionService.getList({
        table_slug: tableSlug,
      });

      const getRelations = constructorViewRelationService.getList({
        table_slug: tableSlug,
        // relation_table_slug: tableSlug
      });

      const [{ sections = [] }, { relations: view_relations = [] }] =
        await Promise.all([getSections, getRelations]);

      setSections(sortSections(sections));

      const relations =
        view_relations?.map((el) => ({
          ...el,
          ...el.relation,
        })) ?? [];

      setTableRelations(
        relations.map((relation) => ({
          ...relation,
          relatedTable:
            relation.table_from?.slug === tableSlug
              ? relation.table_to?.slug
              : relation.table_from?.slug,
        }))
      );
    } catch (error) {
      console.error(error);
    } finally {
      setLoader(false);
    }
  };

  const update = (data) => {
    setBtnLoader(true);

    constructorObjectService
      .update(tableSlug, { data })
      .then(() => {
        dispatch(showAlert("Успешно обновлено !", "success"));
        queryClient.invalidateQueries(["GET_OBJECT_LIST", tableSlug]);
        removeTab(pathname, tableSlug);
      })
      .catch(() => setBtnLoader(false));
  };

  const create = (data) => {
    setBtnLoader(true);

    constructorObjectService
      .create(tableSlug, { data })
      .then((res) => {
        dispatch(showAlert("Успешно обновлено !", "success"));
        queryClient.invalidateQueries(["GET_OBJECT_LIST", tableSlug]);
        if (tableSlug !== "inventory") {
          removeTab(pathname, tableSlug);
        }
        if (tableSlug === "inventory") {
          postBeginInventory(res?.data?.data?.guid, res.data?.data);
        }
        if (tableRelations?.length && tableSlug !== "inventory") {
          navigateToForm(tableSlug, "EDIT", res.data?.data);
        }
      })
      .catch(() => setBtnLoader(false));
  };

  const onSubmit = (data) => {
    if (id) update(data);
    else create(data);
  };

  const {
    handleSubmit,
    control,
    reset,
    setValue: setFormValue,
    watch,
  } = useForm({
    defaultValues: state,
  });
  const supplier_nds = watch("supplier_nds");
  const postIncome = () => {
    setDisabledBtn(true);
    constructorObjectService
      .getIncomeList(id)
      .then((res) => dispatch(showAlert(res, "success")))
      .finally(() => getAllData());
  };

  const postSale = () => {
    setDisabledBtn(true);
    constructorObjectService
      .postSaleList(id)
      .then((res) => dispatch(showAlert(res, "success")))
      .finally(() => getAllData());
  };

  const postTransferSend = () => {
    setDisabledBtn(true);
    constructorObjectService
      .postTransferSend(id)
      .then((res) => dispatch(showAlert(res, "success")))
      .finally(() => getAllData());
  };

  const postTransferReceive = () => {
    setDisabledBtn(true);
    constructorObjectService
      .postTransferReceive(id, {user_id: userId})
      .then((res) => dispatch(showAlert(res, "success")))
      .finally(() => getAllData());
  };

  const postBeginInventory = async (id, data) => {
    setDisabledBtn(false);
    setLoader(true);
    try {
      await constructorObjectService
        .beginInventory(id)
        .then((res) => dispatch(showAlert(res, "success")))
        .finally(() => getAllData());
      if (tableSlug === "inventory") {
        removeTab(pathname, tableSlug);
        navigateToForm(tableSlug, "EDIT", data);
      }
    } catch (error) {
      console.error(error);
    }
  };
  const postFinishInventory = async () => {
    setDisabledBtn(false);
    setLoader(true);
    try {
      await constructorObjectService
        .finishInventory(id)
        .then((res) => dispatch(showAlert(res, "success")))
        .finally(() => getAllData());
    } catch (error) {
      console.error(error);
    }
  };

  const toggleSidebar = () => {
    setSidebarActive((prev) => !prev);
  };

  useEffect(() => {
    if (!tableInfo) return;
    if (id) getAllData();
    else getFields();
  }, [id, tableInfo]);
  if (loader) return <PageFallback />;

  const childrens = (
    <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
      <FormPageBackButton />
      <h2 className={styles.mainTextArea}>{selectedMenuItem?.title}</h2>
    </div>
  );
  return (
    <div className={styles.formPage}>
      <FiltersBlock children={childrens} hasBackground={true} />
      <div className={styles.formArea}>
        <MainInfo
          control={control}
          computedSections={computedSections}
          setFormValue={setFormValue}
          setBranchSend={setBranchSend}
          toggleSidebar={toggleSidebar}
          sideBarToggler={true}
          sidebarActive={sidebarActive}
          showButton={tableRelations?.length && id ? true : false}
          reset={reset}
          setDisabledBtn={setDisabledBtn}
        />
        <div className={styles.secondaryCardSide}>
          {id && (
            <RelationSection
              setCountItem={setCountItem}
              relations={tableRelations}
              supplier_nds={supplier_nds}
              responseData={responseData?.status && responseData?.status[0]}
              tableSlug={tableSlug}
              toggleSidebar={toggleSidebar}
              sideBarToggler={true}
              sidebarActive={sidebarActive}
            />
          )}
        </div>
      </div>

      <Footer
        extra={
          <>
            {tableSlug !== "inventory" && (
              <PermissionWrapButton
                tableSlug={tableSlug}
                status={watch("status")?.[0]}
                id={id}
              >
                <SecondaryButton
                  onClick={() => removeTab(pathname)}
                  color="error"
                >
                  Закрыть
                </SecondaryButton>
              </PermissionWrapButton>
            )}
            {id && tableSlug === "inventory" && (
              <>
                {/* <PrimaryButton
                  disabled={
                    watch("status")?.[0] === "done" ||
                    watch("status")?.[0] === "in_process"
                  }
                  onClick={postBeginInventory}
                  color="green"
                >
                  Начать инвентаризацию
                </PrimaryButton> */}
                <PrimaryButton
                  disabled={
                    watch("status")?.[0] === "done" ||
                    watch("status")?.[0] === "new"
                  }
                  onClick={postFinishInventory}
                  color="danger"
                >
                  Завершить инвентаризацию
                </PrimaryButton>
              </>
            )}

            <PermissionWrapperV2 tabelSlug={tableSlug} type="update">
              <FormCustomActionButton
                control={control?._formValues}
                tableSlug={tableSlug}
                id={id}
              />

              {countItem && sectionMap.get(tableSlug)?.text ? (
                tableSlug === "transfer_send" ? (
                  <CustomWrapperModal
                    onClick={() => sectionMap.get(tableSlug)?.func()}
                    title={`Вы уверены перемешать товары в ${branchSend?.[0]?.title}`}
                  >
                    <PrimaryButton disabled={disabledBtn} loader={btnLoader}>
                      {sectionMap.get(tableSlug)?.text}
                    </PrimaryButton>
                  </CustomWrapperModal>
                ) : (
                  <PrimaryButton
                    onClick={() => sectionMap.get(tableSlug)?.func()}
                    loader={btnLoader}
                    disabled={disabledBtn}
                  >
                    {sectionMap.get(tableSlug)?.text}
                  </PrimaryButton>
                )
              ) : (
                ""
              )}
              {location.pathname.includes("create") &&
              !id &&
              tableSlug === "inventory" ? (
                <PermissionWrapButton
                  tableSlug={tableSlug}
                  status={watch("status")?.[0]}
                  id={id}
                >
                  <PrimaryButton
                    loader={btnLoader}
                    onClick={handleSubmit(onSubmit)}
                  >
                    <Save />
                    Сохранить
                  </PrimaryButton>
                </PermissionWrapButton>
              ) : (
                ""
              )}
              {tableSlug !== "inventory" ? (
                <PermissionWrapButton
                  tableSlug={tableSlug}
                  status={watch("status")?.[0]}
                  id={id}
                >
                  <PrimaryButton
                    loader={btnLoader}
                    onClick={handleSubmit(onSubmit)}
                  >
                    <Save />
                    Сохранить
                  </PrimaryButton>
                </PermissionWrapButton>
              ) : (
                ""
              )}
            </PermissionWrapperV2>
          </>
        }
      />
    </div>
  );
};

export default ObjectsFormPage;
