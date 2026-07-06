/**
 * Swizzled from @docusaurus/theme-classic (v3.10.1).
 *
 * Only change vs. the upstream component: the wrapper landmark role.
 * The default component uses role="banner", but `banner` is a top-level
 * landmark reserved for the site header (the navbar already provides it).
 * A second banner landmark is an accessibility antipattern, so this bar is
 * exposed as a labelled `region` instead.
 */

import React, {type ReactNode} from 'react';
import clsx from 'clsx';
import {ThemeClassNames, useThemeConfig} from '@docusaurus/theme-common';
import {useAnnouncementBar} from '@docusaurus/theme-common/internal';
import {translate} from '@docusaurus/Translate';
import AnnouncementBarCloseButton from '@theme/AnnouncementBar/CloseButton';
import AnnouncementBarContent from '@theme/AnnouncementBar/Content';

import styles from './styles.module.css';

export default function AnnouncementBar(): ReactNode {
  const {announcementBar} = useThemeConfig();
  const {isActive, close} = useAnnouncementBar();
  if (!isActive) {
    return null;
  }
  const {backgroundColor, textColor, isCloseable} = announcementBar!;
  return (
    <div
      className={clsx(
        ThemeClassNames.announcementBar.container,
        styles.announcementBar,
      )}
      style={{backgroundColor, color: textColor}}
      role="region"
      aria-label={translate({
        id: 'theme.AnnouncementBar.ariaLabel',
        message: 'Announcement',
        description: 'The ARIA label for the announcement bar landmark region',
      })}>
      {isCloseable && <div className={styles.announcementBarPlaceholder} />}
      <AnnouncementBarContent className={styles.announcementBarContent} />
      {isCloseable && (
        <AnnouncementBarCloseButton
          onClick={close}
          className={styles.announcementBarClose}
        />
      )}
    </div>
  );
}
