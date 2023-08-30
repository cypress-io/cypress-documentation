import React from "react";
import { PluginProps } from "./types";
// @ts-ignore
import projectsJSON from "@site/src/data/projects.json";

export default function ProjectsList() {
  return (
    <>
      Explore Cypress in the wild with these great projects!
      <article className="main-content-article">
        <ul>
          {projectsJSON.projects.map((project, index) => (
            <li key={index}>
              <h3>
                <a href={project.url} target="_blank" rel="noopener noreferrer">
                  {project.name}
                </a>
              </h3>
              <p>{project.description}</p>
            </li>
          ))}
        </ul>
      </article>
    </>
  );
}
