import BaseClass from 'imvu/BaseClass'

type CollectionEvents = 'add' | 'update' | 'change' | 'reset'

// This class is created in ./NamedBackbone.js
declare class NamedCollection<T> extends BaseClass /*TODO: extends Backbone.Collection*/ {
    length: number

    constructor(models:T[], opts:any)

    add(models:T | T[], options?:any): T[]
    remove(models:T | T[], options?:any): T[]
    reset(models?:T | T[] | null, options?:any): void

    map(
        iteratee:(item:T, index?:number, collection?:NamedCollection<T>) => any,
        context?:any
    ): any[]

    filter(
        predicate:(item:T) => boolean,
        context?:any
    ): T[]

    // ... add props/methods as needed ...

    // TODO: callback type with generic type arg for the type of the `model` parameter.
    on(eventName:CollectionEvents, callback:(model:T | {previousModels: T[]}) => void): void
}

export default NamedCollection
