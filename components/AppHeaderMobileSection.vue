<script>
export default {
  name: 'AppHeaderMobileSection',
  props: {
    section: {
      type: String,
      required: true,
    },
    parentSection: {
      type: String,
      required: false,
      default: '',
    },
    folder: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    children: {
      /**
       * @type
       * { title: string, slug: string }[]
       */
      type: Array,
      required: true,
    },
  },
}
</script>
<template>
  <div>
    <h3
      class="text-gray-300 block px-3 py-2 rounded-md text-base font-extrabold"
    >
      {{ title }}
    </h3>
    <ul>
      <li
        v-for="(child, childIndex) in children"
        :key="`navgroup-child-${childIndex}`"
      >
        <AppHeaderMobileSection
          v-if="child.children"
          :title="child.title"
          :folder="child.slug"
          :section="
            parentSection ? section.concat('/').concat(parentSection) : section
          "
          :name="child.slug"
          :children="child.children"
        />
        <div v-else>
          <nuxt-link
            :to="`/${section}/${folder}/${child.slug}`"
            class="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
          >
            {{ child.title }}
          </nuxt-link>
        </div>
      </li>
    </ul>
  </div>
</template>
