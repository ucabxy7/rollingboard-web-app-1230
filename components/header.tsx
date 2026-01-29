"use client";

import { useMemo, useState, useEffect } from "react";
import Logo from "@/public/svgs/logo.svg";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { Button } from "./shared/button";
import BurgerMenuIcon from "@/public/svgs/burger-menu.svg";
import SideDrawer from "./shared/drawer";
import BlockIcon from "@/public/svgs/block.svg";
import { useRouter } from "next/navigation";
import { signOut } from "aws-amplify/auth";
import useUsersStore from "@/stores/users";
import { fetchCurrentUser } from "@/services/users";
import UpdateProfileDialog from "./updateProfileDialog";
import SideDrawerContent from "./sideDrawerContext";

const Header = () => {
  const t = useTranslations();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileDrawerOpen, setIsProfileDrawerOpen] = useState(false);

  const { user, setUser } = useUsersStore();

  useEffect(() => {
    fetchCurrentUser().then(setUser);
  }, [setUser]);

  const handleSignOut = async () => {
    await signOut();
    setUser(null);
    router.push("/auth/login");
  };

  const navigationLinks = useMemo(
    () =>
      user
        ? [
            {
              label: t("navigations.profile"),
              href: `#`,
              openDrawer: true,
            },
            {
              label: t("navigations.projects"),
              href: "/app",
            },
            {
              label: t("navigations.home"),
              href: "/",
            },
            {
              label: t("navigations.about"),
              href: "/about",
            },
          ]
        : [
            {
              label: t("navigations.home"),
              href: "/",
            },
            {
              label: t("navigations.about"),
              href: "/about",
            },
          ],
    [t, user],
  );
  // for sideDrawer, close action:1 'x'icon 2.'sign out' 3. any link
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
            <li key={`${link.href}-${link.label}`}>
              {link.openDrawer ? (
                <SideDrawer
                  isOpen={isProfileDrawerOpen}
                  setIsOpen={setIsProfileDrawerOpen}
                  trigger={
                    <p className={navigationLinksClasses}> {link.label}</p>
                  }
                >
                  <div className="bg-dark-9 h-full">
                    <SideDrawerContent />
                  </div>
                </SideDrawer>
              ) : (
                <Link href={link.href} className={navigationLinksClasses}>
                  {link.label}
                </Link>
              )}
            </li>
          ))}
        </ul>
        <div className="flex gap-4">
          {user ? (
            <>
              <Button variant="ghost" onClick={handleSignOut}>
                {t("buttons.signOut")}
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                onClick={() => router.push("/auth/login")}
              >
                {t("buttons.signIn")}
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push("/auth/signup")}
              >
                {t("buttons.signUp")}
              </Button>
            </>
          )}
        </div>
      </div>
      {/* Mobile Header */}
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
                  {link.openDrawer ? (
                    <Button
                      className={navigationLinksClasses}
                      onClick={() => {
                        setIsOpen(false); // 关闭菜单
                        setIsProfileDrawerOpen(true); // 打开 profile drawer
                      }}
                    >
                      {link.label}
                    </Button>
                  ) : (
                    <Link
                      onClick={() => setIsOpen(false)}
                      href={link.href}
                      className={navigationLinksClasses}
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </SideDrawer>
        <UpdateProfileDialog />
      </div>
    </header>
  );
};

const navigationLinksClasses =
  "text-medium font-semibold text-dark-2 hover:text-dark-0 transition-all";

export default Header;
