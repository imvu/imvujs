import BaseClass from 'imvu/BaseClass'

// This class is created in ./NamedBackbone.js
declare class NamedModel extends BaseClass /*TODO: extends Backbone.Model*/ {
    readonly attributes: any
    readonly id?:number|string
    readonly cid:string

    collection:any

    constructor(a:any, b:any, c:any)

    get(key:string): any
    set(key:string, value?:any, options?:any): void

    // TODO: callback type with generic type arg for the type of the `model` parameter.
    on(eventName:string, callback:any): void
    off(eventName:string, callback?:any): void
    stopListening(m:any): void
    trigger(eventName:string, data:any): void
}

export default NamedModel
