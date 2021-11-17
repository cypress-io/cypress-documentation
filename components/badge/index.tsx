import s from './style.module.css'
import { BadgeProps } from './types'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Badge({ type, children }: BadgeProps) {
  return <div className={classNames(`${s.badge}`, `${s[type]}`)}>{children}</div>
}
