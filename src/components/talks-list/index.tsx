import React from "react";
import s from "./style.module.css";
import { TalksProps } from "./types";
// @ts-ignore
import talksJSON from "@site/src/data/talks.json";

export default function TalksList(): TalksProps {
  return (
    <>
      <div>
        <article>
          <div>
            <ul>
              {talksJSON.small &&
                talksJSON.small.map((talk, index) => (
                  <li key={index}>
                    <a
                       href={`${talk.sourceUrl}`}
                       target="_blank"
                       rel="noopener noreferer"
                    >
                      {talk.title}
                    </a>
                  </li>
                ))}
            </ul>
          </div>

          <div className="container">
            <div className="row">
              {talksJSON.large.map((talk, index) => (
                <div key={index} className="col col--6 margin-bottom--xl">
                  <div>
                    <a
                      href={
                        talk.youtubeId
                          ? `https://www.youtube.com/watch?v=${talk.youtubeId}`
                          : talk.url
                      }
                      target="_blank"
                      rel="noopener noreferer"
                    >
                      <h3>{talk.title}</h3>
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
                      <a
                         href={talk.sourceUrl}
                         target="_blank"
                         rel="noopener noreferer"
                      >
                        <img src={talk.img} alt={`${talk.title}`} />
                      </a>
                    )}
                  </div>

                  <p>
                    Published on <a
                      href={talk.sourceUrl}
                      target="_blank"
                      rel="noopener noreferer"
                    >
                      {talk.sourceName}
                    </a>{" "}
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
