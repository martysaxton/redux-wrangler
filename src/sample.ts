import { createStore } from 'redux'
import ReducerRegistry from './ReducerRegistry'

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



