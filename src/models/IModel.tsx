interface IModel<T> {
    create(element: T): T
    getAll(): T[]
    get(id: number): T | undefined
    update(element: T): T
    delete(element: T): void
    deleteId(id: number): void
}

export default IModel;