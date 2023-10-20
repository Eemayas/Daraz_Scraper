import Image from "next/image";
import Link from "next/link";
import React from "react";

const navIcons = [
  { src: "/assets/icons/search.svg", alt: "Search" },
  { src: "/assets/icons/black-heart.svg", alt: "Heart" },
  { src: "/assets/icons/user.svg", alt: "User" },
];

const Navbar = () => {
  return (
    <header className="w-full ">
      <nav className="nav">
        <Link href={"/"} className="flex items-center gap-1">
          <Image
            src={"/assets/icons/logo.svg"}
            alt="logo"
            width={27}
            height={27}
          ></Image>
          <p className="nav-logo">
            Price<span className="text-primary">Wise</span>
          </p>
        </Link>
        <div className=" flex items-center gap-5">
          {navIcons.map((icons) => (
            <Image
              key={icons.alt}
              src={icons.src}
              alt={icons.alt}
              width={28}
              height={27}
              className="object-contain"
            />
          ))}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
