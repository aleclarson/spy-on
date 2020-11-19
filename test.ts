// @ts-ignore
import { spyOn } from './'

describe('spyOn', () => {
  it('can have multiple spies', () => {
    const obj = { a: 0 }
    const spy1 = spyOn(obj, 'a', jest.fn())
    const spy2 = spyOn(obj, 'a', jest.fn())

    obj.a++
    expect(spy1.onSet).toBeCalledWith(1)
    expect(spy2.onSet).toBeCalledWith(1)

    obj.a++
    expect(spy1.onSet).toBeCalledWith(2)
    expect(spy2.onSet).toBeCalledWith(2)
  })

  it('can remove spies', () => {
    const obj = { a: 0 }
    const spy = spyOn(obj, 'a', jest.fn())

    obj.a++
    expect(spy.onSet).toBeCalled()
    jest.resetAllMocks()

    spy.dispose()
    obj.a++
    expect(spy.onSet).not.toBeCalled()
  })

  describe('when no spies are left', () => {
    it('restores the original descriptor', () => {
      const obj = { a: 0 }

      const spy1 = spyOn(obj, 'a', () => {})
      const desc1 = Object.getOwnPropertyDescriptor(obj, 'a')

      const spy2 = spyOn(obj, 'a', () => {})
      const desc2 = Object.getOwnPropertyDescriptor(obj, 'a')

      expect(desc1).toMatchObject(desc2)

      spy1.dispose()
      spy2.dispose()

      const desc3 = Object.getOwnPropertyDescriptor(obj, 'a')
      expect(desc1).not.toMatchObject(desc3)
    })

    it('preserves the current value', () => {
      const obj = { a: 0 }
      const spy = spyOn(obj, 'a', () => {})

      obj.a++
      spy.dispose()

      expect(obj.a).toBe(1)
    })
  })
})
