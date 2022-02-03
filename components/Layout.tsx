import TableOfContents from './table-of-contents'
import Header from './header'
import Head from 'next/head'
import Sidebar from './Sidebar'
import { MDXRemote } from 'next-mdx-remote'

export default function Layout({ toc, source, components, frontMatter, sidebarContent }) {
  const hasTitle = frontMatter && frontMatter.title

  return (
    <>
      <Head>
        <title>{hasTitle && `${frontMatter.title} | `}Cypress Documentation</title>
        <meta name="description" content="" />
      </Head>

      <Header />

      <div className="min-h-screen mt-20">
        <div className="py-6">
          <div className="max-w-3xl mx-auto sm:px-6 lg:max-w-full lg:px-8 lg:grid lg:grid-cols-12 lg:gap-8">
            {/* Table of Content */}
            <div className="hidden lg:block lg:col-span-3 xl:col-span-2">
              <div className="sticky top-6">
                <Sidebar sidebarContent={sidebarContent} />
              </div>
            </div>

            {/* Content */}
            <main className="lesson-content lg:col-span-9 xl:col-span-7">
              <div className="relative bg-white overflow-hidden">
                <div className="relative px-4 sm:px-6 lg:px-8">
                  <div className="prose prose-indigo prose-lg text-gray-500 mx-auto">
                    {hasTitle && <h1>{frontMatter.title}</h1>}
                    <MDXRemote {...source} components={components} />
                  </div>
                </div>
              </div>
            </main>

            {/* Table of Content */}
            <div className="hidden xl:block xl:col-span-3">
              <div className="sticky top-6">
                {/* <p className="font-semibold mb-4">ON THIS PAGE</p> */}
                <nav aria-label="Sidebar" className="">
                  <TableOfContents toc={toc} hasBanner={false} />
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
