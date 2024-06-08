import { useMemo } from "react";
import { useParams } from "react-router-dom";

import FormElementGenerator from "../../components/ElementGenerators/FormElementGenerator";
import FormCard from "./components/FormCard";
import styles from "./style.module.scss";
import KeyboardTabIcon from "@mui/icons-material/KeyboardTab";

const MainInfo = ({
  computedSections,
  control,
  setFormValue,
  setBranchSend,
  sidebarActive,
  toggleSidebar,
  sideBarToggler,
  showButton,
  reset,
  setDisabledBtn
}) => {
  const { tableSlug } = useParams();

  const fieldsList = useMemo(() => {
    const fields = [];

    computedSections?.forEach((section) => {
      section.fields?.forEach((field) => {
        fields.push(field);
      });
    });
    return fields;
  }, [computedSections]);

  const ExtraButton = function () {
    return (
      <button className="sidebarButton active" onClick={() => toggleSidebar()}>
        <KeyboardTabIcon style={{ transform: "rotate(180deg)" }} />
      </button>
    );
  };

  return (
    <div
      className={`${styles.mainCardSide} ${sidebarActive ? styles.active : ""}`}
    >
      {computedSections.map((section) => (
        <>
          {section.fields?.length ? (
            <div>
              <FormCard
                key={section.id}
                title={section.label}
                className={styles.formCard}
                icon={section.icon}
                toggleSidebar={toggleSidebar}
              >
                <div className={styles.formColumn}>
                  {section.fields?.map((field) => (
                    <FormElementGenerator
                      key={field.id}
                      field={field}
                      control={control}
                      setFormValue={setFormValue}
                      fieldsList={fieldsList}
                      formTableSlug={tableSlug}
                      setBranchSend={setBranchSend}
                      reset={reset}
                      setDisabledBtn={setDisabledBtn}
                    />
                  ))}
                </div>
              </FormCard>
              {sidebarActive && showButton ? <ExtraButton /> : ""}
            </div>
          ) : (
            ""
          )}
        </>
      ))}
    </div>
  );
};

export default MainInfo;
