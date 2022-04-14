/**
 * The core object storing the library's global config.
 *
 * @private
 */
const configTarget = {}





/**
 * A list of window methods that are proxied through the global config. These methods can otherwise be replaced by updating the config.
 *
 * @private
 */
const windowProxies = [
	'cancelAnimationFrame',
	'requestAnimationFrame',
]





/**
 * Global configuration to be used by the library.
 *
 * @private
 * @property {Function} cancelAnimationFrame The function to be used for `cancelAnimationFrame`.
 * @property {Function} requestAnimationFrame The function to be used for `requestAnimationFrame`.
 */
export const config = new Proxy(configTarget, {
	/**
	 * @param {object} target The object to setthe property on.
	 * @param {string} key The key to be updated.
	 * @returns {*} The property's value.
	 */
	get(target, key) {
		if (windowProxies.includes(key) && !target[key]) {
			return (...args) => window[key](...args)
		}

		return Reflect.get(target, key)
	},

	/**
	 * Prevents properties from being set on the config without going through `updateConfig()`.
	 */
	set() {
		throw new Error('properties may not be set on `config` directly. Use the `updateConfig()` function instead.')
	},
})





/**
 * Update a single key in the config.
 *
 * @private
 * @param {Array} updateArray An array containing the key and value with which to update the config.
 */
const updateConfigKey = updateArray => {
	const [key, value] = updateArray

	configTarget[key] = value
}





/**
 * Set global configuration for the library.
 *
 * @memberof module:Rafael
 * @param {*} options All options.
 */
export const updateConfig = options => {
	Object
		.entries(options)
		.forEach(updateConfigKey)
}
