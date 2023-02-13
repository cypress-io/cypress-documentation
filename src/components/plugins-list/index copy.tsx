import React from "react";
import s from "./style.module.css";
import { PluginProps } from "./types";
// @ts-ignore
import pluginsJSON from "@site/src/data/plugins.json";

function createMarkup(html) {
  return { __html: html };
}

const PluginSection = ({ plugin }) => {
  // const plugin = pluginsJSON.plugins.find(({ name }) => pluginType === name)

  if (!plugin) return null
  return (
    <section
      key={plugin.name}
      data-cy={`plugin-${plugin.name}`}
    >
      <h2>{plugin.name}</h2>
      {plugin.description && (
        <p
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
            <div>
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
  )
}

export default () => {
  return (
    <>
    {pluginsJSON.plugins.map((pluginType) => <PluginSection key={pluginType.name} plugin={pluginType} />)}
    </>
  )
}