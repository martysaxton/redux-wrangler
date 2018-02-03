
import {AnyAction, Action} from 'redux'

export interface GenericAction<T>  {
    type: string
    payload: T
}

export type actionCreatorFunction<T> =  (data: T) => T & Action

export default class ReducerRegistry<StoreType> {

    private allReducers = new Map<string, (state: StoreType, action: any) => StoreType>()

    registerReducer<ActionPayload>( type: string, reducer: (state: StoreType, asdf: ActionPayload ) => StoreType): actionCreatorFunction<ActionPayload> {
        this.allReducers.set(type, reducer)
        const rv: actionCreatorFunction<ActionPayload> = (payload: ActionPayload) => { 
            return Object.assign( {type: type}, payload )
        }
        return rv
    }

    canHandleAction(action: AnyAction): boolean {
        return this.allReducers.has(action.type)
    }

    reducer = (state: StoreType, action: AnyAction): StoreType => {
        const reducer = this.allReducers.get(action.type)
        if (!reducer) {
            return state
        }
        return reducer(state, action)
    }
}
