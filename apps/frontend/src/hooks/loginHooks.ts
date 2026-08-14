import axios from "axios";
import { envCustom } from "./envCustom";

export const useLogin = () => {
  const logIn = async (username: string, password: string) => {
    const result = await axios.post(`${envCustom.axios_prefix}/login`, {
      username,
      password,
    });
    return (await result).data;
  };

  return { logIn };
};
