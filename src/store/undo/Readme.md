## Overview

State management which supports undo/redo and transactions with minimal buy-in, especially to consumers of actions.

Builds on top of Redux, primarily as a "reducer enhancer" with support for some actions (undo, redo)

### Goals

- Support transactions
- Per-action granularity, not limited to each reducer
- Little memory increase
- Useful debug messages

## Implementation

By default, adding the reducer enhancer will only add a section to the store `undo`. Actions must be marked as undoable, or you must interact with the UndoManager directly.

### UndoManager

Does the actual state management, is called by the reducer. Can be called directly, but usually actions will handle this.

While JSON.stringify() would allow for nice string equality checks, we are using immutables and would lose our ability to reference equality check.

##### API

```
//state tracking
update(state) - add state node if (state !=== newState) and subject to transactions, clears future steps, returns new state.

//transactions (called directly)
transact() - begin a transaction (increment counter, so nesting handled)
commit(full = false) - commit a transaction, all transactions if `full === true`, return new state (throw error if not in transaction)
abort() - abort a transaction, return prior state (throw error if not in transaction)
inTransaction() - true/false, if in transaction

ignore(number = 1) - ignore # of `update()`s, pass null to reset

//state movement (are exposed as actions) 
undo() - return state after going back one step, throw if no past 
redo() - return state after going forward one step, throw if no future
jump(number = 0) - jump # of steps in past (-) or future (+), throw if # not present

//utils
getPast() - return past states
getFuture() - return future states
```

### Actions

Actions can have an additional field `undoable`, which, when true, will `update()` the `UndoManager`:

```
{
    type <const>
    undoable <boolean>
    ...rest <payload>
}
```

### Reducer Enhancer

# update this!

Adds key `undo` (you can rename this in config) to the store:

```
undo: {
    past: #,
    future: #,
    time: <date store was updated>
}
```

##### config

Object with the following keys:

```
trackAll {boolean}
debug {boolean}
stateKey {String}           //todo - determine whether doing this
```

###Todo

- support limit of states to track