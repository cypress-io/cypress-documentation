<script>
export default {
  props: {
    list: {
      type: Array,
      default: () => [],
    },
  },
}
</script>

<template>
  <div class="nuxt-content">
    <section
      v-for="pluginType in list"
      :key="pluginType.name"
      :data-cy="`plugin-${pluginType.name}`"
      class="mb-8"
    >
      <h2 :id="pluginType.name" class="text-2xl font-bold text-blue mb-4">
        <a
          class="border-dotted border-b border-blue"
          :href="`#${pluginType.name}`"
          >{{ pluginType.name }}</a
        >
      </h2>
      <p
        v-if="pluginType.description"
        class="my-8"
        v-html="pluginType.description"
      ></p>
      <ul :class="$style.pluginsList">
        <li v-for="plugin in pluginType.plugins" :key="plugin.name" class="m-3">
          <div :class="$style.pluginTitle">
            <h3>
              <a
                :href="plugin.link"
                target="_blank"
                rel="noopener noreferrer"
                class="text-blue text-xl font-bold"
                >{{ plugin.name }}</a
              >
            </h3>
            <div v-if="plugin.badge" :class="$style.pluginBadge">
              <span
                :class="`${$style.badge} ${$style.badgePill} ${
                  $style[
                    `badge${plugin.badge[0]
                      .toUpperCase()
                      .concat(plugin.badge.slice(1))}`
                  ]
                }`"
              >
                {{ plugin.badge }}
              </span>
            </div>
          </div>
          <p>{{ plugin.description }}</p>
          <div class="break-words">
            <span
              v-for="keyword in plugin.keywords"
              :key="keyword"
              :class="$style.keyword"
              >#{{ keyword }}</span
            >
          </div>
        </li>
      </ul>
    </section>
  </div>
</template>

<style module>
.plugins .wrapper {
  padding: 40px 40px;
}

.plugins h2 {
  border-bottom: 0;
  margin-bottom: 0;
}

.plugins h3 {
  font-size: 1.3em;
  margin: 0;
  border-bottom: 0;
  line-height: 1.3;
}

.plugins a {
  border-bottom: 0;
}
.plugins a:hover {
  border-bottom: 0;
}

ul.pluginsList {
  display: flex;
  margin: 0 !important;
  padding: 0;
  width: calc(100% + 20px);
  flex-wrap: wrap;
}

ul.pluginsList li {
  box-sizing: border-box;
  list-style: none;
  padding: 20px;
  border: 1px solid #e8e8e8;
  box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.15);
  @apply w-full;
}

/* stylelint-disable-next-line at-rule-no-unknown */
@screen lg {
  ul.pluginsList li {
    width: 30%;
  }
}

ul.pluginsList li p {
  margin-bottom: 0.5em;
}

.pluginBadge {
  margin-bottom: 5px;
}

.pluginTitle {
  border-bottom: 1px solid #eee;
  margin-bottom: 0.6em;
}

@media (min-width: 1280px) {
  .pluginTitle {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-bottom: 0.5rem;
  }

  .pluginBadge {
    margin: 0;
  }
}

/* remove hash symbol from appearing in the ::before
   of the anchors in titles */
.pluginTitle > h3 > a::before {
  content: '';
  margin-left: 0;
  padding-right: 0;
}

.badge {
  display: inline-block;
  color: #fff;
  font-size: 0.7rem;
  border-radius: 10rem;
  font-weight: 700;
  padding: 0.25em 0.4em;
  line-height: 0.7rem;
  @apply px-2;
  @apply py-1;
}

.badgePill {
  font-size: 12px;
  color: white;
}

.badgePill.badgeCommunity {
  background-color: #737373;
}

.badgePill.badgeExperimental {
  background-color: #965cc1;
}

.badgePill.badgeOfficial {
  background-color: #257e8e;
}

.badgePill.badgeVerified {
  background-color: #00805b;
}

.keyword {
  font-weight: 300;
  color: #777;
  @apply mr-2;
}
</style>
