import IModel from "./IModel";

/**
 * Special type of model that's managed based off of information from another
 * model.
 */
export interface IExchangeModel<T, R> extends IModel<R> {
    exchange(seed: T): R;
}