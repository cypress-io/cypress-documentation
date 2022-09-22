import React from "react";
import s from "./style.module.css";
import { BlogsProps } from "./types";
// @ts-ignore
import blogsJSON from "@site/src/data/blogs.json";

export default function blogsList(): BlogsProps {
  return (
    <>
      <div>
        <article>
          {blogsJSON.small &&
          <div className={s.container}>
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
          <div className="container">
            <div className="row">
              {blogsJSON.large.map((blog, index) => (
                <div key={index} className="col col--6 margin-bottom--xl">
                  <div>
                    <a
                       href={blog.sourceUrl}
                       target="_blank"
                       rel="noopener noreferer"
                    >
                      <h3 className={s.contentHeader}>{blog.title}</h3>
                    </a>
                  </div>
                  <a
                     href={blog.sourceUrl}
                     target="_blank"
                     rel="noopener noreferer"
                  >
                  {blog.img ? <img src={blog.img} alt={`${blog.title}`} /> : null}
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
          </div>
        </article>
      </div>
    </>
  );
}
