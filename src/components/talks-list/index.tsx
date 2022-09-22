import React from "react";
import { TalksProps } from "./types";
// @ts-ignore
import talksJSON from "@site/src/data/talks.json";

export default function TalksList(): TalksProps {
  return (
    <>
      <div>
        <article>
          {talksJSON.small &&
          <div>
            <ul>
              {talksJSON.small.map((talk, index) => (
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
          </div>}
          <div className="mediaGridContainer">
              {talksJSON.large.map((talk, index) => (
                <div className="mediaColumn" key={index}>
                  <div className="mediaTitleContainer">
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
        </article>
      </div>
    </>
  );
}
