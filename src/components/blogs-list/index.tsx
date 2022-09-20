import React from "react";
import s from "./style.module.css";
import { BlogsProps } from "./types";
// @ts-ignore
import blogsJSON from "@site/src/data/blogs.json";

export default function blogsList(): BlogsProps {
  return (
    <>
      <div className="main-content-article-wrapper">
        <article>
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
          </div>

          <div className="container">
            <div className="row">
              {blogsJSON.large.map((blog, index) => (
                <div key={index} className="col col--6 margin-bottom--xl">
                  <div>
                    <a href={blog.sourceUrl}>
                      <h3 className={s.contentHeader}>{blog.title}</h3>
                    </a>
                  </div>
                  <a href={blog.sourceUrl}>
                  {blog.img ? <img width="340" height="220" src={blog.img} alt={`${blog.title}`} /> : null}
                  </a>
                  <p>
                    Published on <a href={blog.sourceUrl}>{blog.sourceName}</a>{" "}
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
