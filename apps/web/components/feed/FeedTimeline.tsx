"use client";

import type { Post } from "@fisgou/shared";
import { FeedAutoReload } from "./FeedAutoReload";

export function FeedTimeline({
  initialPosts,
}: {
  initialPosts: Post[];
}) {
  return (
    <FeedAutoReload initialPosts={initialPosts} refreshMs={10000} />
  );
}

