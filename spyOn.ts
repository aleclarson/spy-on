const spiesByTarget = new WeakMap<any, SpySet>()

interface SpySet extends Set<Function> {
  unhook(): void
}

export interface Spy<T> {
  onSet(value: T): void
  dispose(): void
}

function spyOn<T, P extends keyof T>(
  target: T,
  key: P,
  onSet: (value: T[P]) => void
): Spy<T[P]> {
  let spies = spiesByTarget.get(target)!
  if (!spies) {
    const prevDesc = Object.getOwnPropertyDescriptor(target, key) || {}
    const { get, set, enumerable, configurable } = prevDesc

    if (get && !set) {
      throw Error('Cannot spy on non-writable property')
    }
    if (!configurable) {
      throw Error('Cannot spy on non-configurable property')
    }

    spies = new Set() as SpySet
    spiesByTarget.set(target, spies)
    spies.unhook = () => {
      if (!get) prevDesc.value = value
      Object.defineProperty(target, key, prevDesc)
      spiesByTarget.delete(target)
    }

    let value = target[key]
    Object.defineProperty(target, key, {
      configurable,
      enumerable,
      get: get || (() => value),
      set(newValue) {
        value = newValue
        if (set) {
          set.call(target, newValue)
        }
        Array.from(spies).forEach(spy => spy(newValue))
      },
    })
  }

  spies.add(onSet)
  return {
    onSet,
    dispose() {
      spies.delete(onSet)
      if (!spies.size) {
        spies.unhook()
      }
    },
  }
}

export default spyOn
export { spyOn }
