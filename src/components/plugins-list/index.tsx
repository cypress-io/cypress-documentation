import React from "react";
import s from "./style.module.css";
import { PluginProps } from "./types";
// @ts-ignore
import pluginsJSON from "@site/src/data/plugins.json";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

function createMarkup(html) {
  return { __html: html };
}

export default function PluginsList() {
  return (
    <>
      {pluginsJSON.plugins.map((plugin) => (
        <section
          key={plugin.name}
          data-cy={`plugin-${plugin.name}`}
          className="mb-8"
        >
          <h2 id={plugin.name} className="text-2xl font-bold text-blue mb-4">
            <a
              className="border-dotted border-b border-blue"
              href={`#${plugin.name}`}
            >
              {plugin.name}
            </a>
          </h2>

          {plugin.description && (
            <p
              className="my-8"
              dangerouslySetInnerHTML={createMarkup(plugin.description)}
            ></p>
          )}

          <ul className={s.pluginsList}>
            {plugin.plugins.map((plugin) => (
              <li key={plugin.name}>
                <div className={s.pluginTitle}>
                  <h3>
                    <a
                      href={plugin.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue text-xl font-bold"
                    >
                      {plugin.name}
                    </a>
                  </h3>

                  {plugin.badge && (
                    <div className={s.pluginBadge}>
                      <span
                        className={`${s.badge} ${s.badgePill} ${
                          s[
                            `badge${plugin.badge[0]
                              .toUpperCase()
                              .concat(plugin.badge.slice(1))}`
                          ]
                        }`}
                      >
                        {plugin.badge}
                      </span>
                    </div>
                  )}
                </div>

                <p>{plugin.description}</p>
                <div className="break-words">
                  {plugin.keywords?.map((keyword, index) => (
                    <span key={index} className={`${s.keyword}`}>
                      {" "}
                      #{keyword}
                    </span>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </>
  );
}
