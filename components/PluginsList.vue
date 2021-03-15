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
  <div>
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
      <p v-if="pluginType.description" class="my-8">
        {{ pluginType.description }}
      </p>
      <ul class="plugins-list">
        <li v-for="plugin in pluginType.plugins" :key="plugin.name" class="m-3">
          <div class="plugin-title">
            <h3>
              <a
                :href="plugin.link"
                target="_blank"
                rel="noopener noreferrer"
                class="text-blue text-xl font-bold"
                >{{ plugin.name }}</a
              >
            </h3>
            <div v-if="plugin.badge" class="plugin-badge">
              <span :class="`badge badge-pill badge-${plugin.badge}`">
                {{ plugin.badge }}
              </span>
            </div>
          </div>
          <p>{{ plugin.description }}</p>
          <span
            v-for="keyword in plugin.keywords"
            :key="keyword"
            class="keyword"
            >#{{ keyword }}</span
          >
        </li>
      </ul>
    </section>
  </div>
</template>

<style lang="scss">
$card-header-breakpoint: 1280px;

.plugins {
  .wrapper {
    padding: 40px 40px;
  }

  h2 {
    border-bottom: 0;
    margin-bottom: 0;
  }

  h3 {
    font-size: 1.3em;
    margin: 0;
    border-bottom: 0;
    line-height: 1.3;

    a {
      border-bottom: 0;

      &:hover {
        border-bottom: 0;
      }
    }
  }
}

ul.plugins-list {
  display: flex;
  margin: 0 0 0 -10px;
  padding: 0;
  width: calc(100% + 20px);
  flex-wrap: wrap;

  li {
    box-sizing: border-box;
    list-style: none;
    padding: 20px;
    width: 30%;
    border: 1px solid #e8e8e8;
    box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.15);

    p {
      margin-bottom: 0.5em;
    }
  }

  .plugin-badge {
    // margin-top: -8px;
    margin-bottom: 5px;

    @media (min-width: $card-header-breakpoint) {
      margin: 0;
    }
  }

  .plugin-title {
    border-bottom: 1px solid #eee;
    margin-bottom: 0.6em;

    @media (min-width: $card-header-breakpoint) {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-bottom: 0.5rem;
    }

    .badge-pill {
      font-size: 12px;
      color: white;

      &.badge-community {
        background-color: #737373;
      }

      &.badge-experimental {
        background-color: #965cc1;
      }

      &.badge-official {
        background-color: #257e8e;
      }

      &.badge-verified {
        background-color: #00805b;
      }
    }
  }

  .keyword {
    font-weight: 300;
    color: #777;
    @apply mr-2;
  }
}
</style>
