import { isEqual } from "lodash";
import Image from "next/image";
import React, { memo } from "react";

const Header = memo(() => {
  return (
    <header>
      <Image
        src="https://res.cloudinary.com/duvwxquad/image/upload/v1647394901/cantine/cover_e4e5u3.jpg"
        alt=""
        width={4000}
        height={1000}
        objectFit="cover"
      />
      <div className="my-3 welcome-banner">
        <div>Willkommen bei</div>
        <div className="border-bottom border-primary"></div>
        <div className="title">Cantine Status</div>
      </div>
    </header>
  );
}, isEqual);

export default Header;
