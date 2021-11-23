import Link from 'next/link'
import { ProSidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar'
import 'react-pro-sidebar/dist/css/styles.css'

interface SidebarProps {
  sidebarContent: {
    slug: string
    children?: {
      title: string
      slug: string
      children: {
        title: string
        slug: string
      }[]
    }[]
  }
}

export default function Sidebar({ sidebarContent: { children, slug } }: SidebarProps) {
  return (
    <>
      {children
        ? children.map((item, index) => (
            <ProSidebar key={index}>
              <Menu iconShape="square">
                <SubMenu title={item.title} key={index}>
                  {item.children.map((subItem, subIndex) => (
                    <MenuItem key={subIndex}>
                      <Link href={`/${slug}/${item.slug}/${subItem.slug}`}>
                        <a>{subItem.title}</a>
                      </Link>
                    </MenuItem>
                  ))}
                </SubMenu>
              </Menu>
            </ProSidebar>
          ))
        : null}
    </>
  )
}
