import React from "react";
import s from "./style.module.css";
import { TalksProps } from "./types";
// @ts-ignore
import talksJSON from "@site/src/data/talks.json";

export default function TalksList(): TalksProps {
  return (
    <>
      <div className="main-content-article-wrapper">
        <article className="main-content-article hide-scroll nuxt-content">
          <div className="mb-14">
            <ul>
              {talksJSON.small &&
                talksJSON.small.map((talk, index) => (
                  <li key={index}>
                    <a href={`${talk.sourceUrl}`}>{talk.title}</a>
                  </li>
                ))}
            </ul>
          </div>

          <div className="container">
            <div className="row">
              {talksJSON.large.map((talk, index) => (
                <div key={index} className="col col--6 margin-bottom--xl">
                  <div className="relative mb-4 h-20">
                    <a
                      href={
                        talk.youtubeId
                          ? `https://www.youtube.com/watch?v=${talk.youtubeId}`
                          : talk.url
                      }
                      className="text-xl font-bold no-underline border-none absolute"
                    >
                      <h3>{talk.title}</h3>
                    </a>
                  </div>

                  <div className="mt-4">
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

                  <p className="mt-8 mb-8">
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
          </div>
        </article>
      </div>
    </>
  );
}
