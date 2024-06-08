import ExcelDownloadButton from "./ExcelDownloadButton";
import ExcelUploadButton from "./ExcelUploadButton";

const ExcelButtons = ({ fieldsMap,filters={} }) => {
  return ( <>
    <ExcelUploadButton  fieldsMap={fieldsMap} />
    <ExcelDownloadButton filters={filters} />
  </>);
}
 
export default ExcelButtons;