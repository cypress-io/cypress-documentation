import React from "react";
import s from "./style.module.css";
import { PluginProps } from "./types";
import Badge from "@site/src/components/badge";
// @ts-ignore
import coursesJSON from "@site/src/data/courses.json";

export default function CoursesList() {
  return (
    <>
      <div className="main-content-article-wrapper">
        <article className="main-content-article">
          <p>
            Online courses from that teach end-to-end testing with Cypress over
            multiple videos. <strong>Note:</strong> Some of the courses require
            payment from their website.
          </p>
          <ul>
            {coursesJSON.courses.map((course, index) => (
              <li key={index}>
                <a href={`${course.url}`} target="_blank" className={s.title}>
                  {course.title}
                </a>

                <p className={s.course_list_item}>
                  Published on{" "}
                  <a href={`${course.sourceUrl}`}>{course.sourceName}</a> by{" "}
                  {course.authorTwitter && (
                    <a
                      href={`https://twitter.com/${course.authorTwitter}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {course.author}
                    </a>
                  )}
                  {course.authorTwitter ? "" : course.author}{" "}
                  {course.language && <em>, Language: {course.language}</em>}{" "}
                  {course.free && <Badge type="info">Free</Badge>}
                </p>
              </li>
            ))}
          </ul>
        </article>
      </div>
    </>
  );
}
