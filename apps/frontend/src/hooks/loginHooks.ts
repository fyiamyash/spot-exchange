import axios from "axios";

export const useLogin = () => {
  const logIn = async (username: string, password: string) => {
    const result = await axios.post("http://localhost:3000/login", {
      username,
      password,
    });
    return (await result).data;
  };

  return { logIn };
};
