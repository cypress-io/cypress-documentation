import React from "react";
import { BlogsProps } from "./types";
// @ts-ignore
import blogsJSON from "@site/src/data/blogs.json";

export default function blogsList(): BlogsProps {
  return (
    <>
      <div>
        <article>
          {blogsJSON.small &&
          <div>
            <ul>
              {blogsJSON.small.map((blog, index) => (
                <li key={index}>
                  <a
                    href={`${blog.sourceUrl}`}
                    target="_blank"
                    rel="noopener noreferer"
                  >
                    {blog.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>}
          <div className="mediaGridContainer">
              {blogsJSON.large.map((blog, index) => (
                <div key={index} className="mediaColumn">
                  <div className="mediaTitleContainer">
                    <a
                       href={blog.sourceUrl}
                       target="_blank"
                       rel="noopener noreferer"
                    >
                      <h3>{blog.title}</h3>
                    </a>
                  </div>
                  <a
                     href={blog.sourceUrl}
                     target="_blank"
                     rel="noopener noreferer"
                  >
                  {blog.img ? <img className="mediaImage" src={blog.img} alt={`${blog.title}`} /> : null}
                  </a>
                  <p>
                    Published on <a
                      href={blog.sourceUrl}
                      target="_blank"
                      rel="noopener noreferer"
                    >
                      {blog.sourceName}
                    </a>{" "}
                    by {blog.author} <em>({blog.date})</em>
                  </p>
                </div>
              ))}
          </div>
        </article>
      </div>
    </>
  );
}
