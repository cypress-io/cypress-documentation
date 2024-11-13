import React from 'react'
import clsx from 'clsx'
import styles from './styles.module.css'

interface NavbarSearchProps {
  children: React.ReactNode
  className?: string
}

export default function NavbarSearch({
  children,
  className,
}: NavbarSearchProps) {
  return <div className={clsx(className, styles.searchBox)}>{children}</div>
}
