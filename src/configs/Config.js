// The State class preserves persistent and temporary state changes during Play

class Config {
    constructor(config) {
        this.config = config;

    }

    getState() { return this.config; }
    setState(config) { this.config = config; }
}