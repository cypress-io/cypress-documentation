import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import s from "./style.module.css"
// import { IconProps } from './types'

export default function Icon({ name }) {
  const iconName = name === "github" ? ["fab", "github"] : name

  return (
    <div className={s.root}>
      <FontAwesomeIcon icon={iconName} />
    </div>
  )
}
