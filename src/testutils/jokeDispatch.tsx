/**
 * Returns a mocked dispatch that was called using the provided action.
 * 
 * Makes testing actions easier.
 */
export default function (action: Function, mockGetState?: Function) {
    let fn = jest.fn();
    action(fn, mockGetState);
    return fn;
}