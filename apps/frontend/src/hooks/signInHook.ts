import axios from "axios";
import { envCustom } from "./envCustom";

export const userSignIn = () => {
  const signIn = async (username: string, password: string) => {
    const response = axios.post(
      `${envCustom.axios_prefix}/signup`,
      {
        username,
        password,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    return (await response).data;
  };
  return { signIn };
};
