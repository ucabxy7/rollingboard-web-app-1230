"use client";

import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/table";
import type { Selection } from "@heroui/table";
import { Button } from "./shared/button";
import { Input } from "./shared/input";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useImperativeHandle, useState } from "react";
import { Membership } from "@/models/memberships";
import {
  addProjectMember,
  fetchProjectMemberships,
  removeProjectMember,
} from "@/services/projects";
import { fetchUsersByQuery } from "@/services/users";
import useUsersStore from "@/stores/users";
import type { User } from "@/models/users";
import { mergeTwClasses } from "@/utils/styles/tailwindCss";

export interface MembersDialogRef {
  open: (tab?: "view" | "add") => void;
  close: () => void;
}

type MembersDialogProps = {
  ref: React.RefObject<MembersDialogRef | null>;
  projectId: string;
};

const DEBOUNCE_MS = 400;

const MembersDialog = ({ ref, projectId }: MembersDialogProps) => {
  const t = useTranslations();
  const { user: currentUser } = useUsersStore();

  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"view" | "add">("view");

  const [memberships, setMemberships] = useState<Membership[]>([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [selectedUserIds, setSelectedUserIds] = useState<Selection>(
    new Set([]),
  );
  const [disabledUserIds, setDisabledUserIds] = useState<string[]>([]);

  const loadMemberships = useCallback(async () => {
    const data = await fetchProjectMemberships(projectId);
    setMemberships(data);
    setDisabledUserIds(data.map((membership) => membership.userId));
  }, [projectId]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm.trim());
    }, DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    const run = async () => {
      const users: User[] = await fetchUsersByQuery(debouncedSearch);
      setFilteredUsers(users);
    };
    run();
  }, [debouncedSearch]);

  const handleRemove = async (membership: Membership) => {
    if (membership.userId === currentUser?.id) return;
    await removeProjectMember(membership.id);
    await loadMemberships();
  };

  const handleAddSelected = async () => {
    try {
      const userIds =
        selectedUserIds === "all"
          ? filteredUsers.map((u) => u.id)
          : (Array.from(selectedUserIds) as string[]);
      if (userIds.length === 0) return;

      await addProjectMember(projectId, userIds);
      await loadMemberships();
      setSearchTerm("");
      setDebouncedSearch("");
      setSelectedUserIds(new Set([]));
      setActiveTab("view");
    } catch (error) {
      // TODO: Bugsnag notify error
      console.error(error);
    }
  };

  useImperativeHandle(
    ref,
    () => ({
      open: (tab = "view") => {
        setActiveTab(tab);
        setIsOpen(true);
        loadMemberships();
      },
      close: () => setIsOpen(false),
    }),
    [loadMemberships],
  );

  const viewTab = (
    <Table
      aria-label="Project members table"
      classNames={{
        wrapper:
          "bg-transparent border border-white/10 rounded-lg overflow-hidden",
        th: "bg-dark-8 text-white text-small font-semibold border-b border-white/10",
        td: "text-gray-2 text-medium border-b border-white/5",
        tr: "hover:bg-dark-8 transition-colors",
      }}
    >
      <TableHeader>
        <TableColumn>{t("viewMembersDialog.name")}</TableColumn>
        <TableColumn>{t("viewMembersDialog.email")}</TableColumn>
        <TableColumn>{t("viewMembersDialog.actions") ?? "Actions"}</TableColumn>
      </TableHeader>
      <TableBody emptyContent={t("viewMembersDialog.noMembers")}>
        {memberships.map((member) => (
          <TableRow key={member.userId}>
            <TableCell>{member.user.username}</TableCell>
            <TableCell>{member.user.email}</TableCell>
            <TableCell>
              <Button
                variant="ghost"
                disabled={member.userId === currentUser?.id}
                onClick={() => handleRemove(member)}
                className="text-red-5 disabled:text-gray-6"
              >
                {t("viewMembersDialog.remove")}
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  const addTab = (
    <>
      <div className="mb-4">
        <Input
          id="search"
          type="text"
          placeholder={t("addMembersDialog.searchPlaceholder")}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <Table
        aria-label="Available users table"
        selectionMode="multiple"
        onSelectionChange={(keys) => setSelectedUserIds(keys)}
        selectedKeys={selectedUserIds}
        classNames={{
          wrapper:
            "bg-transparent border border-white/10 rounded-lg overflow-hidden",
          th: "bg-dark-8 text-white text-small font-semibold border-b border-white/10",
          td: "text-gray-2 text-medium border-b border-white/5",
          tr: "hover:bg-dark-8 transition-colors cursor-pointer",
          emptyWrapper: mergeTwClasses(
            "text-white font-semibold",
            searchTerm === "" ? "hidden" : "",
          ),
        }}
        disabledKeys={disabledUserIds}
      >
        <TableHeader>
          <TableColumn>{t("addMembersDialog.name")}</TableColumn>
          <TableColumn>{t("addMembersDialog.email")}</TableColumn>
          <TableColumn>{t("addMembersDialog.status")}</TableColumn>
        </TableHeader>
        <TableBody emptyContent={t("addMembersDialog.noUsersFound")}>
          {filteredUsers.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.username}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                {disabledUserIds.includes(user.id)
                  ? t("addMembersDialog.member")
                  : t("addMembersDialog.notMember")}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="mt-4 flex justify-end gap-3">
        <Button
          variant="ghost"
          onClick={() => {
            setIsOpen(false);
            setSearchTerm("");
            setDebouncedSearch("");
            setSelectedUserIds(new Set([]));
          }}
        >
          {t("addMembersDialog.cancel")}
        </Button>
        <Button onClick={handleAddSelected}>
          {t("addMembersDialog.addSelected")}
        </Button>
      </div>
    </>
  );

  const tabs = [
    { key: "view" as const, label: t("viewMembersDialog.view") },
    { key: "add" as const, label: t("addMembersDialog.add") },
  ];

  return (
    <Dialog
      open={isOpen}
      onClose={() => setIsOpen(false)}
      className="relative z-10"
    >
      <DialogBackdrop className="fixed inset-0 bg-black/40" />
      <div className="fixed inset-0 z-10 flex items-center justify-center p-4">
        <DialogPanel className="w-full max-w-4xl rounded-xl bg-dark-9 p-6 border border-white/10 shadow-xl">
          <DialogTitle className="text-h4 font-bold text-white mb-4">
            {t("viewMembersDialog.title")}
          </DialogTitle>

          <div className="mb-4 flex gap-2">
            {tabs.map((tab) => (
              <Button
                key={tab.key}
                variant={activeTab === tab.key ? "default" : "ghost"}
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.label}
              </Button>
            ))}
          </div>

          <div className="space-y-4">
            {activeTab === "view" ? viewTab : addTab}
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default MembersDialog;
