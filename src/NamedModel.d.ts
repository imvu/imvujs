import BaseClass from 'imvu/BaseClass'

// This class is created in ./NamedBackbone.js
declare class NamedModel extends BaseClass /*TODO: extends Backbone.Model*/ {
    attributes: any
    constructor(opts:any)

    get(prop:string): any
    set(prop:string, value?:any, options?:any): void
}

export default NamedModel
