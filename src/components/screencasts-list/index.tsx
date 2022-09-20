import React from "react";
import s from "./style.module.css";
import { ScreencastProps } from "./types";
// @ts-ignore
import screencastsJSON from "@site/src/data/screencasts.json";

export default function ScreencastsList(): ScreencastProps {
  return (
    <>
      <div className="main-content-article-wrapper">
        <article>
          <div className={s.container}>
            <ul>
              {screencastsJSON.small &&
                screencastsJSON.small.map((talk, index) => (
                  <li key={index}>
                    <a href={`${talk.sourceUrl}`}>{talk.title}</a>
                  </li>
                ))}
            </ul>
          </div>
          <div className={s.container}>
            {screencastsJSON.large.map((talk, index) => (
            <div className={s.column} key={index}>
              <div>
                <a
                  href={
                    talk.youtubeId
                      ? `https://www.youtube.com/watch?v=${talk.youtubeId}`
                      : talk.url
                  }
                >
                  <h3 className={s.contentHeader}>{talk.title}</h3>
                </a>
              </div>
              <div>
                {talk.youtubeId && (
                  <iframe
                    src={`https://www.youtube.com/embed/${talk.youtubeId}`}
                    frameBorder="0"
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                  ></iframe>
                )}

                {talk.img && (
                  <a href={talk.sourceUrl}>
                    <img src={talk.img} alt={`${talk.title}`} />
                  </a>
                )}
              </div>
              <p>
                Published on <a href={talk.sourceUrl}>{talk.sourceName}</a>{" "}
                by {talk.author} <em>({talk.date})</em>.
                {talk.slides && (
                  <a
                    href={talk.slides}
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
