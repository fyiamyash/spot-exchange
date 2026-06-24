import axios from "axios";

export const userSignIn = () => {
  const signIn = async (username: string, password: string) => {
    const response = axios.post(
      "http://localhost:3000/signup",
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
