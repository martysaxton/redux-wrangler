import { createStore } from 'redux'
import ReducerRegistry from './ReducerRegistry'

// Define an interface for the (type safe) store
interface MyStore {
    foo: string
    bar: number
}

// New up a ReducerRegistry
const reducerRegistry = new ReducerRegistry<MyStore>()

// ReducerRegistry provides a 'reducer' method that will dispatch
// an action to one of it's reducers.
const store = createStore(reducerRegistry.reducer, { foo: "a", bar: 2 })

// To define an action, first create an interface:
interface FooAction {
    newValue: string
}

// Register the reducer for the action  The return value from registerReducer is
// the action creation function.  A few noteworthy things here:
//   * This is the only place you'll ever use the action's 'type' value ("FOO")
//   * The reducer's arguments and return value are strongly typed
//   * The action creator function is strongly typed
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

 

