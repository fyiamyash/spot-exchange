interface ButtonForLandingPageProps {
  title: string;
  colour: "light" | "dark";
  onclickAction: () => void;
}

export const ButtonForLandingPage = ({
  title,
  colour,
  onclickAction,
}: ButtonForLandingPageProps) => {
  return (
    <button
      onClick={onclickAction}
      className={`
        h-8
        px-3
        rounded-full
        text-md
        font-normal
        cursor-pointer
        transition-colors
        duration-200
        ${
          colour === "light"
            ? "bg-neutral-100 text-black hover:bg-neutral-200"
            : "bg-black text-white hover:bg-neutral-800"
        }
      `}
    >
      {title}
    </button>
  );
};
