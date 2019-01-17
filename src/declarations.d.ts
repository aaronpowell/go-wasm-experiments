declare module "*.go" {
    interface GoWrapper {
        [K: string]: <T = any, R = any>(...params: T[]) => Promise<R>
    }

    var _: GoWrapper
    export default _
}