# redux-wrangler
Helps elinimate boilerplate code while providing typesafe resolvers when using Redux with TypeScript.

## Motivation

There are too much mudane, repeditive, boring, error prone steps when trying t create an idiomatic redux action creators and reducers.  When you're making a type safe store using TypeScript, there are a few additional boring steps:

1. Define a string constant for the 'type' of the action
2. Since it's TypeScript, you'll need an interface for the action
3. Define an action creator
4.  Define the reducer
5. Add the reducer to some other reducer's switch statement 

Wow, that's a lot of boring steps.  What if I told you you get this down to just 2 steps?

This library provides a class called ReducerRegistry that (as the name implies) allows you to register your reducers with it.  When you register a reducer, it returns to you an auto-generated action creator function.  You'll only need the "type" string value in exactly one place, so it's really not that important to define a string constant for it.  And there's no need to add your reducer to a switch statement, the ReducerRegistry will take care of routing actions to your reducer automatically.


Here's a quick example:

```ts
import { createStore } from 'redux'
import ReducerRegistry from 'ReducerRegistry'

// Define an interface for the (type safe) store
interface MyStore {
    foo: string
    bar: number
}

// New up a ReducerRegistry
const reducerRegistry = new ReducerRegistry<MyStore>()

// ReducerRegistry provides a 'reducer' method that will dispatch an action to one of it's reducers.
const store = createStore(reducerRegistry.reducer, { foo: "a", bar: 2 })

// Now let's define an action.  First an interface for the action itself
interface FooAction {
    newValue: string
}


// Register the reducer:
// This is the only place you'll use the action's 'type' value ("FOO" in this case), so it's not that important to define a string constant for it.
// TypeScript strictly enforces all types here in the reducer (store, fooAction, and the return value from the reducer)
// The return value is a strongly typed action creator function
const fooActionCreator = reducerRegistry.registerReducer<FooAction>("FOO", (store, fooAction) => {
    return { 
        ...store,
        foo: fooAction.newValue
    }
})

// create a foo action 
const fooAction  = fooActionCreator( { newValue: "asdf" } )

//  fooAction = {
//      type:  "FOO",
//      newValue: "asdf"
//  }

// you can then dispatch the action, and it will get routed to fooActionReducer as expected
store.dispatch(fooAction)

 
```

If all of your reducers are registered inside the ReducerRegistry instance, then the above example is all you need.  If you want to 'mix and match' your reducers, with some inside the ReducerRegistry, and some not, you can define the root reducer by hand, and call `ReduerRegistry.canHandleAction`

```ts
 const rootReducer = (state: MyStore, action: AnyAction) => {

     if (reducerRegistry.canHandleAction(a)) {
         return reducerRegistry.reducer(state)
     
     }

    switch(action.type) {
        // ...
    }
}
```


