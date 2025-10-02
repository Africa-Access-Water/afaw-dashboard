

import Logo from "/src/assets/images/logos/afaw-logo-black.png"
import { Link } from "react-router";
const FullLogo = () => {
  return (
    <Link to={"/"}>
      <img
        src={Logo}
        alt="logo"
        className="block"
        width={40}
        height={40}
      />
    </Link>
  );
};

export default FullLogo;
