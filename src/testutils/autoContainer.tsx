import { unmountComponentAtNode } from 'react-dom'

/**
 * A simple div element that mounts at the beginning of every test and unmounts
 * at the end of them.
 * 
 * Useful for testing rendering.
 */
let autoContainer: HTMLDivElement = null;

beforeEach(() => {
    autoContainer = document.createElement("div");
    document.body.appendChild(autoContainer);
})

afterEach(() => {
    unmountComponentAtNode(autoContainer);
    autoContainer.remove();
    autoContainer = null;
})

export default autoContainer;