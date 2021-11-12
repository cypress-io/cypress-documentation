import s from "./style.module.css"
import { AlertProps } from "./types"

function classNames(...classes) {
  return classes.filter(Boolean).join(" ")
}

export default function Alert({ children, type }: AlertProps) {
  return (
    <div className={classNames(`${s.alert}`, `${s[type]}`)} role="alert">
      {children}
    </div>
  )
}
