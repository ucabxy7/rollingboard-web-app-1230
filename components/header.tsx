"use client";

import { useMemo, useState } from "react";
import Logo from "@/public/assets/logo.svg";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { Button } from "./shared/button";
import BurgerMenuIcon from "@/public/assets/burger-menu.svg";
import SideDrawer from "./shared/drawer";
import BlockIcon from "@/public/assets/block.svg";

const Header = () => {
  const t = useTranslations();
  const [isOpen, setIsOpen] = useState(false);
  const navigationLinks = useMemo(
    () => [
      {
        label: t("navigations.home"),
        href: "/",
      },
      {
        label: t("navigations.about"),
        href: "/about",
      },
    ],
    [t],
  );

  return (
    <header className="w-full flex justify-center items-center">
      <div className="hidden md:flex max-w-7xl flex-1 justify-between items-center py-2">
        <div className="flex items-center gap-2">
          <Logo className="size-7" />
          <span className="text-medium font-semibold text-whtie">
            {t("appname")}
          </span>
        </div>
        <ul className="flex items-center gap-10">
          {navigationLinks.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className={navigationLinksClasses}>
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex gap-4">
          <Button variant="ghost">{t("buttons.signIn")}</Button>
          <Button variant="outline">{t("buttons.signUp")}</Button>
        </div>
      </div>
      <div className="md:hidden flex justify-between items-center py-2 px-2 flex-1">
        <Logo className="size-7" />

        <SideDrawer
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          trigger={
            <Button variant="ghost">
              <BurgerMenuIcon className="size-5" />
            </Button>
          }
        >
          <div className="flex flex-1 h-full bg-dark-9 w-2xs p-4 relative">
            <button
              className="absolute top-4 right-4"
              onClick={() => setIsOpen(false)}
            >
              <BlockIcon className="size-6 text-whtie" />
            </button>
            <ul className="flex flex-col gap-4">
              {navigationLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    onClick={() => setIsOpen(false)}
                    href={link.href}
                    className={navigationLinksClasses}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </SideDrawer>
      </div>
    </header>
  );
};

const navigationLinksClasses =
  "text-medium font-semibold text-dark-2 hover:text-dark-0 transition-all";

export default Header;
