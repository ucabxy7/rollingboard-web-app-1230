"use client";

import Bugsnag from "@bugsnag/js";
import { useEffect } from "react";

export default function Error({ error }: { error: Error; reset: () => void }) {
  useEffect(() => {
    Bugsnag.notify(error);
  }, [error]);
  return <div>Error: {error.message}</div>;
}
