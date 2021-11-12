function classNames(...classes) {
  return classes.filter(Boolean).join(" ")
}

export default function LessonSideNav({ navigation }) {
  return (
    <nav data-test="toc-sidebar" className="space-y-1" aria-label="Sidebar">
      {navigation.map((item) => (
        <a
          data-test={item.slug}
          key={item.slug}
          href={`#${item.slug}`}
          className={classNames(
            item.current
              ? "bg-gray-100 text-gray-900"
              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
            "group flex items-center px-3 py-2 text-sm font-medium rounded-md"
          )}
          aria-current={item.current ? "page" : undefined}
        >
          <span className="truncate">{item.content}</span>
        </a>
      ))}
    </nav>
  )
}
