import React from "react";
import { WebinarProps } from "./types";
// @ts-ignore
import webinarsJSON from "@site/src/data/webinars.json";

export default function WebinarsList(): WebinarProps {
  return (
    <>
      <div>
        <article>
          {webinarsJSON.small &&
          <div className="mediaListContainer">
            <ul>
              {webinarsJSON.small.map((webinar, index) => (
                <li key={index}>
                  <a
                      href={`${webinar.sourceUrl}`}
                      target="_blank"
                      rel="noopener noreferer"
                  >
                    {webinar.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>}
          <div className="mediaGridContainer">
              {webinarsJSON.large.map((webinar, index) => (
                <div className="mediaColumn" key={index}>
                  <div className="mediaTitleContainer">
                    <a
                      href={`https://youtube.com/watch?v=${webinar.youtubeId}`}
                      target="_blank"
                      rel="noopener noreferer"
                    >
                      <h3>{webinar.title}</h3>
                    </a>
                  </div>

                  <div>
                    <iframe
                      src={`https://www.youtube.com/embed/${webinar.youtubeId}`}
                      frameBorder="0"
                      allow="autoplay; encrypted-media"
                      allowFullScreen
                    ></iframe>
                  </div>

                  <p>
                    Published on <em>{webinar.date}</em>
                    <a
                       href={webinar.sourceUrl}
                       target="_blank"
                       rel="noopener noreferer"
                    >
                      {webinar.sourceName}
                    </a> by{" "}
                    {webinar.author}
                  </p>
                </div>
              ))}
          </div>
        </article>
      </div>
    </>
  );
}
