import { COMPANY_DATA_TYPE } from "../../constants/companyData";

export type useCompanyDataState = {
  companyData: COMPANY_DATA_TYPE
  setCompanyData: React.Dispatch<COMPANY_DATA_TYPE>
}