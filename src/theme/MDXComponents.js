// Import the original mapper
import MDXComponents from "@theme-original/MDXComponents";
import AnatomyOfAnError from "@site/docs/partials/_anatomy-of-an-error.mdx";
import AccessibilityAddon from "@site/docs/partials/_accessibility-addon.mdx";
import Badge from "@site/src/components/badge";
import ComponentOnlyBadge from "@site/src/components/component-only-badge";
import TestReplayInfo from "@site/docs/partials/_test-replay-info.mdx";
import CypressConfigFileTabs from "@site/src/components/cypress-config-file-tabs";
import CypressInstallCommands from "@site/docs/partials/_cypress-install-commands.mdx";
import CypressOpenCommands from "@site/docs/partials/_cypress-open-commands.mdx";
import CypressRunCommands from "@site/docs/partials/_cypress-run-commands.mdx";
import DefaultSelectorPriority from "@site/docs/partials/_default-selector-priority.mdx";
import DocsImage from "@site/src/components/docs-image";
import DocsVideo from "@site/src/components/docs-video";
import DocumentDomainWorkaround from "@site/docs/partials/_document-domain-workaround.mdx";
import E2EOnlyBadge from "@site/src/components/e2e-only-badge";
import E2EOrCtTabs from "@site/src/components/e2e-or-ct-tabs";
import VueSyntaxTabs from "@site/src/components/vue-syntax-tabs";
import Icon from "@site/src/components/icon";
import ImportMountFunctions from "@site/docs/partials/_import-mount-functions.mdx";
import IntellisenseCodeCompletion from "@site/docs/partials/_intellisense-code-completion.mdx";
import SupportFileConfiguration from "@site/docs/partials/_support-file-configuration.mdx";
import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";
import ThenShouldAndDifference from "@site/docs/partials/_then-should-and-difference.mdx";
import WarningSetupNodeEvents from "@site/docs/partials/_warning-setup-node-events.mdx";
import VideoRecordingSupportedBrowsers from "@site/docs/partials/_video-recording-supported-browsers.mdx"
import Logo from "@site/src/components/logo";
import CloudFreePlan from "@site/docs/partials/_cloud_free_plan.mdx";
import CiProviderCloudSteps from "@site/docs/partials/_ci_provider_cloud_steps.mdx";
import UrlAllowList from "@site/docs/partials/_url_allowlist.mdx";
import UICovAddon from "@site/docs/partials/_ui-coverage-addon.mdx";

// Font Awesome
import { library } from '@fortawesome/fontawesome-svg-core'
import { fab } from '@fortawesome/free-brands-svg-icons'
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
} from '@fortawesome/free-solid-svg-icons'

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

export default {
  // Re-use the default mapping
  ...MDXComponents,
  AnatomyOfAnError,
  AccessibilityAddon,
  Badge,
  ComponentOnlyBadge,
  CypressConfigFileTabs,
  CypressInstallCommands,
  CypressOpenCommands,
  CypressRunCommands,
  DefaultSelectorPriority,
  DocsImage,
  DocsVideo,
  DocumentDomainWorkaround,
  E2EOnlyBadge,
  E2EOrCtTabs,
  VueSyntaxTabs,
  Icon,
  ImportMountFunctions,
  IntellisenseCodeCompletion,
  SupportFileConfiguration,
  Tabs,
  TabItem,
  TestReplayInfo,
  ThenShouldAndDifference,
  WarningSetupNodeEvents,
  VideoRecordingSupportedBrowsers,
  Logo,
  CloudFreePlan,
  CiProviderCloudSteps,
  UrlAllowList,
  UICovAddon,
}
