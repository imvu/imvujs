// This class is created in ./NamedBackbone.js
declare class NamedView /*TODO: extends Backbone.View*/ {
    className: string
    static extend(name:string, def?:Object, classDef?:Object): Function // mixed in from IMVU.BaseClass
    initialize(args: Object): void
}

export default NamedView
