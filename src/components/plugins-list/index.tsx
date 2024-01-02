import React from 'react'
import s from './style.module.css'
// @ts-ignore
import pluginsJSON from '@site/src/data/plugins.json'
import clsx from 'clsx'

function createMarkup(html) {
  return { __html: html }
}

export default function PluginsList() {
  return (
    <>
      {pluginsJSON.plugins.map((plugin) => (
        <section key={plugin.name} data-cy={`plugin-${plugin.name}`}>
          <h2 id={plugin.name.replaceAll(' ', '-').toLowerCase()}>
            {plugin.name}
          </h2>

          {plugin.description && (
            <p
              className="mb-[16px]"
              dangerouslySetInnerHTML={createMarkup(plugin.description)}
            ></p>
          )}

          <ul className={clsx(s.pluginsList, '!pl-0')}>
            {plugin.plugins.map((plugin) => (
              <li key={plugin.name} className="!list-none">
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

                <p
                  dangerouslySetInnerHTML={createMarkup(plugin.description)}
                ></p>
                <div>
                  {plugin.keywords?.map((keyword, index) => (
                    <span key={index} className={`${s.keyword}`}>
                      {' '}
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
  )
}
