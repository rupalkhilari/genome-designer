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
patch(state) - updates present state, does not add state node

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

Alternatively, you can pass in the parameter `trackAll: true` to the configuration of the reducer enhancer (see below).

### Reducer Enhancer

Catches all events, and saves them to the undoManager as appropriate:

```
P = patch()
U = update()
N = undo()
R = redo()
T = transact()
C = commit()
                    U  P  T  U   U P   C  P  U
                          |            |
                  --1--2--|--3---4-5---|--6--7----
undoable actions: --*-----|--*---*-----|-----*----
 history.present:   1  2  2  2   2 2   5  6  7
transactionState:   -  -  2  3   4 5   -  -  -
transactionDepth:   0  0  1  1   1 1   0  0  0
```

# update this! - need to export reducer

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
filter {function} - passed the action, function to track whether should be added to undo, returning true is yes
debug {boolean}
stateKey {String}           //todo - determine whether doing this
```

###Todo

- todo - save the actions (2D array to handle transactions?)
- support limit of states to track
- discuss undo of saving a project / block
- pruning the store of unneeded blocks / projects