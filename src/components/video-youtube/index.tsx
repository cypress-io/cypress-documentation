import React from "react";
import Head from "@docusaurus/Head";
import videoData from "@site/src/data/youtube-videos.json";
import { VideoYouTubeProps } from "./types";
import {
  VideoData,
  buildVideoObject,
  extractYouTubeId,
  serializeJsonLd,
} from "./structured-data";

export default function VideoYouTube({ src, title }: VideoYouTubeProps) {
  const id = extractYouTubeId(src);
  // Fails the build (and shows in the dev server) rather than shipping an
  // embed that won't play.
  if (!id) {
    throw new Error(
      `Invalid YouTube <DocsVideo> src "${src}". Use https://www.youtube.com/embed/<id> ` +
        "or https://youtube.com/embed/<id>, where <id> is the 11-character ID " +
        "from the watch URL (youtube.com/watch?v=<id>)."
    );
  }

  const { videoObject, missing } = buildVideoObject(
    id,
    src,
    title,
    (videoData as Record<string, VideoData>)[id]
  );
  // Warn during the static build only, never in a visitor's browser.
  if (missing && typeof window === "undefined") {
    console.warn(
      `[video-structured-data] Skipped VideoObject for ${src}: missing ${missing.join(", ")}.`
    );
  }

  return (
    <>
      {videoObject && (
        <Head>
          <script type="application/ld+json">
            {serializeJsonLd(videoObject)}
          </script>
        </Head>
      )}
      <div className="embedContainer">
        <iframe
          src={src}
          title={title}
          allowFullScreen
        >
        </iframe>
      </div>
    </>
  );
}
