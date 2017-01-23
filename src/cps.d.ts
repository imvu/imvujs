type SequenceCallback = (next: Function) => void

declare namespace cps {
    function sequence_(
        funcs: Array<SequenceCallback>,
        continuation: () => void
    ): void
}

export default cps
