import Link from 'next/link'
import { useRouter } from 'next/router'
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
  const router = useRouter()

  return (
    <div className="app-sidebar">
      {children
        ? children.map((item, index) => (
            <ProSidebar key={index}>
              <Menu iconShape="square">
                <SubMenu title={item.title} data-test={`${item.title}-children`} key={index}>
                  {item.children.map((subItem, subIndex) => {
                    const internalPaths = [`/${slug}`, item.slug, subItem.slug]
                    const internalPath = internalPaths.filter((path) => path).join('/')

                    return (
                      <MenuItem key={subIndex} data-test={item.slug}>
                        <Link href={internalPath}>
                          <a
                            className={internalPath === router.asPath ? 'active-sidebar-link' : ''}
                          >
                            {subItem.title}
                          </a>
                        </Link>
                      </MenuItem>
                    )
                  })}
                </SubMenu>
              </Menu>
            </ProSidebar>
          ))
        : null}
    </div>
  )
}
