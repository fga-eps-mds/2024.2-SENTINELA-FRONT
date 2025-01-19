import axios from "axios";
import { getToken } from "../Functions/loader";

const baseBenefitsURL =
  import.meta.env.VITE_BENEFIT_DB_URL || "http://localhost:3003/";
const baseBankURL =
  import.meta.env.VITE_BANK_DB_URL || "http://localhost:3002/";
const baseUserURL =
  import.meta.env.VITE_USER_DB_URL || "http://localhost:3001/";

const APIUsers = axios.create({
  baseURL: baseUserURL,
  headers: {
    Authorization: `Bearer ${getToken()}`,
  },
});

const APIBank = axios.create({
  baseURL: baseBankURL,
  headers: {
    Authorization: `Bearer ${getToken()}`,
  },
});

const APIBenefits = axios.create({
  baseURL: baseBenefitsURL,
  headers: {
    Authorization: `Bearer ${getToken()}`,
  },
});

export { APIUsers, APIBank, APIBenefits };
