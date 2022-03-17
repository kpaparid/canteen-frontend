import Image from "next/image";
import React from "react";

export default function Header() {
  return (
    <header>
      <Image
        src="https://res.cloudinary.com/duvwxquad/image/upload/v1647394901/cantine/cover_e4e5u3.jpg"
        alt=""
        width={2000}
        height={450}
        objectFit="cover"
      />
    </header>
  );
}
