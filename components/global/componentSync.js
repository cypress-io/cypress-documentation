import _store from 'store2'
const store = _store.namespace('componentSync')

export class ComponentSync {
  #cache = {}

  register(component, methodName) {
    const { syncGroup } = component

    if (!syncGroup) {
      return
    }

    if (!this.#cache[syncGroup]) {
      this.#cache[syncGroup] = []
    }

    const fn = component[methodName].bind(component)

    this.#cache[syncGroup].push({ component, fn })

    this.restore(component)
  }

  unregister(component) {
    const { syncGroup } = component

    if (!syncGroup) {
      return
    }

    this.#cache[syncGroup] = this.#cache[syncGroup].filter(
      (obj) => obj.component !== component
    )
  }

  restore(component) {
    const { syncGroup } = component

    if (!syncGroup || !store.has(syncGroup)) {
      return
    }

    const { fn } = this.#cache[syncGroup].find(
      (obj) => obj.component === component
    )

    fn(...store.get(syncGroup))
  }

  sync(component, ...args) {
    const { syncGroup } = component

    if (!syncGroup) {
      return
    }

    this.#cache[syncGroup].forEach(({ fn }) => {
      fn(...args)
    })

    store.set(syncGroup, [...args])
  }

  syncWithScroll(component, elem, ...args) {
    const { top } = elem.getBoundingClientRect()

    this.sync(component, ...args)

    component.$nextTick(() => {
      const delta = elem.getBoundingClientRect().top - top

      if (delta !== 0) {
        window.scrollBy({ top: delta })
      }
    })
  }
}

export const componentSync = new ComponentSync()
