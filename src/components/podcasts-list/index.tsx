import React from "react";
import s from "./style.module.css";
import { PodcastProps } from "./types";
// @ts-ignore
import podcastsJSON from "@site/src/data/podcasts.json";

export default function TalksList(): PodcastProps {
  return (
    <>
      <div>
        <article>
          {podcastsJSON.small &&
          <div className={s.container}>
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
          <div className="container">
            <div className="row">
              {podcastsJSON.large.map((podcast, index) => (
                <div key={index} className="col col--6 margin-bottom--xl">
                  <div>
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
                      ></iframe>
                    )}

                    {podcast.img && (
                      <a href={podcast.sourceUrl}
                         target="_blank"
                         rel="noopener noreferer"
                      >
                        <img src={podcast.img} alt={`${podcast.title}`} />
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
          </div>
        </article>
      </div>
    </>
  );
}
