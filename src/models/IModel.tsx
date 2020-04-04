interface IModel<T> {
    create(name: string): T
    getAll(): T[]
    get(id: number): T | undefined
    update(element: T): void
    delete(element: T): void
    deleteId(id: number): void
}

export default IModel;