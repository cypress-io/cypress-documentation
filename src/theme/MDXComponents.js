import React from "react";
// Import the original mapper
import MDXComponents from "@theme-original/MDXComponents";
import AnatomyOfAnError from "@site/docs/partials/_anatomy-of-an-error.mdx";
import Badge from "@site/src/components/badge";
import ComponentOnlyBadge from "@site/src/components/component-only-badge";
import CtBetaAlert from "@site/docs/partials/_CtBetaAlert.mdx";
import DefaultSelectorPriority from "@site/docs/partials/_default-selector-priority.mdx";
import DocsImage from "@site/src/components/docs-image";
import DocsVideo from "@site/src/components/docs-video";
import E2EOnlyBadge from "@site/src/components/e2e-only-badge";
import E2EOrCtTabs from "@site/src/components/e2e-or-ct-tabs";
import Icon from "@site/src/components/icon";
import ImportMountFunctions from "@site/docs/partials/_import-mount-functions.mdx";
import IntellisenseCodeCompletion from "@site/docs/partials/_intellisense-code-completion.mdx";
import List from "@site/src/components/list";
import SingleDomainWorkaround from "@site/docs/partials/_single-domain-workaround.mdx";
import SupportFileConfiguration from "@site/docs/partials/_support-file-configuration.mdx";
import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";
import ThenShouldAndDifference from "@site/docs/partials/_then-should-and-difference.mdx";
import WarningPluginsFile from "@site/docs/partials/_warning-plugins-file.mdx";
import WarningSetupNodeEvents from "@site/docs/partials/_warning-setup-node-events.mdx";

// Font Awesome
import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
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
} from "@fortawesome/free-solid-svg-icons";

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
);

export default {
  // Re-use the default mapping
  ...MDXComponents,
  AnatomyOfAnError,
  Badge,
  ComponentOnlyBadge,
  CtBetaAlert,
  DefaultSelectorPriority,
  DocsImage,
  DocsVideo,
  E2EOnlyBadge,
  E2EOrCtTabs,
  Icon,
  ImportMountFunctions,
  IntellisenseCodeCompletion,
  List,
  SingleDomainWorkaround,
  SupportFileConfiguration,
  Tabs,
  TabItem,
  ThenShouldAndDifference,
  WarningPluginsFile,
  WarningSetupNodeEvents,
};
