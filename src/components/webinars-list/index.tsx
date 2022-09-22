import React from "react";
import s from "./style.module.css";
import { WebinarProps } from "./types";
// @ts-ignore
import webinarsJSON from "@site/src/data/webinars.json";

export default function WebinarsList(): WebinarProps {
  return (
    <>
      <div>
        <article>
          <div>
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
          </div>

          <div className="container">
            <div className="row">
              {webinarsJSON.large.map((webinar, index) => (
                <div key={index} className="col col--6 margin-bottom--xl">
                  <div>
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
          </div>
        </article>
      </div>
    </>
  );
}
