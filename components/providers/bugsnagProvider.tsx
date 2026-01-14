"use client";

import React from "react";
import Bugsnag from "@bugsnag/js";
import BugsnagPluginReact from "@bugsnag/plugin-react";
import BugsnagPerformance from "@bugsnag/browser-performance";

const bugsnagPlugin = new BugsnagPluginReact();
Bugsnag.start({
  apiKey: process.env.NEXT_PUBLIC_BUGSNAG_API_KEY,
  plugins: [bugsnagPlugin],
});
BugsnagPerformance.start({ apiKey: process.env.NEXT_PUBLIC_BUGSNAG_API_KEY });

const ErrorBoundary =
  Bugsnag.getPlugin("react")!.createErrorBoundary(React) ?? React.Fragment;

const BugsnagProvider = ({ children }: { children: React.ReactNode }) => (
  <ErrorBoundary>{children}</ErrorBoundary>
);

export default BugsnagProvider;
