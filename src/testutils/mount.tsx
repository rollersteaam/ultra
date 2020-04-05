import { unmountComponentAtNode } from 'react-dom'

/**
 * A simple div element that mounts at the beginning of every test and unmounts
 * at the end of them.
 * 
 * Useful for testing rendering.
 */
let container: HTMLDivElement = null;

beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
})

afterEach(() => {
    unmountComponentAtNode(container);
    container.remove();
    container = null;
})

export default container;