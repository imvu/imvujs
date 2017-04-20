import BaseClass from 'imvu/BaseClass'

// This class is created in ./NamedBackbone.js
declare class NamedModel extends BaseClass /*TODO: extends Backbone.Model*/ {
    attributes: any
    readonly id?:number|string
    readonly cid:string
    constructor(opts:any)

    get(prop:string): any
    set(prop:string, value?:any, options?:any): void

    // TODO: callback type with generic type arg for the type of the `model` parameter.
    on(eventName:string, callback:any): void
}

export default NamedModel
