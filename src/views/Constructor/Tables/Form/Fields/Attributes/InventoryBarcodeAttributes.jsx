import styles from "./style.module.scss"
import HFTextField from "../../../../../../components/FormElements/HFTextField"
import FRow from "../../../../../../components/FormElements/FRow"

const InventoryBarcodeAttributes = ({ control }) => {
  return (
    <>
      <div className={styles.settingsBlockHeader}>
          <h2>Settings</h2>
      </div>
      <div className="p-2">
        <FRow label="Request url">
          <HFTextField
            name="attributes.request_url"
            control={control}
            fullWidth
          />
        </FRow>
        <FRow label="Updated table slug">
          <HFTextField
            name="attributes.updated_table_slug"
            control={control}
            fullWidth
          />
        </FRow>
      </div>
    </>

  )
}

export default InventoryBarcodeAttributes