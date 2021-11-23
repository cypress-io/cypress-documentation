import fs from 'fs'
import matter from 'gray-matter'
import { serialize } from 'next-mdx-remote/serialize'
import Head from 'next/head'
import path from 'path'
import rehypeSlug from 'rehype-slug'
import rehypePrism from '@mapbox/rehype-prism'
import Layout from '@/components/Layout'
import VideoYouTube from '@/components/video-youtube'
import Video from '@/components/video'
import Icon from '@/components/icon'
import Alert from '@/components/alert'
import DocsImage from '@/components/docs-image'
import DocsVideo from '@/components/docs-video'
import Badge from '@/components/badge'
import { GET_PATH, allContentFilePaths, getToCForMarkdown } from '@/utils/mdxUtils'
import sidebarJSON from '@/data/sidebar.json'

// Custom components/renderers to pass to MDX.
// Since the MDX files aren't loaded by webpack, they have no knowledge of how
// to handle import statements. Instead, you must include components in scope
// here.
const components = {
  //a: CustomLink,
  // It also works with dynamically-imported components, which is especially
  // useful for conditionally loading components for certain routes.
  // See the notes in README.md for more details.
  //TestComponent: dynamic(() => import('@/components/TestComponent')),
  Head,
  VideoYouTube,
  Video,
  Icon,
  Alert,
  DocsImage,
  DocsVideo,
  Badge,
}

const PAGE = 'examples'

export default function ExamplesPage({ source, toc }) {
  return (
    <>
      <Head>
        <title>Examples | Cypress Documentation</title>
        <meta name="description" content="" />
      </Head>

      <Layout
        toc={toc}
        source={source}
        components={components}
        sidebarContent={sidebarJSON[PAGE][0]}
      />
    </>
  )
}

export const getStaticProps = async ({ params: { slug } }: { params: { slug: string[] } }) => {
  const MD_FILE_PATH = slug.join('/')
  const contentFilePath = GET_PATH(`content/${PAGE}/${MD_FILE_PATH}.md`)
  const source = fs.readFileSync(contentFilePath)
  const { content, data } = matter(source)
  const toc = getToCForMarkdown(content)
  const mdxSource = await serialize(content, {
    // Optionally pass remark/rehype plugins
    mdxOptions: {
      remarkPlugins: [],
      // @ts-ignore
      rehypePlugins: [rehypeSlug, rehypePrism],
    },
    scope: data,
  })

  return {
    props: {
      source: mdxSource,
      frontMatter: data,
      toc,
    },
  }
}

export const getStaticPaths = async () => {
  const paths = allContentFilePaths(`content/${PAGE}/**/*`)
    // Remove file extensions for page paths
    .map((path) => path.replace(/\.md?$/, ''))
    // Map the path into the static paths object required by Next.js
    .map((filePath) => {
      // Special Case for splice; there is a nested /examples directory
      const slug = filePath
        .split('/')
        .filter((path) => path !== '')
        .splice(1)
      return { params: { slug } }
    })

  return {
    paths,
    fallback: false,
  }
}
