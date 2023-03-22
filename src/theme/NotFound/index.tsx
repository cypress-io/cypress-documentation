import React from 'react';
import Translate, {translate} from '@docusaurus/Translate';
import {PageMetadata} from '@docusaurus/theme-common';
import Layout from '@theme/Layout';
import s from "./style.module.css";

export default function NotFound() {
  return (
    <>
      <PageMetadata
        title={translate({
          id: 'theme.NotFound.title',
          message: 'Page Not Found',
        })}
      />
      <Layout>
        <main className="container margin-vert--xl">
          <div className="row">
            <div className="col col--offset-3">
              <h1 className="hero__title">
                <Translate
                  id="theme.NotFound.title"
                  description="The title of the 404 page">
                  404 Page Not Found
                </Translate>
              </h1>
              <p className={s.content}>
                <Translate
                  id="theme.NotFound.p1"
                  description="The first paragraph of the 404 page">
                  Well darn... we can't find the page you're looking for. One of these links might help.
                </Translate>
              </p>
              <div className={s.listWrapper}>
                <ul>
                    <li>
                      <a href="/guides/core-concepts/introduction-to-cypress">Introduction to Cypress</a>
                    </li>
                    <li>
                      <a href="/api/commands/and">The API Docs</a>
                    </li>
                    <li>
                      <a href="/examples/tutorials">Tutorials</a>
                    </li>
                    <li>
                      <a href="/guides/cloud/introduction">Cypress Cloud</a>
                    </li>
                  </ul>
              </div>
              <p className={s.ital}>
                <Translate
                  id="theme.NotFound.p2"
                  description="The 2nd paragraph of the 404 page">
                  Try using our sweet custom search in the header above. 🔍
                </Translate>
              </p>
            </div>
          </div>
        </main>
      </Layout>
    </>
  );
}
