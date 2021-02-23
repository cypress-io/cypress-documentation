export const getSidebarItemLink = ({ section, folder, slug }) => {
  /**
   * The current docs include a link to "All Assertions" in the API docs
   * sidebar. However, this is not a page that exists within the API docs
   * directory. This is a page in the Guides docs. If the user navigates to
   * this path, we redirect them to the appropriate reference page in the
   * Guides section.
   */
  if (slug === 'all-assertions') {
    return `/guides/references/assertions`
  }
  return `/${section}/${folder ? `${folder}/` : ''}${slug}`
}
