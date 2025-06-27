import Image from "next/image";
import logodarkImage from "./logo-dark.png";
export const LogoDark = () => {
  return (
    <Image
      src={logodarkImage}
      alt="BlogApp"
      width={100}
      height={100}
      className="size-auto"
    />
  );
};

export const LogoLight = () => {
  return (
    <Image
      src={"./logo-light.png"}
      alt="MakeMyScan"
      width={200}
      height={200}
      className="size-auto"
    />
  );
};
