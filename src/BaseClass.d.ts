declare class BaseClass {
    dependencies?:string[]
    initialize(any): void

    // TODO: type parameter: static extend<T>(...
    static extend(name:string, def?:Object, classDef?:Object): any
}

export default BaseClass
