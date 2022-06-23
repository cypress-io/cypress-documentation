import React from "react";
import s from "./style.module.css";
import { WebinarProps } from "./types";
// @ts-ignore
import webinarsJSON from "@site/src/data/webinars.json";

export default function WebinarsList(): WebinarProps {
  return (
    <>
      <div className="main-content-article-wrapper">
        <article className="main-content-article hide-scroll nuxt-content">
          <div className="mb-14">
            <ul>
              {webinarsJSON.small.map((webinar, index) => (
                <li key={index}>
                  <a href={`${webinar.sourceUrl}`}>{webinar.title}</a>
                </li>
              ))}
            </ul>
          </div>

          <div className="container">
            <div className="row">
              {webinarsJSON.large.map((webinar, index) => (
                <div key={index} className="col col--6 margin-bottom--xl">
                  <div className="relative mb-4 h-20">
                    <a
                      href={`https://youtube.com/watch?v=${webinar.youtubeId}`}
                      className="text-xl font-bold no-underline border-none absolute"
                    >
                      <h3>{webinar.title}</h3>
                    </a>
                  </div>

                  <div className="mt-4">
                    <iframe
                      src={`https://www.youtube.com/embed/${webinar.youtubeId}`}
                      frameBorder="0"
                      allow="autoplay; encrypted-media"
                      allowFullScreen
                    ></iframe>
                  </div>

                  <p className="mt-8 mb-8">
                    Published on <em>{webinar.date}</em>
                    <a href={webinar.sourceUrl}>{webinar.sourceName}</a> by{" "}
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
