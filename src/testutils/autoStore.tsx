import createUltraStore from '../store';

/**
 * Creates the same store that the app uses, but before every test, and cleans
 * itself up after.
 */
let store;

beforeEach(() => {
    store = createUltraStore();
})

afterEach(() => {
    store = null;
});

const autoStore = () => store;

export default autoStore;