import React from "react";
import { PodcastProps } from "./types";
// @ts-ignore
import podcastsJSON from "@site/src/data/podcasts.json";

export default function TalksList(): PodcastProps {
  return (
    <>
      <div>
        <article>
          {podcastsJSON.small &&
          <div>
            <ul>
              {podcastsJSON.small.map((podcast, index) => (
                  <li key={index}>
                    <a
                       href={`${podcast.sourceUrl}`}
                       target="_blank"
                       rel="noopener noreferer"
                    >
                      {podcast.title}
                    </a>
                  </li>
                ))}
            </ul>
          </div>}
          <div className="mediaGridContainer">
              {podcastsJSON.large.map((podcast, index) => (
                <div className="mediaColumn" key={index}>
                  <div className="mediaTitleContainer">
                    <a
                      href={
                        podcast.youtubeId
                          ? `https://www.youtube.com/watch?v=${podcast.youtubeId}`
                          : podcast.url
                      }
                      target="_blank"
                      rel="noopener noreferer"
                    >
                      <h3>{podcast.title}</h3>
                    </a>
                  </div>

                  <div>
                    {podcast.youtubeId && (
                      <iframe
                        src={`https://www.youtube.com/embed/${podcast.youtubeId}`}
                        frameBorder="0"
                        allow="autoplay; encrypted-media"
                        allowFullScreen
                        className="mediaImage"
                      ></iframe>
                    )}

                    {podcast.img && (
                      <a href={podcast.sourceUrl}
                         target="_blank"
                         rel="noopener noreferer"
                      >
                        <img className="mediaImage" src={podcast.img} alt={`${podcast.title}`} />
                      </a>
                    )}
                  </div>

                  <p>
                    Published on <a
                      href={podcast.sourceUrl}
                      target="_blank"
                      rel="noopener noreferer"
                      >
                        {podcast.sourceName}
                      </a>{" "}
                    by {podcast.author} <em>({podcast.date})</em>.
                    {podcast.slides && (
                      <a
                        href={podcast.slides}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {" "}
                        Slides.
                      </a>
                    )}
                  </p>
                </div>
              ))}
          </div>
        </article>
      </div>
    </>
  );
}
