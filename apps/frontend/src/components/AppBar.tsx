import { logInToggle, signInToggle } from "../store/buttonStore";
import { ButtonForLandingPage } from "./ButtonForLandingPage";

export const AppBar = () => {
  const setLogInOpen = logInToggle((state) => state.setIsOpen);
  const setSignInOpen = signInToggle((state) => state.setIsOpen);

  return (
    <div className="w-full h-14 flex justify-end items-center gap-3 px-8  bg-neutral-100">
      <ButtonForLandingPage
        title="Log in"
        colour="light"
        onclickAction={setLogInOpen}
      />
      <ButtonForLandingPage
        title="Sign up"
        colour="dark"
        onclickAction={setSignInOpen}
      />
    </div>
  );
};
