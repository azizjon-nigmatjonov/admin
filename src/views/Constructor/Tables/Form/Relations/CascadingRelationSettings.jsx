import { Delete } from "@mui/icons-material";
import { useFieldArray } from "react-hook-form";
import { useQuery } from "react-query";
import cascadingService from "../../../../../services/cascadingService";
import styles from "./style.module.scss";
import Menu from "@mui/material/Menu";
import { useMemo, useState } from "react";
import CascadingRecursiveBlock from "./CascadingRecursiveBlock";

const CascadingRelationSettings = ({
  control,
  watch,
  slug,
  setValue,
  field_slug,
}) => {
  const [relations, setRelation] = useState();
  const cascading = watch("cascading");

  // const { fields, append, remove } = useFieldArray({
  //   control,
  //   name: "auto_filters",
  // });

  const [menu, setMenu] = useState(null);
  const open = Boolean(menu);
  const handleClick = (e) => {
    setMenu(e.currentTarget);

    cascadingService
      .getList({
        table_slug: slug,
      })
      .then((res) => {
        setRelation(res?.data?.cascadings);
      });

    setValue("cascading", [{ label: slug, field_slug: field_slug }]);
  };
  const handleClose = () => {
    setMenu(null);
  };

  const cascadingValue = useMemo(() => {
    let value = "";
    if (cascading?.length === 3) {
      return (value = `${cascading[1]?.label} => ${cascading[2]?.label}`);
    } else {
      return "";
    }
  }, [cascading]);
  return (
    <>
      <div className={styles.settingsBlockHeader}>
        <h2>Cascading</h2>
      </div>
      <div className="p-2">
        <span onClick={handleClick}>
          <input
            type="text"
            disabled
            value={cascadingValue && cascadingValue}
            className={styles.cascading_input}
            placeholder="value"
            control={control}
          />
        </span>
        <Menu anchorEl={menu} open={open} onClose={handleClose}>
          <div className={styles.cascading_collapse}>
            <CascadingRecursiveBlock
              fields={relations}
              cascading={cascading}
              setValue={setValue}
              handleClose={handleClose}
            />
          </div>
        </Menu>
      </div>
    </>
  );
};

export default CascadingRelationSettings;
