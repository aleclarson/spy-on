# spy-on

Observe assignments to any writable, configurable object property.

```js
import spyOn from 'spy-on'

const obj = { a: 0 }

// The same property can be spied on multiple times.
const logger = spyOn(obj, 'a', console.log)
const mirror = spyOn(obj, 'a', a => (obj.b = a))

obj.a++        // logs "1"
obj.a == obj.b // => true

// Spies can be disposed.
logger.dispose()
obj.a++        // logs nothing
obj.a == obj.b // => true

mirror.dispose()
obj.a++        // logs nothing
obj.a == obj.b // => false

// Once all spies are disposed, the original descriptor 
// is restored.
Object.defineProperty(obj, 'a').value == 3 // => true
```
