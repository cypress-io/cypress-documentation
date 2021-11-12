import "tailwindcss/tailwind.css"
import "../styles/global.css"
import Head from "next/head"
import { library } from "@fortawesome/fontawesome-svg-core"
import { fab } from "@fortawesome/free-brands-svg-icons"
import {
  faAngleRight,
  faBan,
  faBook,
  faBug,
  faCamera,
  faCheck,
  faCheckCircle,
  faCheckSquare,
  faChevronLeft,
  faChevronRight,
  faCode,
  faCog,
  faCogs,
  faCopy,
  faCrosshairs,
  faDownload,
  faExclamationTriangle,
  faExternalLinkAlt,
  faFileCode,
  faFolderOpen,
  faGlobe,
  faGraduationCap,
  faHeart,
  faHistory,
  faImage,
  faLongArrowAltUp,
  faMagic,
  faMousePointer,
  faPlayCircle,
  faPlus,
  faQuestionCircle,
  faSearch,
  faStar,
  faSyncAlt,
  faTerminal,
  faTimes,
  faTree,
  faVideo,
} from "@fortawesome/free-solid-svg-icons"

library.add(
  fab,
  faAngleRight,
  faBan,
  faBook,
  faBug,
  faCamera,
  faCheck,
  faCheckCircle,
  faCheckSquare,
  faChevronLeft,
  faChevronRight,
  faCode,
  faCog,
  faCogs,
  faCopy,
  faCrosshairs,
  faDownload,
  faExclamationTriangle,
  faExternalLinkAlt,
  faFileCode,
  faFolderOpen,
  faGlobe,
  faGraduationCap,
  faHeart,
  faHistory,
  faImage,
  faLongArrowAltUp,
  faMagic,
  faMousePointer,
  faPlayCircle,
  faPlus,
  faQuestionCircle,
  faSearch,
  faStar,
  faSyncAlt,
  faTerminal,
  faTimes,
  faTree,
  faVideo
)

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <link href="https://rsms.me/inter/inter.css" rel="stylesheet" />
        <link
          href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.23.0/themes/prism-tomorrow.min.css"
          rel="stylesheet"
        />
      </Head>
      <Component {...pageProps} />
    </>
  )
}

export default MyApp
