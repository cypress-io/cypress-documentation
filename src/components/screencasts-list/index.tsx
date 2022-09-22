import React from "react";
import s from "./style.module.css";
import { ScreencastProps } from "./types";
// @ts-ignore
import screencastsJSON from "@site/src/data/screencasts.json";

export default function ScreencastsList(): ScreencastProps {
  return (
    <>
      <div>
        <article>
          <div className={s.container}>
            <ul>
              {screencastsJSON.small &&
                screencastsJSON.small.map((screencast, index) => (
                  <li key={index}>
                    <a
                       href={`${screencast.sourceUrl}`}
                       target="_blank"
                       rel="noopener noreferer"
                    >
                      {screencast.title}
                  </a>
                  </li>
                ))}
            </ul>
          </div>
          <div className={s.container}>
            {screencastsJSON.large.map((screencast, index) => (
            <div className={s.column} key={index}>
              <div>
                <a
                  href={
                    screencast.youtubeId
                      ? `https://www.youtube.com/watch?v=${screencast.youtubeId}`
                      : screencast.url
                  }
                  target="_blank"
                  rel="noopener noreferer"
                >
                  <h3 className={s.contentHeader}>{screencast.title}</h3>
                </a>
              </div>
              <div>
                {screencast.youtubeId && (
                  <iframe
                    src={`https://www.youtube.com/embed/${screencast.youtubeId}`}
                    frameBorder="0"
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                  ></iframe>
                )}

                {screencast.img && (
                  <a
                     href={screencast.sourceUrl}
                     target="_blank"
                     rel="noopener noreferer"
                  >
                    <img src={screencast.img} alt={`${screencast.title}`} />
                  </a>
                )}
              </div>
              <p>
                Published on <a
                  href={screencast.sourceUrl}
                  target="_blank"
                  rel="noopener noreferer"
                >
                  {screencast.sourceName}
                </a>{" "}
                by {screencast.author} <em>({screencast.date})</em>.
                {screencast.slides && (
                  <a
                    href={screencast.slides}
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
