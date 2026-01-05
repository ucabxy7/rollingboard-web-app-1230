import { mergeTwClasses } from "@/utils/styles/tailwindCss";
import React from "react";
import Logo from "@/public/assets/logo.svg";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

interface FooterProps {
  contentClassName?: string;
}

const Footer: React.FC<FooterProps> = async ({ contentClassName }) => {
  const t = await getTranslations();

  const contentWrapper = mergeTwClasses(
    `py-5 w-full flex flex-col gap-1 items-center max-w-7xl`,
    contentClassName ?? "",
  );

  return (
    <footer className="flex flex-1 justify-center items-center w-full">
      <div className={contentWrapper}>
        <div className="flex flex-1 w-full flex-col px-1 items-center md:flex-row justify-center md:justify-between">
          <Logo
            className="w-7.5 aspect-1.5"
            aria-label="The Rolling Board Logo"
          />
          <li className="flex gap-4">
            {/* TODO: Tweak routes after pages implementation */}
            <Link className={navigationTextClasses} href="/">
              {t("navigations.home")}
            </Link>
            <Link className={navigationTextClasses} href="/about">
              {t("navigations.about")}
            </Link>
          </li>
        </div>
        <p className="text-dark-3 text-x-small">{t("copyright")}</p>
      </div>
    </footer>
  );
};

export default Footer;

const navigationTextClasses = `
  text-small 
  font-semibold 
  text-dark-2
  hover:text-dark-1
  `;
