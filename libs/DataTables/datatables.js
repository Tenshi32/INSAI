/*
 * This combined file was created by the DataTables downloader builder:
 *   https://datatables.net/download
 *
 * To rebuild or modify this file with the latest versions of the included
 * software please visit:
 *   https://datatables.net/download/#bs5/dt-2.3.7/b-3.2.6/r-3.0.8
 *
 * Included libraries:
 *   DataTables 2.3.7, Buttons 3.2.6, Responsive 3.0.8
 */


(function( factory ){
	if ( typeof define === 'function' && define.amd ) {
		// AMD
		define( ['jquery', 'datatables.net'], function ( $ ) {
			return factory( $, window, document );
		} );
	}
	else if ( typeof exports === 'object' ) {
		// CommonJS
		var jq = require('jquery');
		var cjsRequires = function (root, $) {
			if ( ! $.fn.dataTable ) {
				require('datatables.net')(root, $);
			}
		};

		if (typeof window === 'undefined') {
			module.exports = function (root, $) {
				if ( ! root ) {
					// CommonJS environments without a window global must pass a
					// root. This will give an error otherwise
					root = window;
				}

				if ( ! $ ) {
					$ = jq( root );
				}

				cjsRequires( root, $ );
				return factory( $, root, root.document );
			};
		}
		else {
			cjsRequires( window, jq );
			module.exports = factory( jq, window, window.document );
		}
	}
	else {
		// Browser
		factory( jQuery, window, document );
	}
}(function( $, window, document ) {
'use strict';
var DataTable = $.fn.dataTable;



// Used for namespacing events added to the document by each instance, so they
// can be removed on destroy
var _instCounter = 0;

// Button namespacing counter for namespacing events on individual buttons
var _buttonCounter = 0;

var _dtButtons = DataTable.ext.buttons;

// Custom entity decoder for data export
var _entityDecoder = null;

// Allow for jQuery slim
function _fadeIn(el, duration, fn) {
	if ($.fn.animate) {
		el.stop().fadeIn(duration, fn);
	}
	else {
		el.css('display', 'block');

		if (fn) {
			fn.call(el);
		}
	}
}

function _fadeOut(el, duration, fn) {
	if ($.fn.animate) {
		el.stop().fadeOut(duration, fn);
	}
	else {
		el.css('display', 'none');

		if (fn) {
			fn.call(el);
		}
	}
}

/**
 * [Buttons description]
 * @param {[type]}
 * @param {[type]}
 */
var Buttons = function (dt, config) {
	if (!DataTable.versionCheck('2')) {
		throw 'Warning: Buttons requires DataTables 2 or newer';
	}

	// If not created with a `new` keyword then we return a wrapper function that
	// will take the settings object for a DT. This allows easy use of new instances
	// with the `layout` option - e.g. `topLeft: $.fn.dataTable.Buttons( ... )`.
	if (!(this instanceof Buttons)) {
		return function (settings) {
			return new Buttons(settings, dt).container();
		};
	}

	// If there is no config set it to an empty object
	if (typeof config === 'undefined') {
		config = {};
	}

	// Allow a boolean true for defaults
	if (config === true) {
		config = {};
	}

	// For easy configuration of buttons an array can be given
	if (Array.isArray(config)) {
		config = { buttons: config };
	}

	this.c = $.extend(true, {}, Buttons.defaults, config);

	// Don't want a deep copy for the buttons
	if (config.buttons) {
		this.c.buttons = config.buttons;
	}

	this.s = {
		dt: new DataTable.Api(dt),
		buttons: [],
		listenKeys: '',
		namespace: 'dtb' + _instCounter++
	};

	this.dom = {
		container: $('<' + this.c.dom.container.tag + '/>').addClass(
			this.c.dom.container.className
		)
	};

	this._constructor();
};

$.extend(Buttons.prototype, {
	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	 * Public methods
	 */

	/**
	 * Get the action of a button
	 * @param  {int|string} Button index
	 * @return {function}
	 */ /**
	 * Set the action of a button
	 * @param  {node} node Button element
	 * @param  {function} action Function to set
	 * @return {Buttons} Self for chaining
	 */
	action: function (node, action) {
		var button = this._nodeToButton(node);

		if (action === undefined) {
			return button.conf.action;
		}

		button.conf.action = action;

		return this;
	},

	/**
	 * Add an active class to the button to make to look active or get current
	 * active state.
	 * @param  {node} node Button element
	 * @param  {boolean} [flag] Enable / disable flag
	 * @return {Buttons} Self for chaining or boolean for getter
	 */
	active: function (node, flag) {
		var button = this._nodeToButton(node);
		var klass = this.c.dom.button.active;
		var jqNode = $(button.node);

		if (
			button.inCollection &&
			this.c.dom.collection.button &&
			this.c.dom.collection.button.active !== undefined
		) {
			klass = this.c.dom.collection.button.active;
		}

		if (flag === undefined) {
			return jqNode.hasClass(klass);
		}

		jqNode.toggleClass(klass, flag === undefined ? true : flag);

		return this;
	},

	/**
	 * Add a new button
	 * @param {object} config Button configuration object, base string name or function
	 * @param {int|string} [idx] Button index for where to insert the button
	 * @param {boolean} [draw=true] Trigger a draw. Set a false when adding
	 *   lots of buttons, until the last button.
	 * @return {Buttons} Self for chaining
	 */
	add: function (config, idx, draw) {
		var buttons = this.s.buttons;

		if (typeof idx === 'string') {
			var split = idx.split('-');
			var base = this.s;

			for (var i = 0, ien = split.length - 1; i < ien; i++) {
				base = base.buttons[split[i] * 1];
			}

			buttons = base.buttons;
			idx = split[split.length - 1] * 1;
		}

		let node = this._expandButton(
			buttons,
			config,
			config !== undefined ? config.split : undefined,
			(config === undefined ||
				config.split === undefined ||
				config.split.length === 0) &&
				base !== undefined,
			false,
			idx
		);

		if (draw === undefined || draw === true) {
			this._draw();
		}

		return node;
	},

	/**
	 * Clear buttons from a collection and then insert new buttons
	 */
	collectionRebuild: function (node, newButtons) {
		var button = this._nodeToButton(node);

		if (newButtons !== undefined) {
			var i;
			// Need to reverse the array
			for (i = button.buttons.length - 1; i >= 0; i--) {
				this.remove(button.buttons[i].node);
			}

			// If the collection has prefix and / or postfix buttons we need to add them in
			if (button.conf.prefixButtons) {
				newButtons.unshift.apply(newButtons, button.conf.prefixButtons);
			}

			if (button.conf.postfixButtons) {
				newButtons.push.apply(newButtons, button.conf.postfixButtons);
			}

			for (i = 0; i < newButtons.length; i++) {
				var newBtn = newButtons[i];

				this._expandButton(
					button.buttons,
					newBtn,
					newBtn !== undefined &&
						newBtn.config !== undefined &&
						newBtn.config.split !== undefined,
					true,
					newBtn.parentConf !== undefined &&
						newBtn.parentConf.split !== undefined,
					null,
					newBtn.parentConf
				);
			}
		}

		this._draw(button.collection, button.buttons);
	},

	/**
	 * Get the container node for the buttons
	 * @return {jQuery} Buttons node
	 */
	container: function () {
		return this.dom.container;
	},

	/**
	 * Disable a button
	 * @param  {node} node Button node
	 * @return {Buttons} Self for chaining
	 */
	disable: function (node) {
		var button = this._nodeToButton(node);

		if (button.isSplit) {
			$(button.node.childNodes[0])
				.addClass(this.c.dom.button.disabled)
				.prop('disabled', true);
		}
		else {
			$(button.node)
				.addClass(this.c.dom.button.disabled)
				.prop('disabled', true);
		}

		button.disabled = true;

		this._checkSplitEnable();

		return this;
	},

	/**
	 * Destroy the instance, cleaning up event handlers and removing DOM
	 * elements
	 * @return {Buttons} Self for chaining
	 */
	destroy: function () {
		// Key event listener
		$('body').off('keyup.' + this.s.namespace);

		// Individual button destroy (so they can remove their own events if
		// needed). Take a copy as the array is modified by `remove`
		var buttons = this.s.buttons.slice();
		var i, ien;

		for (i = 0, ien = buttons.length; i < ien; i++) {
			this.remove(buttons[i].node);
		}

		// Container
		this.dom.container.remove();

		// Remove from the settings object collection
		var buttonInsts = this.s.dt.settings()[0];

		for (i = 0, ien = buttonInsts.length; i < ien; i++) {
			if (buttonInsts.inst === this) {
				buttonInsts.splice(i, 1);
				break;
			}
		}

		return this;
	},

	/**
	 * Enable / disable a button
	 * @param  {node} node Button node
	 * @param  {boolean} [flag=true] Enable / disable flag
	 * @return {Buttons} Self for chaining
	 */
	enable: function (node, flag) {
		if (flag === false) {
			return this.disable(node);
		}

		var button = this._nodeToButton(node);

		if (button.isSplit) {
			$(button.node.childNodes[0])
				.removeClass(this.c.dom.button.disabled)
				.prop('disabled', false);
		}
		else {
			$(button.node)
				.removeClass(this.c.dom.button.disabled)
				.prop('disabled', false);
		}

		button.disabled = false;

		this._checkSplitEnable();

		return this;
	},

	/**
	 * Get a button's index
	 *
	 * This is internally recursive
	 * @param {element} node Button to get the index of
	 * @return {string} Button index
	 */
	index: function (node, nested, buttons) {
		if (!nested) {
			nested = '';
			buttons = this.s.buttons;
		}

		for (var i = 0, ien = buttons.length; i < ien; i++) {
			var inner = buttons[i].buttons;

			if (buttons[i].node === node) {
				return nested + i;
			}

			if (inner && inner.length) {
				var match = this.index(node, i + '-', inner);

				if (match !== null) {
					return match;
				}
			}
		}

		return null;
	},

	/**
	 * Get the instance name for the button set selector
	 * @return {string} Instance name
	 */
	name: function () {
		return this.c.name;
	},

	/**
	 * Get a button's node of the buttons container if no button is given
	 * @param  {node} [node] Button node
	 * @return {jQuery} Button element, or container
	 */
	node: function (node) {
		if (!node) {
			return this.dom.container;
		}

		var button = this._nodeToButton(node);
		return $(button.node);
	},

	/**
	 * Set / get a processing class on the selected button
	 * @param {element} node Triggering button node
	 * @param  {boolean} flag true to add, false to remove, undefined to get
	 * @return {boolean|Buttons} Getter value or this if a setter.
	 */
	processing: function (node, flag) {
		var dt = this.s.dt;
		var button = this._nodeToButton(node);

		if (flag === undefined) {
			return $(button.node).hasClass('processing');
		}

		$(button.node).toggleClass('processing', flag);

		$(dt.table().node()).triggerHandler('buttons-processing.dt', [
			flag,
			dt.button(node),
			dt,
			$(node),
			button.conf
		]);

		return this;
	},

	/**
	 * Remove a button.
	 * @param  {node} node Button node
	 * @return {Buttons} Self for chaining
	 */
	remove: function (node) {
		var button = this._nodeToButton(node);
		var host = this._nodeToHost(node);
		var dt = this.s.dt;

		// Remove any child buttons first
		if (button.buttons.length) {
			for (var i = button.buttons.length - 1; i >= 0; i--) {
				this.remove(button.buttons[i].node);
			}
		}

		button.conf.destroying = true;

		// Allow the button to remove event handlers, etc
		if (button.conf.destroy) {
			button.conf.destroy.call(dt.button(node), dt, $(node), button.conf);
		}

		this._removeKey(button.conf);

		$(button.node).remove();

		if (button.inserter) {
			$(button.inserter).remove();
		}

		var idx = $.inArray(button, host);
		host.splice(idx, 1);

		return this;
	},

	/**
	 * Get the text for a button
	 * @param  {int|string} node Button index
	 * @return {string} Button text
	 */ /**
	 * Set the text for a button
	 * @param  {int|string|function} node Button index
	 * @param  {string} label Text
	 * @return {Buttons} Self for chaining
	 */
	text: function (node, label) {
		var button = this._nodeToButton(node);
		var textNode = button.textNode;
		var dt = this.s.dt;
		var jqNode = $(button.node);
		var text = function (opt) {
			return typeof opt === 'function'
				? opt(dt, jqNode, button.conf)
				: opt;
		};

		if (label === undefined) {
			return text(button.conf.text);
		}

		button.conf.text = label;
		textNode.html(text(label));

		return this;
	},

	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	 * Constructor
	 */

	/**
	 * Buttons constructor
	 * @private
	 */
	_constructor: function () {
		var that = this;
		var dt = this.s.dt;
		var dtSettings = dt.settings()[0];
		var buttons = this.c.buttons;

		if (!dtSettings._buttons) {
			dtSettings._buttons = [];
		}

		dtSettings._buttons.push({
			inst: this,
			name: this.c.name
		});

		for (var i = 0, ien = buttons.length; i < ien; i++) {
			this.add(buttons[i]);
		}

		dt.on('destroy', function (e, settings) {
			if (settings === dtSettings) {
				that.destroy();
			}
		});

		// Global key event binding to listen for button keys
		$('body').on('keyup.' + this.s.namespace, function (e) {
			if (
				!document.activeElement ||
				document.activeElement === document.body
			) {
				// SUse a string of characters for fast lookup of if we need to
				// handle this
				var character = String.fromCharCode(e.keyCode).toLowerCase();

				if (that.s.listenKeys.toLowerCase().indexOf(character) !== -1) {
					that._keypress(character, e);
				}
			}
		});
	},

	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	 * Private methods
	 */

	/**
	 * Add a new button to the key press listener
	 * @param {object} conf Resolved button configuration object
	 * @private
	 */
	_addKey: function (conf) {
		if (conf.key) {
			this.s.listenKeys += $.isPlainObject(conf.key)
				? conf.key.key
				: conf.key;
		}
	},

	/**
	 * Insert the buttons into the container. Call without parameters!
	 * @param  {node} [container] Recursive only - Insert point
	 * @param  {array} [buttons] Recursive only - Buttons array
	 * @private
	 */
	_draw: function (container, buttons) {
		if (!container) {
			container = this.dom.container;
			buttons = this.s.buttons;
		}

		container.children().detach();

		for (var i = 0, ien = buttons.length; i < ien; i++) {
			container.append(buttons[i].inserter);
			container.append(' ');

			if (buttons[i].buttons && buttons[i].buttons.length) {
				this._draw(buttons[i].collection, buttons[i].buttons);
			}
		}
	},

	/**
	 * Create buttons from an array of buttons
	 * @param  {array} attachTo Buttons array to attach to
	 * @param  {object} button Button definition
	 * @param  {boolean} inCollection true if the button is in a collection
	 * @private
	 */
	_expandButton: function (
		attachTo,
		button,
		split,
		inCollection,
		inSplit,
		attachPoint,
		parentConf
	) {
		var dt = this.s.dt;
		var isSplit = false;
		var domCollection = this.c.dom.collection;
		var buttons = !Array.isArray(button) ? [button] : button;
		var lastButton;

		if (button === undefined) {
			buttons = !Array.isArray(split) ? [split] : split;
		}

		for (var i = 0, ien = buttons.length; i < ien; i++) {
			var conf = this._resolveExtends(buttons[i]);

			if (!conf) {
				continue;
			}

			isSplit = conf.config && conf.config.split ? true : false;

			// If the configuration is an array, then expand the buttons at this
			// point
			if (Array.isArray(conf)) {
				this._expandButton(
					attachTo,
					conf,
					built !== undefined && built.conf !== undefined
						? built.conf.split
						: undefined,
					inCollection,
					parentConf !== undefined && parentConf.split !== undefined,
					attachPoint,
					parentConf
				);
				continue;
			}

			var built = this._buildButton(
				conf,
				inCollection,
				conf.split !== undefined ||
					(conf.config !== undefined &&
						conf.config.split !== undefined),
				inSplit
			);
			if (!built) {
				continue;
			}

			if (attachPoint !== undefined && attachPoint !== null) {
				attachTo.splice(attachPoint, 0, built);
				attachPoint++;
			}
			else {
				attachTo.push(built);
			}

			// Any button type can have a drop icon set
			if (built.conf.dropIcon && ! built.conf.split) {
				$(built.node)
					.addClass(this.c.dom.button.dropClass)
					.append(this.c.dom.button.dropHtml);
			}

			// Create the dropdown for a collection
			if (built.conf.buttons) {
				built.collection = $(
					'<' + domCollection.container.content.tag + '/>'
				);
				built.conf._collection = built.collection;

				this._expandButton(
					built.buttons,
					built.conf.buttons,
					built.conf.split,
					!isSplit,
					isSplit,
					attachPoint,
					built.conf
				);
			}

			// And the split collection
			if (built.conf.split) {
				built.collection = $('<' + domCollection.container.tag + '/>');
				built.conf._collection = built.collection;

				for (var j = 0; j < built.conf.split.length; j++) {
					var item = built.conf.split[j];

					if (typeof item === 'object') {
						item.parent = parentConf;

						if (item.collectionLayout === undefined) {
							item.collectionLayout = built.conf.collectionLayout;
						}

						if (item.dropup === undefined) {
							item.dropup = built.conf.dropup;
						}

						if (item.fade === undefined) {
							item.fade = built.conf.fade;
						}
					}
				}

				this._expandButton(
					built.buttons,
					built.conf.buttons,
					built.conf.split,
					!isSplit,
					isSplit,
					attachPoint,
					built.conf
				);
			}

			built.conf.parent = parentConf;

			// init call is made here, rather than buildButton as it needs to
			// be selectable, and for that it needs to be in the buttons array
			if (conf.init) {
				conf.init.call(dt.button(built.node), dt, $(built.node), conf);
			}

			lastButton = built.node;
		}

		return lastButton;
	},

	/**
	 * Create an individual button
	 * @param  {object} config            Resolved button configuration
	 * @param  {boolean} inCollection `true` if a collection button
	 * @return {object} Completed button description object
	 * @private
	 */
	_buildButton: function (config, inCollection, isSplit, inSplit) {
		var that = this;
		var configDom = this.c.dom;
		var textNode;
		var dt = this.s.dt;
		var setLinerTab = false;
		var text = function (opt) {
			return typeof opt === 'function' ? opt(dt, button, config) : opt;
		};

		// Create an object that describes the button which can be in `dom.button`, or
		// `dom.collection.button` or `dom.split.button` or `dom.collection.split.button`!
		// Each should extend from `dom.button`.
		var dom = $.extend(true, {}, configDom.button);

		if (inCollection && isSplit && configDom.collection.split) {
			$.extend(true, dom, configDom.collection.split.action);
		}
		else if (inSplit || inCollection) {
			$.extend(true, dom, configDom.collection.button);
		}
		else if (isSplit) {
			$.extend(true, dom, configDom.split.button);
		}

		// Spacers don't do much other than insert an element into the DOM
		if (config.spacer) {
			var spacer = $('<' + dom.spacer.tag + '/>')
				.addClass(
					'dt-button-spacer ' +
						config.style +
						' ' +
						dom.spacer.className
				)
				.html(text(config.text));

			return {
				conf: config,
				node: spacer,
				nodeChild: null,
				inserter: spacer,
				buttons: [],
				inCollection: inCollection,
				isSplit: isSplit,
				collection: null,
				textNode: spacer
			};
		}

		// Make sure that the button is available based on whatever requirements
		// it has. For example, PDF button require pdfmake
		if (
			config.available &&
			!config.available(dt, config) &&
			!config.html
		) {
			return false;
		}

		var button;

		if (!config.html) {
			var run = function (e, dt, button, config, done) {
				config.action.call(dt.button(button), e, dt, button, config, done);

				$(dt.table().node()).triggerHandler('buttons-action.dt', [
					dt.button(button),
					dt,
					button,
					config
				]);
			};

			var action = function(e, dt, button, config) {
				if (config.async) {
					that.processing(button[0], true);

					setTimeout(function () {
						run(e, dt, button, config, function () {
							that.processing(button[0], false);
						});
					}, config.async);
				}
				else {
					run(e, dt, button, config, function () {});
				}
			};

			var tag = config.tag || dom.tag;
			var clickBlurs =
				config.clickBlurs === undefined ? true : config.clickBlurs;

			button = $('<' + tag + '/>')
				.addClass(dom.className)
				.attr('aria-controls', this.s.dt.table().node().id)
				.on('click.dtb', function (e) {
					e.preventDefault();

					if (!button.hasClass(dom.disabled) && config.action) {
						action(e, dt, button, config);
					}

					if (clickBlurs) {
						button.trigger('blur');
					}
				})
				.on('keypress.dtb', function (e) {
					if (e.keyCode === 13) {
						e.preventDefault();

						if (!button.hasClass(dom.disabled) && config.action) {
							action(e, dt, button, config);
						}
					}
				});

			// Make `a` tags act like a link
			if (tag.toLowerCase() === 'a') {
				button.attr('href', '#');
			}

			// Button tags should have `type=button` so they don't have any default behaviour
			if (tag.toLowerCase() === 'button') {
				button.attr('type', 'button');
			}

			if (dom.liner.tag) {
				var lc = dom.liner.tag.toLowerCase();
				var liner = $('<' + lc + '/>')
					.html(text(config.text))
					.addClass(dom.liner.className);

				if (lc === 'a') {
					liner.attr('href', '#');
				}

				if (lc === 'a' || lc === 'button') {
					liner.attr('tabindex', this.s.dt.settings()[0].iTabIndex);
					setLinerTab = true;
				}

				button.append(liner);
				textNode = liner;
			}
			else {
				button.html(text(config.text));
				textNode = button;
			}

			if (! setLinerTab) {
				button.attr('tabindex', this.s.dt.settings()[0].iTabIndex)
			}

			if (config.enabled === false) {
				button.addClass(dom.disabled);
			}

			if (config.className) {
				button.addClass(config.className);
			}

			if (config.titleAttr) {
				button.attr('title', text(config.titleAttr));
			}

			if (config.attr) {
				button.attr(config.attr);
			}

			if (!config.namespace) {
				config.namespace = '.dt-button-' + _buttonCounter++;
			}

			if (config.config !== undefined && config.config.split) {
				config.split = config.config.split;
			}
		}
		else {
			button = $(config.html);
		}

		var buttonContainer = this.c.dom.buttonContainer;
		var inserter;
		if (buttonContainer && buttonContainer.tag) {
			inserter = $('<' + buttonContainer.tag + '/>')
				.addClass(buttonContainer.className)
				.append(button);
		}
		else {
			inserter = button;
		}

		this._addKey(config);

		// Style integration callback for DOM manipulation
		// Note that this is _not_ documented. It is currently
		// for style integration only
		if (this.c.buttonCreated) {
			inserter = this.c.buttonCreated(config, inserter);
		}

		var splitDiv;

		if (isSplit) {
			var dropdownConf = inCollection
				? $.extend(true, this.c.dom.split, this.c.dom.collection.split)
				: this.c.dom.split;
			var wrapperConf = dropdownConf.wrapper;

			splitDiv = $('<' + wrapperConf.tag + '/>')
				.addClass(wrapperConf.className)
				.append(button);

			var dropButtonConfig = $.extend(config, {
				autoClose: true,
				align: dropdownConf.dropdown.align,
				attr: {
					'aria-haspopup': 'dialog',
					'aria-expanded': false
				},
				className: dropdownConf.dropdown.className,
				closeButton: false,
				splitAlignClass: dropdownConf.dropdown.splitAlignClass,
				text: dropdownConf.dropdown.text
			});

			this._addKey(dropButtonConfig);

			var splitAction = function (e, dt, button, config) {
				_dtButtons.split.action.call(
					dt.button(splitDiv),
					e,
					dt,
					button,
					config
				);

				$(dt.table().node()).triggerHandler('buttons-action.dt', [
					dt.button(button),
					dt,
					button,
					config
				]);
				button.attr('aria-expanded', true);
			};

			var dropButton = $(
				'<button class="' +
					dropdownConf.dropdown.className +
					' dt-button"></button>'
			)
				.html(this.c.dom.button.dropHtml)
				.addClass(this.c.dom.button.dropClass)
				.on('click.dtb', function (e) {
					e.preventDefault();
					e.stopPropagation();

					if (!dropButton.hasClass(dom.disabled)) {
						splitAction(e, dt, dropButton, dropButtonConfig);
					}
					if (clickBlurs) {
						dropButton.trigger('blur');
					}
				})
				.on('keypress.dtb', function (e) {
					if (e.keyCode === 13) {
						e.preventDefault();

						if (!dropButton.hasClass(dom.disabled)) {
							splitAction(e, dt, dropButton, dropButtonConfig);
						}
					}
				});

			if (config.split.length === 0) {
				dropButton.addClass('dtb-hide-drop');
			}

			splitDiv.append(dropButton).attr(dropButtonConfig.attr);
		}

		var node = isSplit ? splitDiv.get(0) : button.get(0);

		return {
			conf: config,
			node: node,
			nodeChild: node && node.children && node.children.length ? node.children[0] : null,
			inserter: isSplit ? splitDiv : inserter,
			buttons: [],
			inCollection: inCollection,
			isSplit: isSplit,
			inSplit: inSplit,
			collection: null,
			textNode: textNode
		};
	},

	/**
	 * Spin over buttons checking if splits should be enabled or not.
	 * @param {*} buttons Array of buttons to check
	 */
	_checkSplitEnable: function (buttons) {
		if (! buttons) {
			buttons = this.s.buttons;
		}

		for (var i=0 ; i<buttons.length ; i++) {
			var button = buttons[i];

			// Check if the button is a split one and if so, determine
			// its state
			if (button.isSplit) {
				var splitBtn = button.node.childNodes[1];

				if (this._checkAnyEnabled(button.buttons)) {
					// Enable the split
					$(splitBtn)
						.removeClass(this.c.dom.button.disabled)
						.prop('disabled', false);
				}
				else {
					$(splitBtn)
						.addClass(this.c.dom.button.disabled)
						.prop('disabled', false);
				}
			}
			else if (button.isCollection) {
				// Nest down into collections
				this._checkSplitEnable(button.buttons);
			}
		}
	},

	/**
	 * Check an array of buttons and see if any are enabled in it
	 * @param {*} buttons Button array
	 * @returns true if a button is enabled, false otherwise
	 */
	_checkAnyEnabled: function (buttons) {
		for (var i=0 ; i<buttons.length ; i++) {
			if (! buttons[i].disabled) {
				return true;
			}
		}

		return false;
	},

	/**
	 * Get the button object from a node (recursive)
	 * @param  {node} node Button node
	 * @param  {array} [buttons] Button array, uses base if not defined
	 * @return {object} Button object
	 * @private
	 */
	_nodeToButton: function (node, buttons) {
		if (!buttons) {
			buttons = this.s.buttons;
		}

		for (var i = 0, ien = buttons.length; i < ien; i++) {
			if (buttons[i].node === node || buttons[i].nodeChild === node) {
				return buttons[i];
			}

			if (buttons[i].buttons.length) {
				var ret = this._nodeToButton(node, buttons[i].buttons);

				if (ret) {
					return ret;
				}
			}
		}
	},

	/**
	 * Get container array for a button from a button node (recursive)
	 * @param  {node} node Button node
	 * @param  {array} [buttons] Button array, uses base if not defined
	 * @return {array} Button's host array
	 * @private
	 */
	_nodeToHost: function (node, buttons) {
		if (!buttons) {
			buttons = this.s.buttons;
		}

		for (var i = 0, ien = buttons.length; i < ien; i++) {
			if (buttons[i].node === node) {
				return buttons;
			}

			if (buttons[i].buttons.length) {
				var ret = this._nodeToHost(node, buttons[i].buttons);

				if (ret) {
					return ret;
				}
			}
		}
	},

	/**
	 * Handle a key press - determine if any button's key configured matches
	 * what was typed and trigger the action if so.
	 * @param  {string} character The character pressed
	 * @param  {object} e Key event that triggered this call
	 * @private
	 */
	_keypress: function (character, e) {
		// Check if this button press already activated on another instance of Buttons
		if (e._buttonsHandled) {
			return;
		}

		var run = function (conf, node) {
			if (!conf.key) {
				return;
			}

			if (conf.key === character) {
				e._buttonsHandled = true;
				$(node).click();
			}
			else if ($.isPlainObject(conf.key)) {
				if (conf.key.key !== character) {
					return;
				}

				if (conf.key.shiftKey && !e.shiftKey) {
					return;
				}

				if (conf.key.altKey && !e.altKey) {
					return;
				}

				if (conf.key.ctrlKey && !e.ctrlKey) {
					return;
				}

				if (conf.key.metaKey && !e.metaKey) {
					return;
				}

				// Made it this far - it is good
				e._buttonsHandled = true;
				$(node).click();
			}
		};

		var recurse = function (a) {
			for (var i = 0, ien = a.length; i < ien; i++) {
				run(a[i].conf, a[i].node);

				if (a[i].buttons.length) {
					recurse(a[i].buttons);
				}
			}
		};

		recurse(this.s.buttons);
	},

	/**
	 * Remove a key from the key listener for this instance (to be used when a
	 * button is removed)
	 * @param  {object} conf Button configuration
	 * @private
	 */
	_removeKey: function (conf) {
		if (conf.key) {
			var character = $.isPlainObject(conf.key) ? conf.key.key : conf.key;

			// Remove only one character, as multiple buttons could have the
			// same listening key
			var a = this.s.listenKeys.split('');
			var idx = $.inArray(character, a);
			a.splice(idx, 1);
			this.s.listenKeys = a.join('');
		}
	},

	/**
	 * Resolve a button configuration
	 * @param  {string|function|object} conf Button config to resolve
	 * @return {object} Button configuration
	 * @private
	 */
	_resolveExtends: function (conf) {
		var that = this;
		var dt = this.s.dt;
		var i, ien;
		var toConfObject = function (base) {
			var loop = 0;

			// Loop until we have resolved to a button configuration, or an
			// array of button configurations (which will be iterated
			// separately)
			while (!$.isPlainObject(base) && !Array.isArray(base)) {
				if (base === undefined) {
					return;
				}

				if (typeof base === 'function') {
					base = base.call(that, dt, conf);

					if (!base) {
						return false;
					}
				}
				else if (typeof base === 'string') {
					if (!_dtButtons[base]) {
						return { html: base };
					}

					base = _dtButtons[base];
				}

				loop++;
				if (loop > 30) {
					// Protect against misconfiguration killing the browser
					throw 'Buttons: Too many iterations';
				}
			}

			return Array.isArray(base) ? base : $.extend({}, base);
		};

		conf = toConfObject(conf);

		while (conf && conf.extend) {
			// Use `toConfObject` in case the button definition being extended
			// is itself a string or a function
			if (!_dtButtons[conf.extend]) {
				throw 'Cannot extend unknown button type: ' + conf.extend;
			}

			var objArray = toConfObject(_dtButtons[conf.extend]);
			if (Array.isArray(objArray)) {
				return objArray;
			}
			else if (!objArray) {
				// This is a little brutal as it might be possible to have a
				// valid button without the extend, but if there is no extend
				// then the host button would be acting in an undefined state
				return false;
			}

			// Stash the current class name
			var originalClassName = objArray.className;

			if (conf.config !== undefined && objArray.config !== undefined) {
				conf.config = $.extend({}, objArray.config, conf.config);
			}

			conf = $.extend({}, objArray, conf);

			// The extend will have overwritten the original class name if the
			// `conf` object also assigned a class, but we want to concatenate
			// them so they are list that is combined from all extended buttons
			if (originalClassName && conf.className !== originalClassName) {
				conf.className = originalClassName + ' ' + conf.className;
			}

			// Although we want the `conf` object to overwrite almost all of
			// the properties of the object being extended, the `extend`
			// property should come from the object being extended
			conf.extend = objArray.extend;
		}

		// Buttons to be added to a collection  -gives the ability to define
		// if buttons should be added to the start or end of a collection
		var postfixButtons = conf.postfixButtons;
		if (postfixButtons) {
			if (!conf.buttons) {
				conf.buttons = [];
			}

			for (i = 0, ien = postfixButtons.length; i < ien; i++) {
				conf.buttons.push(postfixButtons[i]);
			}
		}

		var prefixButtons = conf.prefixButtons;
		if (prefixButtons) {
			if (!conf.buttons) {
				conf.buttons = [];
			}

			for (i = 0, ien = prefixButtons.length; i < ien; i++) {
				conf.buttons.splice(i, 0, prefixButtons[i]);
			}
		}

		return conf;
	},

	/**
	 * Display (and replace if there is an existing one) a popover attached to a button
	 * @param {string|node} content Content to show
	 * @param {DataTable.Api} hostButton DT API instance of the button
	 * @param {object} inOpts Options (see object below for all options)
	 */
	_popover: function (content, hostButton, inOpts) {
		var dt = hostButton;
		var c = this.c;
		var closed = false;
		var options = $.extend(
			{
				align: 'button-left', // button-right, dt-container, split-left, split-right
				autoClose: false,
				background: true,
				backgroundClassName: 'dt-button-background',
				closeButton: true,
				containerClassName: c.dom.collection.container.className,
				contentClassName: c.dom.collection.container.content.className,
				collectionLayout: '',
				collectionTitle: '',
				dropup: false,
				fade: 400,
				popoverTitle: '',
				rightAlignClassName: 'dt-button-right',
				tag: c.dom.collection.container.tag
			},
			inOpts
		);

		var containerSelector =
			options.tag + '.' + options.containerClassName.replace(/ /g, '.');
		var hostButtonNode = hostButton.node();
		var hostNode = options.collectionLayout.includes('fixed') ? $('body') : hostButton.node();

		var close = function () {
			closed = true;

			_fadeOut($(containerSelector), options.fade, function () {
				$(this).detach();
			});

			$(
				dt
					.buttons('[aria-haspopup="dialog"][aria-expanded="true"]')
					.nodes()
			).attr('aria-expanded', 'false');

			$('div.dt-button-background').off('click.dtb-collection');
			Buttons.background(
				false,
				options.backgroundClassName,
				options.fade,
				hostNode
			);

			$(window).off('resize.resize.dtb-collection');
			$('body').off('.dtb-collection');
			dt.off('buttons-action.b-internal');
			dt.off('destroy.dtb-popover');

			$('body').trigger('buttons-popover-hide.dt');
		};

		if (content === false) {
			close();
			return;
		}

		var existingExpanded = $(
			dt.buttons('[aria-haspopup="dialog"][aria-expanded="true"]').nodes()
		);
		if (existingExpanded.length) {
			// Reuse the current position if the button that was triggered is inside an existing collection
			if (hostNode.closest(containerSelector).length) {
				hostNode = existingExpanded.eq(0);
			}

			close();
		}

		// Sort buttons if defined
		if (options.sort) {
			var elements = $('button', content)
				.map(function (idx, el) {
					return {
						text: $(el).text(),
						el: el
					};
				})
				.toArray();

			elements.sort(function (a, b) {
				return a.text.localeCompare(b.text);
			});

			$(content).append(elements.map(function (v) {
				return v.el;
			}));
		}

		// Try to be smart about the layout
		var cnt = $('.dt-button', content).length;
		var mod = '';

		if (cnt === 3) {
			mod = 'dtb-b3';
		}
		else if (cnt === 2) {
			mod = 'dtb-b2';
		}
		else if (cnt === 1) {
			mod = 'dtb-b1';
		}

		var display = $('<' + options.tag + '/>')
			.addClass(options.containerClassName)
			.addClass(options.collectionLayout)
			.addClass(options.splitAlignClass)
			.addClass(mod)
			.css('display', 'none')
			.attr({
				'aria-modal': true,
				role: 'dialog'
			});

		content = $(content)
			.addClass(options.contentClassName)
			.attr('role', 'menu')
			.appendTo(display);

		hostButtonNode.attr('aria-expanded', 'true');

		if (hostNode.parents('body')[0] !== document.body) {
			hostNode = $(document.body).children('div, section, p').last();
		}

		if (options.popoverTitle) {
			display.prepend(
				'<div class="dt-button-collection-title">' +
					options.popoverTitle +
					'</div>'
			);
		}
		else if (options.collectionTitle) {
			display.prepend(
				'<div class="dt-button-collection-title">' +
					options.collectionTitle +
					'</div>'
			);
		}

		if (options.closeButton) {
			display
				.prepend('<div class="dtb-popover-close">&times;</div>')
				.addClass('dtb-collection-closeable');
		}

		_fadeIn(display.insertAfter(hostNode), options.fade);

		var tableContainer = $(hostButton.table().container());
		var position = display.css('position');

		if (options.span === 'container' || options.align === 'dt-container') {
			hostNode = hostNode.parent();
			display.css('width', tableContainer.width());
		}

		// Align the popover relative to the DataTables container
		// Useful for wide popovers such as SearchPanes
		if (position === 'absolute') {
			// Align relative to the host button
			var offsetParent = $(hostNode[0].offsetParent);
			var buttonPosition = hostNode.position();
			var buttonOffset = hostNode.offset();
			var tableSizes = offsetParent.offset();
			var containerPosition = offsetParent.position();
			var computed = window.getComputedStyle(offsetParent[0]);

			tableSizes.height = offsetParent.outerHeight();
			tableSizes.width =
				offsetParent.width() + parseFloat(computed.paddingLeft);
			tableSizes.right = tableSizes.left + tableSizes.width;
			tableSizes.bottom = tableSizes.top + tableSizes.height;

			// Set the initial position so we can read height / width
			var top = buttonPosition.top + hostNode.outerHeight();
			var left = buttonPosition.left;

			display.css({
				top: top,
				left: left
			});

			// Get the popover position
			computed = window.getComputedStyle(display[0]);
			var popoverSizes = display.offset();

			popoverSizes.height = display.outerHeight();
			popoverSizes.width = display.outerWidth();
			popoverSizes.right = popoverSizes.left + popoverSizes.width;
			popoverSizes.bottom = popoverSizes.top + popoverSizes.height;
			popoverSizes.marginTop = parseFloat(computed.marginTop);
			popoverSizes.marginBottom = parseFloat(computed.marginBottom);

			// First position per the class requirements - pop up and right align
			if (options.dropup) {
				top =
					buttonPosition.top -
					popoverSizes.height -
					popoverSizes.marginTop -
					popoverSizes.marginBottom;
			}

			if (
				options.align === 'button-right' ||
				display.hasClass(options.rightAlignClassName)
			) {
				left =
					buttonPosition.left -
					popoverSizes.width +
					hostNode.outerWidth();
			}

			// Container alignment - make sure it doesn't overflow the table container
			if (
				options.align === 'dt-container' ||
				options.align === 'container'
			) {
				if (left < buttonPosition.left) {
					left = -buttonPosition.left;
				}
			}

			// Window adjustment
			if (
				containerPosition.left + left + popoverSizes.width >
				$(window).width()
			) {
				// Overflowing the document to the right
				left =
					$(window).width() -
					popoverSizes.width -
					containerPosition.left;
			}

			if (buttonOffset.left + left < 0) {
				// Off to the left of the document
				left = -buttonOffset.left;
			}

			if (
				containerPosition.top + top + popoverSizes.height >
				$(window).height() + $(window).scrollTop()
			) {
				// Pop up if otherwise we'd need the user to scroll down
				top =
					buttonPosition.top -
					popoverSizes.height -
					popoverSizes.marginTop -
					popoverSizes.marginBottom;
			}

			if (offsetParent.offset().top + top < $(window).scrollTop()) {
				// Correction for when the top is beyond the top of the page
				top = buttonPosition.top + hostNode.outerHeight();
			}

			// Calculations all done - now set it
			display.css({
				top: top,
				left: left
			});
		}
		else {
			// Fix position - centre on screen
			var place = function () {
				var half = $(window).height() / 2;

				var top = display.height() / 2;
				if (top > half) {
					top = half;
				}

				display.css('marginTop', top * -1);
			};

			place();

			$(window).on('resize.dtb-collection', function () {
				place();
			});
		}

		if (options.background) {
			Buttons.background(
				true,
				options.backgroundClassName,
				options.fade,
				options.backgroundHost || hostNode
			);
		}

		// This is bonkers, but if we don't have a click listener on the
		// background element, iOS Safari will ignore the body click
		// listener below. An empty function here is all that is
		// required to make it work...
		$('div.dt-button-background').on(
			'click.dtb-collection',
			function () {}
		);

		if (options.autoClose) {
			setTimeout(function () {
				dt.on('buttons-action.b-internal', function (e, btn, dt, node) {
					if (node[0] === hostNode[0]) {
						return;
					}
					close();
				});
			}, 0);
		}

		$(display).trigger('buttons-popover.dt');

		dt.on('destroy.dtb-popover', close);

		setTimeout(function () {
			closed = false;
			$('body')
				.on('click.dtb-collection', function (e) {
					if (closed) {
						return;
					}

					// andSelf is deprecated in jQ1.8, but we want 1.7 compat
					var back = $.fn.addBack ? 'addBack' : 'andSelf';
					var parent = $(e.target).parent()[0];

					if (
						(!$(e.target).parents()[back]().filter(content)
							.length &&
							!$(parent).hasClass('dt-buttons')) ||
						$(e.target).hasClass('dt-button-background')
					) {
						close();
					}
				})
				.on('keyup.dtb-collection', function (e) {
					if (e.keyCode === 27) {
						close();
					}
				})
				.on('keydown.dtb-collection', function (e) {
					// Focus trap for tab key
					var elements = $('a, button', content);
					var active = document.activeElement;

					if (e.keyCode !== 9) {
						// tab
						return;
					}

					if (elements.index(active) === -1) {
						// If current focus is not inside the popover
						elements.first().focus();
						e.preventDefault();
					}
					else if (e.shiftKey) {
						// Reverse tabbing order when shift key is pressed
						if (active === elements[0]) {
							elements.last().focus();
							e.preventDefault();
						}
					}
					else {
						if (active === elements.last()[0]) {
							elements.first().focus();
							e.preventDefault();
						}
					}
				});
		}, 0);
	}
});

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Statics
 */

/**
 * Show / hide a background layer behind a collection
 * @param  {boolean} Flag to indicate if the background should be shown or
 *   hidden
 * @param  {string} Class to assign to the background
 * @static
 */
Buttons.background = function (show, className, fade, insertPoint) {
	if (fade === undefined) {
		fade = 400;
	}
	if (!insertPoint) {
		insertPoint = document.body;
	}

	if (show) {
		_fadeIn(
			$('<div/>')
				.addClass(className)
				.css('display', 'none')
				.insertAfter(insertPoint),
			fade
		);
	}
	else {
		_fadeOut($('div.' + className), fade, function () {
			$(this).removeClass(className).remove();
		});
	}
};

/**
 * Instance selector - select Buttons instances based on an instance selector
 * value from the buttons assigned to a DataTable. This is only useful if
 * multiple instances are attached to a DataTable.
 * @param  {string|int|array} Instance selector - see `instance-selector`
 *   documentation on the DataTables site
 * @param  {array} Button instance array that was attached to the DataTables
 *   settings object
 * @return {array} Buttons instances
 * @static
 */
Buttons.instanceSelector = function (group, buttons) {
	if (group === undefined || group === null) {
		return $.map(buttons, function (v) {
			return v.inst;
		});
	}

	var ret = [];
	var names = $.map(buttons, function (v) {
		return v.name;
	});

	// Flatten the group selector into an array of single options
	var process = function (input) {
		if (Array.isArray(input)) {
			for (var i = 0, ien = input.length; i < ien; i++) {
				process(input[i]);
			}
			return;
		}

		if (typeof input === 'string') {
			if (input.indexOf(',') !== -1) {
				// String selector, list of names
				process(input.split(','));
			}
			else {
				// String selector individual name
				var idx = $.inArray(input.trim(), names);

				if (idx !== -1) {
					ret.push(buttons[idx].inst);
				}
			}
		}
		else if (typeof input === 'number') {
			// Index selector
			ret.push(buttons[input].inst);
		}
		else if (typeof input === 'object' && input.nodeName) {
			// Element selector
			for (var j = 0; j < buttons.length; j++) {
				if (buttons[j].inst.dom.container[0] === input) {
					ret.push(buttons[j].inst);
				}
			}
		}
		else if (typeof input === 'object') {
			// Actual instance selector
			ret.push(input);
		}
	};

	process(group);

	return ret;
};

/**
 * Button selector - select one or more buttons from a selector input so some
 * operation can be performed on them.
 * @param  {array} Button instances array that the selector should operate on
 * @param  {string|int|node|jQuery|array} Button selector - see
 *   `button-selector` documentation on the DataTables site
 * @return {array} Array of objects containing `inst` and `idx` properties of
 *   the selected buttons so you know which instance each button belongs to.
 * @static
 */
Buttons.buttonSelector = function (insts, selector) {
	var ret = [];
	var nodeBuilder = function (a, buttons, baseIdx) {
		var button;
		var idx;

		for (var i = 0, ien = buttons.length; i < ien; i++) {
			button = buttons[i];

			if (button) {
				idx = baseIdx !== undefined ? baseIdx + i : i + '';

				a.push({
					node: button.node,
					name: button.conf.name,
					idx: idx
				});

				if (button.buttons) {
					nodeBuilder(a, button.buttons, idx + '-');
				}
			}
		}
	};

	var run = function (selector, inst) {
		var i, ien;
		var buttons = [];
		nodeBuilder(buttons, inst.s.buttons);

		var nodes = $.map(buttons, function (v) {
			return v.node;
		});

		if (Array.isArray(selector) || selector instanceof $) {
			for (i = 0, ien = selector.length; i < ien; i++) {
				run(selector[i], inst);
			}
			return;
		}

		if (selector === null || selector === undefined || selector === '*') {
			// Select all
			for (i = 0, ien = buttons.length; i < ien; i++) {
				ret.push({
					inst: inst,
					node: buttons[i].node
				});
			}
		}
		else if (typeof selector === 'number') {
			// Main button index selector
			if (inst.s.buttons[selector]) {
				ret.push({
					inst: inst,
					node: inst.s.buttons[selector].node
				});
			}
		}
		else if (typeof selector === 'string') {
			if (selector.indexOf(',') !== -1) {
				// Split
				var a = selector.split(',');

				for (i = 0, ien = a.length; i < ien; i++) {
					run(a[i].trim(), inst);
				}
			}
			else if (selector.match(/^\d+(\-\d+)*$/)) {
				// Sub-button index selector
				var indexes = $.map(buttons, function (v) {
					return v.idx;
				});

				ret.push({
					inst: inst,
					node: buttons[$.inArray(selector, indexes)].node
				});
			}
			else if (selector.indexOf(':name') !== -1) {
				// Button name selector
				var name = selector.replace(':name', '');

				for (i = 0, ien = buttons.length; i < ien; i++) {
					if (buttons[i].name === name) {
						ret.push({
							inst: inst,
							node: buttons[i].node
						});
					}
				}
			}
			else {
				// jQuery selector on the nodes
				$(nodes)
					.filter(selector)
					.each(function () {
						ret.push({
							inst: inst,
							node: this
						});
					});
			}
		}
		else if (typeof selector === 'object' && selector.nodeName) {
			// Node selector
			var idx = $.inArray(selector, nodes);

			if (idx !== -1) {
				ret.push({
					inst: inst,
					node: nodes[idx]
				});
			}
		}
	};

	for (var i = 0, ien = insts.length; i < ien; i++) {
		var inst = insts[i];

		run(selector, inst);
	}

	return ret;
};

/**
 * Default function used for formatting output data.
 * @param {*} str Data to strip
 */
Buttons.stripData = function (str, config) {
	// If the input is an HTML element, we can use the HTML from it (HTML might be stripped below).
	if (str !== null && typeof str === 'object' && str.nodeName && str.nodeType) {
		str = str.innerHTML;
	}

	if (typeof str !== 'string') {
		return str;
	}

	// Always remove script tags
	str = Buttons.stripHtmlScript(str);

	// Always remove comments
	str = Buttons.stripHtmlComments(str);

	if (!config || config.stripHtml) {
		str = DataTable.util.stripHtml(str);
	}

	if (!config || config.trim) {
		str = str.trim();
	}

	if (!config || config.stripNewlines) {
		str = str.replace(/\n/g, ' ');
	}

	if (!config || config.decodeEntities) {
		if (_entityDecoder) {
			str = _entityDecoder(str);
		}
		else {
			_exportTextarea.innerHTML = str;
			str = _exportTextarea.value;
		}
	}

	// Prevent Excel from running a formula
	if (!config || config.escapeExcelFormula) {
		if (str.match(/^[=@\t\r]/)) {
			str = "'" + str;
		}
	}

	return str;
};

/**
 * Provide a custom entity decoding function - e.g. a regex one, which can be
 * much faster than the built in DOM option, but also larger code size.
 * @param {function} fn
 */
Buttons.entityDecoder = function (fn) {
	_entityDecoder = fn;
};

/**
 * Common function for stripping HTML comments
 *
 * @param {*} input 
 * @returns 
 */
Buttons.stripHtmlComments = function (input) {
	var previous;  
	
	do {  
		previous = input;
		input = input.replace(/(<!--.*?--!?>)|(<!--[\S\s]+?--!?>)|(<!--[\S\s]*?$)/g, '');
	} while (input !== previous);  

	return input;  
};

/**
 * Common function for stripping HTML script tags
 *
 * @param {*} input 
 * @returns 
 */
Buttons.stripHtmlScript = function (input) {
	var previous;  
	
	do {  
		previous = input;
		input = input.replace(/<script\b[^<]*(?:(?!<\/script[^>]*>)<[^<]*)*<\/script[^>]*>/gi, '');
	} while (input !== previous);  

	return input;  
};

/**
 * Buttons defaults. For full documentation, please refer to the docs/option
 * directory or the DataTables site.
 * @type {Object}
 * @static
 */
Buttons.defaults = {
	buttons: ['copy', 'excel', 'csv', 'pdf', 'print'],
	name: 'main',
	tabIndex: 0,
	dom: {
		container: {
			tag: 'div',
			className: 'dt-buttons'
		},
		collection: {
			container: {
				// The element used for the dropdown
				className: 'dt-button-collection',
				content: {
					className: '',
					tag: 'div'
				},
				tag: 'div'
			}
			// optionally
			// , button: IButton - buttons inside the collection container
			// , split: ISplit - splits inside the collection container
		},
		button: {
			tag: 'button',
			className: 'dt-button',
			active: 'dt-button-active', // class name
			disabled: 'disabled', // class name
			spacer: {
				className: 'dt-button-spacer',
				tag: 'span'
			},
			liner: {
				tag: 'span',
				className: ''
			},
			dropClass: '',
			dropHtml: '<span class="dt-button-down-arrow">&#x25BC;</span>'
		},
		split: {
			action: {
				// action button
				className: 'dt-button-split-drop-button dt-button',
				tag: 'button'
			},
			dropdown: {
				// button to trigger the dropdown
				align: 'split-right',
				className: 'dt-button-split-drop',
				splitAlignClass: 'dt-button-split-left',
				tag: 'button'
			},
			wrapper: {
				// wrap around both
				className: 'dt-button-split',
				tag: 'div'
			}
		}
	}
};

/**
 * Version information
 * @type {string}
 * @static
 */
Buttons.version = '3.2.6';

$.extend(_dtButtons, {
	collection: {
		text: function (dt) {
			return dt.i18n('buttons.collection', 'Collection');
		},
		className: 'buttons-collection',
		closeButton: false,
		dropIcon: true,
		init: function (dt, button) {
			button.attr('aria-expanded', false);
		},
		action: function (e, dt, button, config) {
			if (config._collection.parents('body').length) {
				this.popover(false, config);
			}
			else {
				this.popover(config._collection, config);
			}

			// When activated using a key - auto focus on the
			// first item in the popover
			if (e.type === 'keypress') {
				$('a, button', config._collection).eq(0).focus();
			}
		},
		attr: {
			'aria-haspopup': 'dialog'
		}
		// Also the popover options, defined in Buttons.popover
	},
	split: {
		text: function (dt) {
			return dt.i18n('buttons.split', 'Split');
		},
		className: 'buttons-split',
		closeButton: false,
		init: function (dt, button) {
			return button.attr('aria-expanded', false);
		},
		action: function (e, dt, button, config) {
			this.popover(config._collection, config);
		},
		attr: {
			'aria-haspopup': 'dialog'
		}
		// Also the popover options, defined in Buttons.popover
	},
	copy: function () {
		if (_dtButtons.copyHtml5) {
			return 'copyHtml5';
		}
	},
	csv: function (dt, conf) {
		if (_dtButtons.csvHtml5 && _dtButtons.csvHtml5.available(dt, conf)) {
			return 'csvHtml5';
		}
	},
	excel: function (dt, conf) {
		if (
			_dtButtons.excelHtml5 &&
			_dtButtons.excelHtml5.available(dt, conf)
		) {
			return 'excelHtml5';
		}
	},
	pdf: function (dt, conf) {
		if (_dtButtons.pdfHtml5 && _dtButtons.pdfHtml5.available(dt, conf)) {
			return 'pdfHtml5';
		}
	},
	pageLength: function (dt) {
		var lengthMenu = dt.settings()[0].aLengthMenu;
		var vals = [];
		var lang = [];
		var text = function (dt) {
			return dt.i18n(
				'buttons.pageLength',
				{
					'-1': 'Show all rows',
					_: 'Show %d rows'
				},
				dt.page.len()
			);
		};

		// Support for DataTables 1.x 2D array
		if (Array.isArray(lengthMenu[0])) {
			vals = lengthMenu[0];
			lang = lengthMenu[1];
		}
		else {
			for (var i = 0; i < lengthMenu.length; i++) {
				var option = lengthMenu[i];

				// Support for DataTables 2 object in the array
				if ($.isPlainObject(option)) {
					vals.push(option.value);
					lang.push(option.label);
				}
				else {
					vals.push(option);
					lang.push(option);
				}
			}
		}

		return {
			extend: 'collection',
			text: text,
			className: 'buttons-page-length',
			autoClose: true,
			buttons: $.map(vals, function (val, i) {
				return {
					text: lang[i],
					className: 'button-page-length',
					action: function (e, dt) {
						dt.page.len(val).draw();
					},
					init: function (dt, node, conf) {
						var that = this;
						var fn = function () {
							that.active(dt.page.len() === val);
						};

						dt.on('length.dt' + conf.namespace, fn);
						fn();
					},
					destroy: function (dt, node, conf) {
						dt.off('length.dt' + conf.namespace);
					}
				};
			}),
			init: function (dt, node, conf) {
				var that = this;
				dt.on('length.dt' + conf.namespace, function () {
					that.text(conf.text);
				});
			},
			destroy: function (dt, node, conf) {
				dt.off('length.dt' + conf.namespace);
			}
		};
	},
	spacer: {
		style: 'empty',
		spacer: true,
		text: function (dt) {
			return dt.i18n('buttons.spacer', '');
		}
	}
});

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * DataTables API
 *
 * For complete documentation, please refer to the docs/api directory or the
 * DataTables site
 */

// Buttons group and individual button selector
DataTable.Api.register('buttons()', function (group, selector) {
	// Argument shifting
	if (selector === undefined) {
		selector = group;
		group = undefined;
	}

	this.selector.buttonGroup = group;

	var res = this.iterator(
		true,
		'table',
		function (ctx) {
			if (ctx._buttons) {
				return Buttons.buttonSelector(
					Buttons.instanceSelector(group, ctx._buttons),
					selector
				);
			}
		},
		true
	);

	res._groupSelector = group;
	return res;
});

// Individual button selector
DataTable.Api.register('button()', function (group, selector) {
	// just run buttons() and truncate
	var buttons = this.buttons(group, selector);

	if (buttons.length > 1) {
		buttons.splice(1, buttons.length);
	}

	return buttons;
});

// Active buttons
DataTable.Api.registerPlural(
	'buttons().active()',
	'button().active()',
	function (flag) {
		if (flag === undefined) {
			return this.map(function (set) {
				return set.inst.active(set.node);
			});
		}

		return this.each(function (set) {
			set.inst.active(set.node, flag);
		});
	}
);

// Get / set button action
DataTable.Api.registerPlural(
	'buttons().action()',
	'button().action()',
	function (action) {
		if (action === undefined) {
			return this.map(function (set) {
				return set.inst.action(set.node);
			});
		}

		return this.each(function (set) {
			set.inst.action(set.node, action);
		});
	}
);

// Collection control
DataTable.Api.registerPlural(
	'buttons().collectionRebuild()',
	'button().collectionRebuild()',
	function (buttons) {
		return this.each(function (set) {
			for (var i = 0; i < buttons.length; i++) {
				if (typeof buttons[i] === 'object') {
					buttons[i].parentConf = set;
				}
			}
			set.inst.collectionRebuild(set.node, buttons);
		});
	}
);

// Enable / disable buttons
DataTable.Api.register(
	['buttons().enable()', 'button().enable()'],
	function (flag) {
		return this.each(function (set) {
			set.inst.enable(set.node, flag);
		});
	}
);

// Disable buttons
DataTable.Api.register(
	['buttons().disable()', 'button().disable()'],
	function () {
		return this.each(function (set) {
			set.inst.disable(set.node);
		});
	}
);

// Button index
DataTable.Api.register('button().index()', function () {
	var idx = null;

	this.each(function (set) {
		var res = set.inst.index(set.node);

		if (res !== null) {
			idx = res;
		}
	});

	return idx;
});

// Get button nodes
DataTable.Api.registerPlural(
	'buttons().nodes()',
	'button().node()',
	function () {
		var jq = $();

		// jQuery will automatically reduce duplicates to a single entry
		$(
			this.each(function (set) {
				jq = jq.add(set.inst.node(set.node));
			})
		);

		return jq;
	}
);

// Get / set button processing state
DataTable.Api.registerPlural(
	'buttons().processing()',
	'button().processing()',
	function (flag) {
		if (flag === undefined) {
			return this.map(function (set) {
				return set.inst.processing(set.node);
			});
		}

		return this.each(function (set) {
			set.inst.processing(set.node, flag);
		});
	}
);

// Get / set button text (i.e. the button labels)
DataTable.Api.registerPlural(
	'buttons().text()',
	'button().text()',
	function (label) {
		if (label === undefined) {
			return this.map(function (set) {
				return set.inst.text(set.node);
			});
		}

		return this.each(function (set) {
			set.inst.text(set.node, label);
		});
	}
);

// Trigger a button's action
DataTable.Api.registerPlural(
	'buttons().trigger()',
	'button().trigger()',
	function () {
		return this.each(function (set) {
			set.inst.node(set.node).trigger('click');
		});
	}
);

// Button resolver to the popover
DataTable.Api.register('button().popover()', function (content, options) {
	return this.map(function (set) {
		return set.inst._popover(content, this.button(this[0].node), options);
	});
});

// Get the container elements
DataTable.Api.register('buttons().containers()', function () {
	var jq = $();
	var groupSelector = this._groupSelector;

	// We need to use the group selector directly, since if there are no buttons
	// the result set will be empty
	this.iterator(true, 'table', function (ctx) {
		if (ctx._buttons) {
			var insts = Buttons.instanceSelector(groupSelector, ctx._buttons);

			for (var i = 0, ien = insts.length; i < ien; i++) {
				jq = jq.add(insts[i].container());
			}
		}
	});

	return jq;
});

DataTable.Api.register('buttons().container()', function () {
	// API level of nesting is `buttons()` so we can zip into the containers method
	return this.containers().eq(0);
});

// Add a new button
DataTable.Api.register('button().add()', function (idx, conf, draw) {
	var ctx = this.context;
	var node;

	// Don't use `this` as it could be empty - select the instances directly
	if (ctx.length) {
		var inst = Buttons.instanceSelector(
			this._groupSelector,
			ctx[0]._buttons
		);

		if (inst.length) {
			node = inst[0].add(conf, idx, draw);
		}
	}

	return node
		? this.button(this._groupSelector, node)
		: this;
});

// Destroy the button sets selected
DataTable.Api.register('buttons().destroy()', function () {
	this.pluck('inst')
		.unique()
		.each(function (inst) {
			inst.destroy();
		});

	return this;
});

// Remove a button
DataTable.Api.registerPlural(
	'buttons().remove()',
	'buttons().remove()',
	function () {
		this.each(function (set) {
			set.inst.remove(set.node);
		});

		return this;
	}
);

// Information box that can be used by buttons
var _infoTimer;
DataTable.Api.register('buttons.info()', function (title, message, time) {
	var that = this;

	if (title === false) {
		this.off('destroy.btn-info');
		_fadeOut($('#datatables_buttons_info'), 400, function () {
			$(this).remove();
		});
		clearTimeout(_infoTimer);
		_infoTimer = null;

		return this;
	}

	if (_infoTimer) {
		clearTimeout(_infoTimer);
	}

	if ($('#datatables_buttons_info').length) {
		$('#datatables_buttons_info').remove();
	}

	title = title ? '<h2>' + title + '</h2>' : '';

	_fadeIn(
		$('<div id="datatables_buttons_info" class="dt-button-info"/>')
			.html(title)
			.append(
				$('<div/>')[typeof message === 'string' ? 'html' : 'append'](
					message
				)
			)
			.css('display', 'none')
			.appendTo('body')
	);

	if (time !== undefined && time !== 0) {
		_infoTimer = setTimeout(function () {
			that.buttons.info(false);
		}, time);
	}

	this.on('destroy.btn-info', function () {
		that.buttons.info(false);
	});

	return this;
});

// Get data from the table for export - this is common to a number of plug-in
// buttons so it is included in the Buttons core library
DataTable.Api.register('buttons.exportData()', function (options) {
	if (this.context.length) {
		return _exportData(new DataTable.Api(this.context[0]), options);
	}
});

// Get information about the export that is common to many of the export data
// types (DRY)
DataTable.Api.register('buttons.exportInfo()', function (conf) {
	if (!conf) {
		conf = {};
	}

	return {
		filename: _filename(conf, this),
		title: _title(conf, this),
		messageTop: _message(this, conf, conf.message || conf.messageTop, 'top'),
		messageBottom: _message(this, conf, conf.messageBottom, 'bottom')
	};
});

/**
 * Get the file name for an exported file.
 *
 * @param {object} config Button configuration
 * @param {object} dt DataTable instance
 */
var _filename = function (config, dt) {
	// Backwards compatibility
	var filename =
		config.filename === '*' &&
		config.title !== '*' &&
		config.title !== undefined &&
		config.title !== null &&
		config.title !== ''
			? config.title
			: config.filename;

	if (typeof filename === 'function') {
		filename = filename(config, dt);
	}

	if (filename === undefined || filename === null) {
		return null;
	}

	if (filename.indexOf('*') !== -1) {
		filename = filename.replace(/\*/g, $('head > title').text()).trim();
	}

	// Strip characters which the OS will object to
	filename = filename.replace(/[^a-zA-Z0-9_\u00A1-\uFFFF\.,\-_ !\(\)]/g, '');

	var extension = _stringOrFunction(config.extension, config, dt);
	if (!extension) {
		extension = '';
	}

	return filename + extension;
};

/**
 * Simply utility method to allow parameters to be given as a function
 *
 * @param {undefined|string|function} option Option
 * @return {null|string} Resolved value
 */
var _stringOrFunction = function (option, config, dt) {
	if (option === null || option === undefined) {
		return null;
	}
	else if (typeof option === 'function') {
		return option(config, dt);
	}
	return option;
};

/**
 * Get the title for an exported file.
 *
 * @param {object} config	Button configuration
 */
var _title = function (config, dt) {
	var title = _stringOrFunction(config.title, config, dt);

	return title === null
		? null
		: title.indexOf('*') !== -1
		? title.replace(/\*/g, $('head > title').text() || 'Exported data')
		: title;
};

var _message = function (dt, config, option, position) {
	var message = _stringOrFunction(option, config, dt);
	if (message === null) {
		return null;
	}

	var caption = $('caption', dt.table().container()).eq(0);
	if (message === '*') {
		var side = caption.css('caption-side');
		if (side !== position) {
			return null;
		}

		return caption.length ? caption.text() : '';
	}

	return message;
};

var _exportTextarea = $('<textarea/>')[0];
var _exportData = function (dt, inOpts) {
	var config = $.extend(
		true,
		{},
		{
			rows: null,
			columns: '',
			modifier: {
				search: 'applied',
				order: 'applied'
			},
			orthogonal: 'display',
			stripHtml: true,
			stripNewlines: true,
			decodeEntities: true,
			escapeExcelFormula: false,
			trim: true,
			format: {
				header: function (d) {
					return Buttons.stripData(d, config);
				},
				footer: function (d) {
					return Buttons.stripData(d, config);
				},
				body: function (d) {
					return Buttons.stripData(d, config);
				}
			},
			customizeData: null,
			customizeZip: null
		},
		inOpts
	);

	var header = dt
		.columns(config.columns)
		.indexes()
		.map(function (idx) {
			var col = dt.column(idx);
			return config.format.header(col.title(), idx, col.header());
		})
		.toArray();

	var footer = dt.table().footer()
		? dt
				.columns(config.columns)
				.indexes()
				.map(function (idx) {
					var el = dt.column(idx).footer();
					var val = '';

					if (el) {
						var inner = $('.dt-column-title', el);

						val = inner.length
							? inner.html()
							: $(el).html();
					}

					return config.format.footer(val, idx, el);
				})
				.toArray()
		: null;

	// If Select is available on this table, and any rows are selected, limit the export
	// to the selected rows. If no rows are selected, all rows will be exported. Specify
	// a `selected` modifier to control directly.
	var modifier = $.extend({}, config.modifier);
	if (
		dt.select &&
		typeof dt.select.info === 'function' &&
		modifier.selected === undefined
	) {
		if (
			dt.rows(config.rows, $.extend({ selected: true }, modifier)).any()
		) {
			$.extend(modifier, { selected: true });
		}
	}

	var rowIndexes = dt.rows(config.rows, modifier).indexes().toArray();
	var selectedCells = dt.cells(rowIndexes, config.columns, {
		order: modifier.order
	});
	var cells = selectedCells.render(config.orthogonal).toArray();
	var cellNodes = selectedCells.nodes().toArray();
	var cellIndexes = selectedCells.indexes().toArray();

	var columns = dt.columns(config.columns).count();
	var rows = columns > 0 ? cells.length / columns : 0;
	var body = [];
	var cellCounter = 0;

	for (var i = 0, ien = rows; i < ien; i++) {
		var row = [columns];

		for (var j = 0; j < columns; j++) {
			row[j] = config.format.body(
				cells[cellCounter],
				cellIndexes[cellCounter].row,
				cellIndexes[cellCounter].column,
				cellNodes[cellCounter]
			);
			cellCounter++;
		}

		body[i] = row;
	}

	var data = {
		header: header,
		headerStructure: _headerFormatter(
			config.format.header,
			dt.table().header.structure(config.columns)
		),
		footer: footer,
		footerStructure: _headerFormatter(
			config.format.footer,
			dt.table().footer.structure(config.columns)
		),
		body: body
	};

	if (config.customizeData) {
		config.customizeData(data);
	}

	return data;
};

function _headerFormatter(formatter, struct) {
	for (var i=0 ; i<struct.length ; i++) {
		for (var j=0 ; j<struct[i].length ; j++) {
			var item = struct[i][j];

			if (item) {
				item.title = formatter(
					item.title,
					j,
					item.cell
				);
			}
		}
	}

	return struct;
}

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * DataTables interface
 */

// Attach to DataTables objects for global access
$.fn.dataTable.Buttons = Buttons;
$.fn.DataTable.Buttons = Buttons;

// DataTables creation - check if the buttons have been defined for this table,
// they will have been if the `B` option was used in `dom`, otherwise we should
// create the buttons instance here so they can be inserted into the document
// using the API. Listen for `init` for compatibility with pre 1.10.10, but to
// be removed in future.
$(document).on('init.dt plugin-init.dt', function (e, settings) {
	if (e.namespace !== 'dt') {
		return;
	}

	var opts = settings.oInit.buttons || DataTable.defaults.buttons;

	if (opts && !settings._buttons) {
		new Buttons(settings, opts).container();
	}
});

function _init(settings, options) {
	var api = new DataTable.Api(settings);
	var opts = options
		? options
		: api.init().buttons || DataTable.defaults.buttons;

	return new Buttons(api, opts).container();
}

// DataTables 1 `dom` feature option
DataTable.ext.feature.push({
	fnInit: _init,
	cFeature: 'B'
});

// DataTables 2 layout feature
if (DataTable.feature) {
	DataTable.feature.register('buttons', _init);
}


return DataTable;
}));


/*! Bootstrap integration for DataTables' Buttons
 * © SpryMedia Ltd - datatables.net/license
 */

(function( factory ){
	if ( typeof define === 'function' && define.amd ) {
		// AMD
		define( ['jquery', 'datatables.net-bs5', 'datatables.net-buttons'], function ( $ ) {
			return factory( $, window, document );
		} );
	}
	else if ( typeof exports === 'object' ) {
		// CommonJS
		var jq = require('jquery');
		var cjsRequires = function (root, $) {
			if ( ! $.fn.dataTable ) {
				require('datatables.net-bs5')(root, $);
			}

			if ( ! $.fn.dataTable.Buttons ) {
				require('datatables.net-buttons')(root, $);
			}
		};

		if (typeof window === 'undefined') {
			module.exports = function (root, $) {
				if ( ! root ) {
					// CommonJS environments without a window global must pass a
					// root. This will give an error otherwise
					root = window;
				}

				if ( ! $ ) {
					$ = jq( root );
				}

				cjsRequires( root, $ );
				return factory( $, root, root.document );
			};
		}
		else {
			cjsRequires( window, jq );
			module.exports = factory( jq, window, window.document );
		}
	}
	else {
		// Browser
		factory( jQuery, window, document );
	}
}(function( $, window, document ) {
'use strict';
var DataTable = $.fn.dataTable;



$.extend(true, DataTable.Buttons.defaults, {
	dom: {
		container: {
			className: 'dt-buttons btn-group flex-wrap'
		},
		button: {
			className: 'btn btn-secondary',
			active: 'active',
			dropHtml: '',
			dropClass: 'dropdown-toggle'
		},
		collection: {
			container: {
				tag: 'div',
				className: 'dt-button-collection',
				content: {
					tag: 'ul',
					className: 'dropdown-menu show'
				}
			},
			closeButton: false,
			button: {
				tag: 'li',
				className: 'dt-button',
				active: 'dt-button-active-a',
				disabled: 'disabled',
				liner: {
					tag: 'a',
					className: 'dropdown-item'
				},
				spacer: {
					className: 'divider',
					tag: 'li'
				}
			}
		},
		split: {
			action: {
				tag: 'a',
				className: 'btn btn-secondary dt-button-split-drop-button',
				closeButton: false
			},
			dropdown: {
				tag: 'button',
				className:
					'btn btn-secondary dt-button-split-drop dropdown-toggle-split',
				closeButton: false,
				align: 'split-left',
				splitAlignClass: 'dt-button-split-left'
			},
			wrapper: {
				tag: 'div',
				className: 'dt-button-split btn-group',
				closeButton: false
			}
		}
	},
	buttonCreated: function (config, button) {
		return config.buttons ? $('<div class="btn-group"/>').append(button) : button;
	}
});

DataTable.ext.buttons.collection.rightAlignClassName = 'dropdown-menu-right';


return DataTable;
}));


/*! Responsive 3.0.8
 * © SpryMedia Ltd - datatables.net/license
 */

(function( factory ){
	if ( typeof define === 'function' && define.amd ) {
		// AMD
		define( ['jquery', 'datatables.net'], function ( $ ) {
			return factory( $, window, document );
		} );
	}
	else if ( typeof exports === 'object' ) {
		// CommonJS
		var jq = require('jquery');
		var cjsRequires = function (root, $) {
			if ( ! $.fn.dataTable ) {
				require('datatables.net')(root, $);
			}
		};

		if (typeof window === 'undefined') {
			module.exports = function (root, $) {
				if ( ! root ) {
					// CommonJS environments without a window global must pass a
					// root. This will give an error otherwise
					root = window;
				}

				if ( ! $ ) {
					$ = jq( root );
				}

				cjsRequires( root, $ );
				return factory( $, root, root.document );
			};
		}
		else {
			cjsRequires( window, jq );
			module.exports = factory( jq, window, window.document );
		}
	}
	else {
		// Browser
		factory( jQuery, window, document );
	}
}(function( $, window, document ) {
'use strict';
var DataTable = $.fn.dataTable;



/**
 * @summary     Responsive
 * @description Responsive tables plug-in for DataTables
 * @version     3.0.8
 * @author      SpryMedia Ltd
 * @copyright   SpryMedia Ltd.
 *
 * This source file is free software, available under the following license:
 *   MIT license - http://datatables.net/license/mit
 *
 * This source file is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY
 * or FITNESS FOR A PARTICULAR PURPOSE. See the license files for details.
 *
 * For details please refer to: http://www.datatables.net
 */

/**
 * Responsive is a plug-in for the DataTables library that makes use of
 * DataTables' ability to change the visibility of columns, changing the
 * visibility of columns so the displayed columns fit into the table container.
 * The end result is that complex tables will be dynamically adjusted to fit
 * into the viewport, be it on a desktop, tablet or mobile browser.
 *
 * Responsive for DataTables has two modes of operation, which can used
 * individually or combined:
 *
 * * Class name based control - columns assigned class names that match the
 *   breakpoint logic can be shown / hidden as required for each breakpoint.
 * * Automatic control - columns are automatically hidden when there is no
 *   room left to display them. Columns removed from the right.
 *
 * In additional to column visibility control, Responsive also has built into
 * options to use DataTables' child row display to show / hide the information
 * from the table that has been hidden. There are also two modes of operation
 * for this child row display:
 *
 * * Inline - when the control element that the user can use to show / hide
 *   child rows is displayed inside the first column of the table.
 * * Column - where a whole column is dedicated to be the show / hide control.
 *
 * Initialisation of Responsive is performed by:
 *
 * * Adding the class `responsive` or `dt-responsive` to the table. In this case
 *   Responsive will automatically be initialised with the default configuration
 *   options when the DataTable is created.
 * * Using the `responsive` option in the DataTables configuration options. This
 *   can also be used to specify the configuration options, or simply set to
 *   `true` to use the defaults.
 *
 *  @class
 *  @param {object} settings DataTables settings object for the host table
 *  @param {object} [opts] Configuration options
 *  @requires jQuery 1.7+
 *  @requires DataTables 2.0.0+
 *
 *  @example
 *      $('#example').DataTable( {
 *        responsive: true
 *      } );
 *    } );
 */
var Responsive = function (settings, opts) {
	// Sanity check that we are using DataTables 2.0.0 or newer
	if (!DataTable.versionCheck || !DataTable.versionCheck('2')) {
		throw 'DataTables Responsive requires DataTables 2 or newer';
	}

	this.s = {
		childNodeStore: {},
		columns: [],
		current: [],
		dt: new DataTable.Api(settings)
	};

	// Check if responsive has already been initialised on this table
	if (this.s.dt.settings()[0].responsive) {
		return;
	}

	// details is an object, but for simplicity the user can give it as a string
	// or a boolean
	if (opts && typeof opts.details === 'string') {
		opts.details = { type: opts.details };
	}
	else if (opts && opts.details === false) {
		opts.details = { type: false };
	}
	else if (opts && opts.details === true) {
		opts.details = { type: 'inline' };
	}

	this.c = $.extend(
		true,
		{},
		Responsive.defaults,
		DataTable.defaults.responsive,
		opts
	);
	settings.responsive = this;
	this._constructor();
};

$.extend(Responsive.prototype, {
	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	 * Constructor
	 */

	/**
	 * Initialise the Responsive instance
	 *
	 * @private
	 */
	_constructor: function () {
		var that = this;
		var dt = this.s.dt;
		var oldWindowWidth = $(window).innerWidth();

		dt.settings()[0]._responsive = this;

		// Use DataTables' throttle function to avoid processor thrashing
		$(window).on(
			'orientationchange.dtr',
			DataTable.util.throttle(function () {
				// iOS has a bug whereby resize can fire when only scrolling
				// See: http://stackoverflow.com/questions/8898412
				var width = $(window).innerWidth();

				if (width !== oldWindowWidth) {
					that._resize();
					oldWindowWidth = width;
				}
			})
		);

		// Handle new rows being dynamically added - needed as responsive
		// updates all rows (shown or not) a responsive change, rather than
		// per draw.
		dt.on('row-created.dtr', function (e, tr, data, idx) {
			if ($.inArray(false, that.s.current) !== -1) {
				$('>td, >th', tr).each(function (i) {
					var idx = dt.column.index('toData', i);

					if (that.s.current[idx] === false) {
						$(this)
							.css('display', 'none')
							.addClass('dtr-hidden');
					}
				});
			}
		});

		// Destroy event handler
		dt.on('destroy.dtr', function () {
			dt.off('.dtr');
			$(dt.table().body()).off('.dtr');
			$(window).off('resize.dtr orientationchange.dtr');
			dt.cells('.dtr-control').nodes().to$().removeClass('dtr-control');
			$(dt.table().node()).removeClass('dtr-inline collapsed');

			// Restore the columns that we've hidden
			$.each(that.s.current, function (i, val) {
				if (val === false) {
					that._setColumnVis(i, true);
				}
			});
		});

		// Reorder the breakpoints array here in case they have been added out
		// of order
		this.c.breakpoints.sort(function (a, b) {
			return a.width < b.width ? 1 : a.width > b.width ? -1 : 0;
		});

		this._classLogic();

		// Details handler
		var details = this.c.details;

		if (details.type !== false) {
			that._detailsInit();

			// DataTables will trigger this event on every column it shows and
			// hides individually
			dt.on('column-visibility.dtr', function () {
				// Use a small debounce to allow multiple columns to be set together
				if (that._timer) {
					clearTimeout(that._timer);
				}

				that._timer = setTimeout(function () {
					that._timer = null;

					that._classLogic();
					that._resizeAuto();
					that._resize(true);

					that._redrawChildren();
				}, 100);
			});

			// Redraw the details box on each draw which will happen if the data
			// has changed. This is used until DataTables implements a native
			// `updated` event for rows
			dt.on('draw.dtr', function () {
				that._redrawChildren();
			});

			$(dt.table().node()).addClass('dtr-' + details.type);
		}

		// DT2 let's us tell it if we are hiding columns
		dt.on('column-calc.dt', function (e, d) {
			var curr = that.s.current;

			for (var i = 0; i < curr.length; i++) {
				var idx = d.visible.indexOf(i);

				if (curr[i] === false && idx >= 0) {
					d.visible.splice(idx, 1);
				}
			}
		});

		// On Ajax reload we want to reopen any child rows which are displayed
		// by responsive
		dt.on('preXhr.dtr', function () {
			var rowIds = [];
			dt.rows().every(function () {
				if (this.child.isShown()) {
					rowIds.push(this.id(true));
				}
			});

			dt.one('draw.dtr', function () {
				that._resizeAuto();
				that._resize();

				dt.rows(rowIds).every(function () {
					that._detailsDisplay(this, false);
				});
			});
		});

		// First pass when the table is ready
		dt
			.on('draw.dtr', function () {
				// For server-side tables, each draw needs the child node
				// cache to be cleared since it is no longer relevant. We can
				// create a new object for speed in this case - no mutation.
				if (dt.page.info().serverSide) {
					that.s.childNodeStore = {};
				}

				that._controlClass();
			})
			.ready(function () {
				that._resizeAuto();
				that._resize();

				// Change in column sizes means we need to calc
				dt.on('column-sizing.dtr', function () {
					that._resizeAuto();
					that._resize();
				});
			});

		// Attach listeners after first pass
		dt.on('column-reorder.dtr', function (e, settings, details) {
			that._classLogic();
			that._resizeAuto();
			that._resize(true);
		});
	},

	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	 * Private methods
	 */

	/**
	 * Insert a `col` tag into the correct location in a `colgroup`.
	 *
	 * @param {jQuery} colGroup The `colgroup` tag
	 * @param {jQuery} colEl The `col` tag
	 */
	_colGroupAttach: function (colGroup, colEls, idx) {
		var found = null;

		// No need to do anything if already attached
		if (colEls[idx].get(0).parentNode === colGroup[0]) {
			return;
		}

		// Find the first `col` after our own which is already attached
		for (var i = idx+1; i < colEls.length; i++) {
			if (colGroup[0] === colEls[i].get(0).parentNode) {
				found = i;
				break;
			}
		}

		if (found !== null) {
			// Insert before
			colEls[idx].insertBefore(colEls[found][0]);
		}
		else {
			// If wasn't found, insert at the end
			colGroup.append(colEls[idx]);
		}
	},

	/**
	 * Get and store nodes from a cell - use for node moving renderers
	 *
	 * @param {*} dt DT instance
	 * @param {*} row Row index
	 * @param {*} col Column index
	 */
	_childNodes: function (dt, row, col) {
		var name = row + '-' + col;

		if (this.s.childNodeStore[name]) {
			return this.s.childNodeStore[name];
		}

		// https://jsperf.com/childnodes-array-slice-vs-loop
		var nodes = [];
		var children = dt.cell(row, col).node().childNodes;
		for (var i = 0, iLen = children.length; i < iLen; i++) {
			nodes.push(children[i]);
		}

		this.s.childNodeStore[name] = nodes;

		return nodes;
	},

	/**
	 * Restore nodes from the cache to a table cell
	 *
	 * @param {*} dt DT instance
	 * @param {*} row Row index
	 * @param {*} col Column index
	 */
	_childNodesRestore: function (dt, row, col) {
		var name = row + '-' + col;

		if (!this.s.childNodeStore[name]) {
			return;
		}

		var node = dt.cell(row, col).node();
		var store = this.s.childNodeStore[name];
		if (store.length > 0) {
			var parent = store[0].parentNode;
			var parentChildren = parent.childNodes;
			var a = [];

			for (var i = 0, iLen = parentChildren.length; i < iLen; i++) {
				a.push(parentChildren[i]);
			}

			for (var j = 0, jen = a.length; j < jen; j++) {
				node.appendChild(a[j]);
			}
		}

		this.s.childNodeStore[name] = undefined;
	},

	/**
	 * Calculate the visibility for the columns in a table for a given
	 * breakpoint. The result is pre-determined based on the class logic if
	 * class names are used to control all columns, but the width of the table
	 * is also used if there are columns which are to be automatically shown
	 * and hidden.
	 *
	 * @param  {string} breakpoint Breakpoint name to use for the calculation
	 * @return {array} Array of boolean values initiating the visibility of each
	 *   column.
	 *  @private
	 */
	_columnsVisibility: function (breakpoint) {
		var dt = this.s.dt;
		var columns = this.s.columns;
		var i, iLen;

		// Create an array that defines the column ordering based first on the
		// column's priority, and secondly the column index. This allows the
		// columns to be removed from the right if the priority matches
		var order = columns
			.map(function (col, idx) {
				return {
					columnIdx: idx,
					priority: col.priority
				};
			})
			.sort(function (a, b) {
				if (a.priority !== b.priority) {
					return a.priority - b.priority;
				}
				return a.columnIdx - b.columnIdx;
			});

		// Class logic - determine which columns are in this breakpoint based
		// on the classes. If no class control (i.e. `auto`) then `-` is used
		// to indicate this to the rest of the function
		var display = $.map(columns, function (col, i) {
			if (dt.column(i).visible() === false) {
				return 'not-visible';
			}
			return col.auto && col.minWidth === null
				? false
				: col.auto === true
				? '-'
				: $.inArray(breakpoint, col.includeIn) !== -1;
		});

		// Auto column control - first pass: how much width is taken by the
		// ones that must be included from the non-auto columns
		var requiredWidth = 0;
		for (i = 0, iLen = display.length; i < iLen; i++) {
			if (display[i] === true) {
				requiredWidth += columns[i].minWidth;
			}
		}

		// Second pass, use up any remaining width for other columns. For
		// scrolling tables we need to subtract the width of the scrollbar. It
		// may not be requires which makes this sub-optimal, but it would
		// require another full redraw to make complete use of those extra few
		// pixels
		var scrolling = dt.settings()[0].oScroll;
		var bar = scrolling.sY || scrolling.sX ? scrolling.iBarWidth : 0;
		var widthAvailable = dt.table().container().offsetWidth - bar;
		var usedWidth = widthAvailable - requiredWidth;

		// Control column needs to always be included. This makes it sub-
		// optimal in terms of using the available with, but to stop layout
		// thrashing or overflow. Also we need to account for the control column
		// width first so we know how much width is available for the other
		// columns, since the control column might not be the first one shown
		for (i = 0, iLen = display.length; i < iLen; i++) {
			if (columns[i].control) {
				usedWidth -= columns[i].minWidth;
			}
		}

		// Allow columns to be shown (counting by priority and then right to
		// left) until we run out of room
		var empty = false;
		for (i = 0, iLen = order.length; i < iLen; i++) {
			var colIdx = order[i].columnIdx;

			if (
				display[colIdx] === '-' &&
				!columns[colIdx].control &&
				columns[colIdx].minWidth
			) {
				// Once we've found a column that won't fit we don't let any
				// others display either, or columns might disappear in the
				// middle of the table
				if (empty || usedWidth - columns[colIdx].minWidth < 0) {
					empty = true;
					display[colIdx] = false;
				}
				else {
					display[colIdx] = true;
				}

				usedWidth -= columns[colIdx].minWidth;
			}
		}

		// Determine if the 'control' column should be shown (if there is one).
		// This is the case when there is a hidden column (that is not the
		// control column). The two loops look inefficient here, but they are
		// trivial and will fly through. We need to know the outcome from the
		// first , before the action in the second can be taken
		var showControl = false;

		for (i = 0, iLen = columns.length; i < iLen; i++) {
			if (
				!columns[i].control &&
				!columns[i].never &&
				display[i] === false
			) {
				showControl = true;
				break;
			}
		}

		for (i = 0, iLen = columns.length; i < iLen; i++) {
			if (columns[i].control) {
				display[i] = showControl;
			}

			// Replace not visible string with false from the control column detection above
			if (display[i] === 'not-visible') {
				display[i] = false;
			}
		}

		// Finally we need to make sure that there is at least one column that
		// is visible
		if ($.inArray(true, display) === -1) {
			display[0] = true;
		}

		return display;
	},

	/**
	 * Create the internal `columns` array with information about the columns
	 * for the table. This includes determining which breakpoints the column
	 * will appear in, based upon class names in the column, which makes up the
	 * vast majority of this method.
	 *
	 * @private
	 */
	_classLogic: function () {
		var that = this;
		var breakpoints = this.c.breakpoints;
		var dt = this.s.dt;
		var columns = dt
			.columns()
			.eq(0)
			.map(function (i) {
				var column = this.column(i);
				var className = column.header().className;
				var priority = column.init().responsivePriority;
				var dataPriority = column
					.header()
					.getAttribute('data-priority');

				if (priority === undefined) {
					priority =
						dataPriority === undefined || dataPriority === null
							? 10000
							: dataPriority * 1;
				}

				return {
					className: className,
					includeIn: [],
					auto: false,
					control: false,
					never: className.match(/\b(dtr\-)?never\b/) ? true : false,
					priority: priority
				};
			});

		// Simply add a breakpoint to `includeIn` array, ensuring that there are
		// no duplicates
		var add = function (colIdx, name) {
			var includeIn = columns[colIdx].includeIn;

			if ($.inArray(name, includeIn) === -1) {
				includeIn.push(name);
			}
		};

		var column = function (colIdx, name, operator, matched) {
			var size, i, iLen;

			if (!operator) {
				columns[colIdx].includeIn.push(name);
			}
			else if (operator === 'max-') {
				// Add this breakpoint and all smaller
				size = that._find(name).width;

				for (i = 0, iLen = breakpoints.length; i < iLen; i++) {
					if (breakpoints[i].width <= size) {
						add(colIdx, breakpoints[i].name);
					}
				}
			}
			else if (operator === 'min-') {
				// Add this breakpoint and all larger
				size = that._find(name).width;

				for (i = 0, iLen = breakpoints.length; i < iLen; i++) {
					if (breakpoints[i].width >= size) {
						add(colIdx, breakpoints[i].name);
					}
				}
			}
			else if (operator === 'not-') {
				// Add all but this breakpoint
				for (i = 0, iLen = breakpoints.length; i < iLen; i++) {
					if (breakpoints[i].name.indexOf(matched) === -1) {
						add(colIdx, breakpoints[i].name);
					}
				}
			}
		};

		// Loop over each column and determine if it has a responsive control
		// class
		columns.each(function (col, i) {
			var classNames = col.className.split(' ');
			var hasClass = false;

			// Split the class name up so multiple rules can be applied if needed
			for (var k = 0, ken = classNames.length; k < ken; k++) {
				var className = classNames[k].trim();

				if (className === 'all' || className === 'dtr-all') {
					// Include in all
					hasClass = true;
					col.includeIn = $.map(breakpoints, function (a) {
						return a.name;
					});
					return;
				}
				else if (
					className === 'none' ||
					className === 'dtr-none' ||
					col.never
				) {
					// Include in none (default) and no auto
					hasClass = true;
					return;
				}
				else if (
					className === 'control' ||
					className === 'dtr-control'
				) {
					// Special column that is only visible, when one of the other
					// columns is hidden. This is used for the details control
					hasClass = true;
					col.control = true;
					return;
				}

				$.each(breakpoints, function (j, breakpoint) {
					// Does this column have a class that matches this breakpoint?
					var brokenPoint = breakpoint.name.split('-');
					var re = new RegExp(
						'(min\\-|max\\-|not\\-)?(' +
							brokenPoint[0] +
							')(\\-[_a-zA-Z0-9])?'
					);
					var match = className.match(re);

					if (match) {
						hasClass = true;

						if (
							match[2] === brokenPoint[0] &&
							match[3] === '-' + brokenPoint[1]
						) {
							// Class name matches breakpoint name fully
							column(
								i,
								breakpoint.name,
								match[1],
								match[2] + match[3]
							);
						}
						else if (match[2] === brokenPoint[0] && !match[3]) {
							// Class name matched primary breakpoint name with no qualifier
							column(i, breakpoint.name, match[1], match[2]);
						}
					}
				});
			}

			// If there was no control class, then automatic sizing is used
			if (!hasClass) {
				col.auto = true;
			}
		});

		this.s.columns = columns;
	},

	/**
	 * Update the cells to show the correct control class / button
	 * @private
	 */
	_controlClass: function () {
		if (this.c.details.type === 'inline') {
			var dt = this.s.dt;
			var columnsVis = this.s.current;
			var firstVisible = $.inArray(true, columnsVis);

			// Remove from any cells which shouldn't have it
			dt.cells(
				null,
				function (idx) {
					return idx !== firstVisible;
				},
				{ page: 'current' }
			)
				.nodes()
				.to$()
				.filter('.dtr-control')
				.removeClass('dtr-control');

			if (firstVisible >= 0) {
				dt.cells(null, firstVisible, { page: 'current' })
					.nodes()
					.to$()
					.addClass('dtr-control');
			}
		}

		this._tabIndexes();
	},

	/**
	 * Show the details for the child row
	 *
	 * @param  {DataTables.Api} row    API instance for the row
	 * @param  {boolean}        update Update flag
	 * @private
	 */
	_detailsDisplay: function (row, update) {
		var that = this;
		var dt = this.s.dt;
		var details = this.c.details;
		var event = function (res) {
			$(row.node()).toggleClass('dtr-expanded', res !== false);
			$(dt.table().node()).triggerHandler('responsive-display.dt', [
				dt,
				row,
				res,
				update
			]);
		};

		if (details && details.type !== false) {
			var renderer =
				typeof details.renderer === 'string'
					? Responsive.renderer[details.renderer]()
					: details.renderer;

			var res = details.display(
				row,
				update,
				function () {
					return renderer.call(
						that,
						dt,
						row[0][0],
						that._detailsObj(row[0])
					);
				},
				function () {
					event(false);
				}
			);

			if (typeof res === 'boolean') {
				event(res);
			}
		}
	},

	/**
	 * Initialisation for the details handler
	 *
	 * @private
	 */
	_detailsInit: function () {
		var that = this;
		var dt = this.s.dt;
		var details = this.c.details;

		// The inline type always uses the first child as the target
		if (details.type === 'inline') {
			details.target = 'td.dtr-control, th.dtr-control';
		}

		$(dt.table().body()).on('keyup.dtr', 'td, th', function (e) {
			let activeNodeName = document.activeElement.nodeName.toLowerCase();

			if (
				e.keyCode === 13 &&
				$(this).data('dtr-keyboard') &&
				(activeNodeName === 'td' || activeNodeName === 'th')
			) {
				$(this).click();
			}
		});

		// type.target can be a string jQuery selector or a column index
		var target = details.target;
		var selector = typeof target === 'string' ? target : 'td, th';

		if (target !== undefined || target !== null) {
			// Click handler to show / hide the details rows when they are available
			$(dt.table().body()).on(
				'click.dtr mousedown.dtr mouseup.dtr',
				selector,
				function (e) {
					// If the table is not collapsed (i.e. there is no hidden columns)
					// then take no action
					if (!$(dt.table().node()).hasClass('collapsed')) {
						return;
					}

					// Check that the row is actually a DataTable's controlled node
					if (
						$.inArray(
							$(this).closest('tr').get(0),
							dt.rows().nodes().toArray()
						) === -1
					) {
						return;
					}

					// For column index, we determine if we should act or not in the
					// handler - otherwise it is already okay
					if (typeof target === 'number') {
						var targetIdx =
							target < 0
								? dt.columns().eq(0).length + target
								: target;

						if (dt.cell(this).index().column !== targetIdx) {
							return;
						}
					}

					// $().closest() includes itself in its check
					var row = dt.row($(this).closest('tr'));

					// Check event type to do an action
					if (e.type === 'click') {
						// The renderer is given as a function so the caller can execute it
						// only when they need (i.e. if hiding there is no point is running
						// the renderer)
						that._detailsDisplay(row, false);
					}
					else if (e.type === 'mousedown') {
						// For mouse users, prevent the focus ring from showing
						$(this).css('outline', 'none');
					}
					else if (e.type === 'mouseup') {
						// And then re-allow at the end of the click
						$(this).trigger('blur').css('outline', '');
					}
				}
			);
		}
	},

	/**
	 * Get the details to pass to a renderer for a row
	 * @param  {int} rowIdx Row index
	 * @private
	 */
	_detailsObj: function (rowIdx) {
		var that = this;
		var dt = this.s.dt;
		var columnApis = [];
		let settings = dt.settings()[0];

		return $.map(this.s.columns, function (col, i) {
			// Never and control columns should not be passed to the renderer
			if (col.never || col.control) {
				return;
			}

			var dtCol = settings.aoColumns[i];

			if (!columnApis[i]) {
				columnApis[i] = dt.column(i);
			}

			return {
				className: dtCol.sClass,
				columnIndex: i,
				data: settings.fastData(rowIdx, i, that.c.orthogonal),
				hidden: columnApis[i].visible() && !that.s.current[i],
				rowIndex: rowIdx,
				title: columnApis[i].title()
			};
		});
	},

	/**
	 * Find a breakpoint object from a name
	 *
	 * @param  {string} name Breakpoint name to find
	 * @return {object}      Breakpoint description object
	 * @private
	 */
	_find: function (name) {
		var breakpoints = this.c.breakpoints;

		for (var i = 0, iLen = breakpoints.length; i < iLen; i++) {
			if (breakpoints[i].name === name) {
				return breakpoints[i];
			}
		}
	},

	/**
	 * Re-create the contents of the child rows as the display has changed in
	 * some way.
	 *
	 * @private
	 */
	_redrawChildren: function () {
		var that = this;
		var dt = this.s.dt;

		dt.rows({ page: 'current' }).iterator('row', function (settings, idx) {
			that._detailsDisplay(dt.row(idx), true);
		});
	},

	/**
	 * Alter the table display for a resized viewport. This involves first
	 * determining what breakpoint the window currently is in, getting the
	 * column visibilities to apply and then setting them.
	 *
	 * @param  {boolean} forceRedraw Force a redraw
	 * @private
	 */
	_resize: function (forceRedraw) {
		var that = this;
		var dt = this.s.dt;
		var width = $(window).innerWidth();
		var breakpoints = this.c.breakpoints;
		var breakpoint = breakpoints[0].name;
		var columns = this.s.columns;
		var i, iLen;
		var oldVis = this.s.current.slice();

		// Determine what breakpoint we are currently at
		for (i = breakpoints.length - 1; i >= 0; i--) {
			if (width <= breakpoints[i].width) {
				breakpoint = breakpoints[i].name;
				break;
			}
		}

		// Show the columns for that break point
		var columnsVis = this._columnsVisibility(breakpoint);
		this.s.current = columnsVis;

		// Set the class before the column visibility is changed so event
		// listeners know what the state is. Need to determine if there are
		// any columns that are not visible but can be shown
		var collapsedClass = false;

		for (i = 0, iLen = columns.length; i < iLen; i++) {
			if (
				columnsVis[i] === false &&
				!columns[i].never &&
				!columns[i].control &&
				!dt.column(i).visible() === false
			) {
				collapsedClass = true;
				break;
			}
		}

		$(dt.table().node()).toggleClass('collapsed', collapsedClass);

		var changed = false;
		var visible = 0;
		var dtSettings = dt.settings()[0];
		var colGroup = $(dt.table().node()).children('colgroup');
		var colEls = dtSettings.aoColumns.map(function (col) {
			return col.colEl;
		});

		dt.columns()
			.eq(0)
			.each(function (colIdx, i) {
				// Do nothing on DataTables' hidden column - DT removes it from the table
				// so we need to slide back
				if (! dt.column(colIdx).visible()) {
					return;
				}

				if (columnsVis[i] === true) {
					visible++;
				}

				if (forceRedraw || columnsVis[i] !== oldVis[i]) {
					changed = true;
					that._setColumnVis(colIdx, columnsVis[i]);
				}

				// DataTables 2 uses `col` to define the width for a column
				// and this needs to run each time, as DataTables will change
				// the column width. We may need to reattach if we've removed
				// an element previously.
				if (! columnsVis[i]) {
					colEls[i].detach();
				}
				else {
					that._colGroupAttach(colGroup, colEls, i);
				}
			});

		if (changed) {
			dt.columns.adjust();

			this._redrawChildren();

			// Inform listeners of the change
			$(dt.table().node()).trigger('responsive-resize.dt', [
				dt,
				this._responsiveOnlyHidden()
			]);

			// If no records, update the "No records" display element
			if (dt.page.info().recordsDisplay === 0) {
				$('td', dt.table().body()).eq(0).attr('colspan', visible);
			}
		}

		that._controlClass();
	},

	/**
	 * Determine the width of each column in the table so the auto column hiding
	 * has that information to work with. This method is never going to be 100%
	 * perfect since column widths can change slightly per page, but without
	 * seriously compromising performance this is quite effective.
	 *
	 * @private
	 */
	_resizeAuto: function () {
		var dt = this.s.dt;
		var columns = this.s.columns;
		var that = this;
		var visibleColumns = dt
			.columns()
			.indexes()
			.filter(function (idx) {
				return dt.column(idx).visible();
			});

		// Are we allowed to do auto sizing?
		if (!this.c.auto) {
			return;
		}

		// Are there any columns that actually need auto-sizing, or do they all
		// have classes defined
		if (
			$.inArray(
				true,
				$.map(columns, function (c) {
					return c.auto;
				})
			) === -1
		) {
			return;
		}

		// Clone the table with the current data in it
		var clonedTable = dt.table().node().cloneNode(false);
		var clonedHeader = $(dt.table().header().cloneNode(false)).appendTo(
			clonedTable
		);
		var clonedFooter = $(dt.table().footer().cloneNode(false)).appendTo(
			clonedTable
		);
		var clonedBody = $(dt.table().body())
			.clone(false, false)
			.empty()
			.appendTo(clonedTable); // use jQuery because of IE8

		clonedTable.style.width = 'auto';

		// Header
		dt.table()
			.header.structure(visibleColumns)
			.forEach((row) => {
				var cells = row
					.filter(function (el) {
						return el ? true : false;
					})
					.map(function (el) {
						return $(el.cell)
							.clone(false)
							.css('display', 'table-cell')
							.css('width', 'auto')
							.css('min-width', 0);
					});

				$('<tr/>').append(cells).appendTo(clonedHeader);
			});

		// Always need an empty row that we can read widths from
		var emptyRow = $('<tr/>').appendTo(clonedBody);

		for (var i = 0; i < visibleColumns.count(); i++) {
			emptyRow.append('<td/>');
		}

		// Body rows
		if (this.c.details.renderer._responsiveMovesNodes) {
			// Slow but it allows for moving elements around the document
			dt.rows({ page: 'current' }).every(function (rowIdx) {
				var node = this.node();

				if (! node) {
					return;
				}

				// We clone the table's rows and cells to create the sizing table
				var tr = node.cloneNode(false);

				dt.cells(rowIdx, visibleColumns).every(function (rowIdx2, colIdx) {
					// If nodes have been moved out (listHiddenNodes), we need to
					// clone from the store
					var store = that.s.childNodeStore[rowIdx + '-' + colIdx];

					if (store) {
						$(this.node().cloneNode(false))
							.append($(store).clone())
							.appendTo(tr);
					}
					else {
						$(this.node()).clone(false).appendTo(tr);
					}
				});

				clonedBody.append(tr);
			});
		}
		else {
			// This is much faster, but it doesn't account for moving nodes around
			$(clonedBody)
				.append( $(dt.rows( { page: 'current' } ).nodes()).clone( false ) )
				.find( 'th, td' ).css( 'display', '' );
		}

		// Any cells which were hidden by Responsive in the host table, need to
		// be visible here for the calculations
		clonedBody.find('th, td').css('display', '');

		// Footer
		dt.table()
			.footer.structure(visibleColumns)
			.forEach((row) => {
				var cells = row
					.filter(function (el) {
						return el ? true : false;
					})
					.map(function (el) {
						return $(el.cell)
							.clone(false)
							.css('display', 'table-cell')
							.css('width', 'auto')
							.css('min-width', 0);
					});

				$('<tr/>').append(cells).appendTo(clonedFooter);
			});

		// In the inline case extra padding is applied to the first column to
		// give space for the show / hide icon. We need to use this in the
		// calculation
		if (this.c.details.type === 'inline') {
			$(clonedTable).addClass('dtr-inline collapsed');
		}

		// It is unsafe to insert elements with the same name into the DOM
		// multiple times. For example, cloning and inserting a checked radio
		// clears the checked state of the original radio.
		$(clonedTable).find('[name]').removeAttr('name');

		// A position absolute table would take the table out of the flow of
		// our container element, bypassing the height and width (Scroller)
		$(clonedTable).css('position', 'relative');

		var inserted = $('<div/>')
			.css({
				width: 1,
				height: 1,
				overflow: 'hidden',
				clear: 'both'
			})
			.append(clonedTable);

		inserted.insertBefore(dt.table().node());

		// The cloned table now contains the smallest that each column can be
		emptyRow.children().each(function (i) {
			var idx = dt.column.index('fromVisible', i);
			columns[idx].minWidth = this.offsetWidth || 0;
		});

		inserted.remove();
	},

	/**
	 * Get the state of the current hidden columns - controlled by Responsive only
	 */
	_responsiveOnlyHidden: function () {
		var dt = this.s.dt;

		return $.map(this.s.current, function (v, i) {
			// If the column is hidden by DataTables then it can't be hidden by
			// Responsive!
			if (dt.column(i).visible() === false) {
				return true;
			}
			return v;
		});
	},

	/**
	 * Set a column's visibility.
	 *
	 * We don't use DataTables' column visibility controls in order to ensure
	 * that column visibility can Responsive can no-exist. Since only IE8+ is
	 * supported (and all evergreen browsers of course) the control of the
	 * display attribute works well.
	 *
	 * @param {integer} col      Column index
	 * @param {boolean} showHide Show or hide (true or false)
	 * @private
	 */
	_setColumnVis: function (col, showHide) {
		var that = this;
		var dt = this.s.dt;
		var display = showHide ? '' : 'none'; // empty string will remove the attr

		this._setHeaderVis(col, showHide, dt.table().header.structure());
		this._setHeaderVis(col, showHide, dt.table().footer.structure());

		dt.column(col)
			.nodes()
			.to$()
			.css('display', display)
			.toggleClass('dtr-hidden', !showHide);

		// We need to set a variable that DT can use when selecting visible
		// columns without needing to query the DOM
		dt.settings()[0].aoColumns[col].responsiveVisible = showHide;

		// If the are child nodes stored, we might need to reinsert them
		if (!$.isEmptyObject(this.s.childNodeStore)) {
			dt.cells(null, col)
				.indexes()
				.each(function (idx) {
					that._childNodesRestore(dt, idx.row, idx.column);
				});
		}
	},

	/**
	 * Set a column's visibility, taking into account multiple rows
	 * in a header / footer and colspan attributes
	 * @param {*} col
	 * @param {*} showHide
	 * @param {*} structure
	 */
	_setHeaderVis: function (col, showHide, structure) {
		var that = this;
		var display = showHide ? '' : 'none';

		// We use the `null`s in the structure array to indicate that a cell
		// should expand over that one if there is a colspan, but it might
		// also have been filled by a rowspan, so we need to expand the
		// rowspan cells down through the structure
		structure.forEach(function (row, rowIdx) {
			for (var col = 0; col < row.length; col++) {
				if (row[col] && row[col].rowspan > 1) {
					var span = row[col].rowspan;

					for (var i=1 ; i<span ; i++) {
						structure[rowIdx + i][col] = {};
					}
				}
			}
		});

		structure.forEach(function (row) {
			if (row[col] && row[col].cell) {
				$(row[col].cell)
					.css('display', display)
					.toggleClass('dtr-hidden', !showHide);
			}
			else {
				// In a colspan - need to rewind calc the new span since
				// display:none elements do not count as being spanned over
				var search = col;

				while (search >= 0) {
					if (row[search] && row[search].cell) {
						row[search].cell.colSpan = that._colspan(row, search);
						break;
					}

					search--;
				}
			}
		});
	},

	/**
	 * How many columns should this cell span
	 *
	 * @param {*} row Header structure row
	 * @param {*} idx The column index of the cell to span
	 */
	_colspan: function (row, idx) {
		var colspan = 1;

		for (var col = idx + 1; col < row.length; col++) {
			if (row[col] === null && this.s.current[col]) {
				// colspan and not hidden by Responsive
				colspan++;
			}
			else if (row[col]) {
				// Got the next cell, jump out
				break;
			}
		}

		return colspan;
	},

	/**
	 * Update the cell tab indexes for keyboard accessibility. This is called on
	 * every table draw - that is potentially inefficient, but also the least
	 * complex option given that column visibility can change on the fly. Its a
	 * shame user-focus was removed from CSS 3 UI, as it would have solved this
	 * issue with a single CSS statement.
	 *
	 * @private
	 */
	_tabIndexes: function () {
		var dt = this.s.dt;
		var cells = dt.cells({ page: 'current' }).nodes().to$();
		var ctx = dt.settings()[0];
		var target = this.c.details.target;

		cells.filter('[data-dtr-keyboard]').removeData('[data-dtr-keyboard]');

		if (typeof target === 'number') {
			dt.cells(null, target, { page: 'current' })
				.nodes()
				.to$()
				.attr('tabIndex', ctx.iTabIndex)
				.data('dtr-keyboard', 1);
		}
		else {
			// This is a bit of a hack - we need to limit the selected nodes to just
			// those of this table
			if (target === 'td:first-child, th:first-child') {
				target = '>td:first-child, >th:first-child';
			}

			var rows = dt.rows({ page: 'current' }).nodes();
			var nodes = target === 'tr'
				? $(rows)
				: $(target, rows);

			nodes
				.attr('tabIndex', ctx.iTabIndex)
				.data('dtr-keyboard', 1);
		}
	}
});

/**
 * List of default breakpoints. Each item in the array is an object with two
 * properties:
 *
 * * `name` - the breakpoint name.
 * * `width` - the breakpoint width
 *
 * @name Responsive.breakpoints
 * @static
 */
Responsive.breakpoints = [
	{ name: 'desktop', width: Infinity },
	{ name: 'tablet-l', width: 1024 },
	{ name: 'tablet-p', width: 768 },
	{ name: 'mobile-l', width: 480 },
	{ name: 'mobile-p', width: 320 }
];

/**
 * Display methods - functions which define how the hidden data should be shown
 * in the table.
 *
 * @namespace
 * @name Responsive.defaults
 * @static
 */
Responsive.display = {
	childRow: function (row, update, render) {
		var rowNode = $(row.node());

		if (update) {
			if (rowNode.hasClass('dtr-expanded')) {
				row.child(render(), 'child').show();

				return true;
			}
		}
		else {
			if (!rowNode.hasClass('dtr-expanded')) {
				var rendered = render();

				if (rendered === false) {
					return false;
				}

				row.child(rendered, 'child').show();
				return true;
			}
			else {
				row.child(false);

				return false;
			}
		}
	},

	childRowImmediate: function (row, update, render) {
		var rowNode = $(row.node());

		if (
			(!update && rowNode.hasClass('dtr-expanded')) ||
			!row.responsive.hasHidden()
		) {
			// User interaction and the row is show, or nothing to show
			row.child(false);

			return false;
		}
		else {
			// Display
			var rendered = render();

			if (rendered === false) {
				return false;
			}

			row.child(rendered, 'child').show();

			return true;
		}
	},

	// This is a wrapper so the modal options for Bootstrap and jQuery UI can
	// have options passed into them. This specific one doesn't need to be a
	// function but it is for consistency in the `modal` name
	modal: function (options) {
		return function (row, update, render, closeCallback) {
			var modal;
			var rendered = render();

			if (rendered === false) {
				return false;
			}

			if (!update) {
				// Show a modal
				var close = function () {
					modal.remove(); // will tidy events for us
					$(document).off('keypress.dtr');
					$(row.node()).removeClass('dtr-expanded');

					closeCallback();
				};

				modal = $('<div class="dtr-modal"/>')
					.append(
						$('<div class="dtr-modal-display"/>')
							.append(
								$('<div class="dtr-modal-content"/>')
									.data('dtr-row-idx', row.index())
									.append(rendered)
							)
							.append(
								$(
									'<div class="dtr-modal-close">&times;</div>'
								).click(function () {
									close();
								})
							)
					)
					.append(
						$('<div class="dtr-modal-background"/>').click(
							function () {
								close();
							}
						)
					)
					.appendTo('body');

				$(row.node()).addClass('dtr-expanded');

				$(document).on('keyup.dtr', function (e) {
					if (e.keyCode === 27) {
						e.stopPropagation();

						close();
					}
				});
			}
			else {
				modal = $('div.dtr-modal-content');

				if (modal.length && row.index() === modal.data('dtr-row-idx')) {
					modal.empty().append(rendered);
				}
				else {
					// Modal not shown, nothing to update
					return null;
				}
			}

			if (options && options.header) {
				$('div.dtr-modal-content').prepend(
					'<h2>' + options.header(row) + '</h2>'
				);
			}

			return true;
		};
	}
};

/**
 * Display methods - functions which define how the hidden data should be shown
 * in the table.
 *
 * @namespace
 * @name Responsive.defaults
 * @static
 */
Responsive.renderer = {
	listHiddenNodes: function () {
		var fn = function (api, rowIdx, columns) {
			var that = this;
			var ul = $(
				'<ul data-dtr-index="' + rowIdx + '" class="dtr-details"/>'
			);
			var found = false;

			$.each(columns, function (i, col) {
				if (col.hidden) {
					var klass = col.className
						? 'class="' + col.className + '"'
						: '';

					$(
						'<li ' +
							klass +
							' data-dtr-index="' +
							col.columnIndex +
							'" data-dt-row="' +
							col.rowIndex +
							'" data-dt-column="' +
							col.columnIndex +
							'">' +
							'<span class="dtr-title">' +
							col.title +
							'</span> ' +
							'</li>'
					)
						.append(
							$('<span class="dtr-data"/>').append(
								that._childNodes(
									api,
									col.rowIndex,
									col.columnIndex
								)
							)
						) // api.cell( col.rowIndex, col.columnIndex ).node().childNodes ) )
						.appendTo(ul);

					found = true;
				}
			});

			return found ? ul : false;
		};

		fn._responsiveMovesNodes = true;

		return fn;
	},

	listHidden: function () {
		return function (api, rowIdx, columns) {
			var data = $.map(columns, function (col) {
				var klass = col.className
					? 'class="' + col.className + '"'
					: '';

				return col.hidden
					? '<li ' +
							klass +
							' data-dtr-index="' +
							col.columnIndex +
							'" data-dt-row="' +
							col.rowIndex +
							'" data-dt-column="' +
							col.columnIndex +
							'">' +
							'<span class="dtr-title">' +
							col.title +
							'</span> ' +
							'<span class="dtr-data">' +
							col.data +
							'</span>' +
							'</li>'
					: '';
			}).join('');

			return data
				? $(
						'<ul data-dtr-index="' +
							rowIdx +
							'" class="dtr-details"/>'
				).append(data)
				: false;
		};
	},

	tableAll: function (options) {
		options = $.extend(
			{
				tableClass: ''
			},
			options
		);

		return function (api, rowIdx, columns) {
			var data = $.map(columns, function (col) {
				var klass = col.className
					? 'class="' + col.className + '"'
					: '';

				return (
					'<tr ' +
					klass +
					' data-dt-row="' +
					col.rowIndex +
					'" data-dt-column="' +
					col.columnIndex +
					'">' +
					'<td>' +
					( '' !== col.title
						? col.title + ':'
						: ''
					) +
					'</td> ' +
					'<td>' +
					col.data +
					'</td>' +
					'</tr>'
				);
			}).join('');

			return $(
				'<table class="' +
					options.tableClass +
					' dtr-details" width="100%"/>'
			).append(data);
		};
	}
};

/**
 * Responsive default settings for initialisation
 *
 * @namespace
 * @name Responsive.defaults
 * @static
 */
Responsive.defaults = {
	/**
	 * List of breakpoints for the instance. Note that this means that each
	 * instance can have its own breakpoints. Additionally, the breakpoints
	 * cannot be changed once an instance has been creased.
	 *
	 * @type {Array}
	 * @default Takes the value of `Responsive.breakpoints`
	 */
	breakpoints: Responsive.breakpoints,

	/**
	 * Enable / disable auto hiding calculations. It can help to increase
	 * performance slightly if you disable this option, but all columns would
	 * need to have breakpoint classes assigned to them
	 *
	 * @type {Boolean}
	 * @default  `true`
	 */
	auto: true,

	/**
	 * Details control. If given as a string value, the `type` property of the
	 * default object is set to that value, and the defaults used for the rest
	 * of the object - this is for ease of implementation.
	 *
	 * The object consists of the following properties:
	 *
	 * * `display` - A function that is used to show and hide the hidden details
	 * * `renderer` - function that is called for display of the child row data.
	 *   The default function will show the data from the hidden columns
	 * * `target` - Used as the selector for what objects to attach the child
	 *   open / close to
	 * * `type` - `false` to disable the details display, `inline` or `column`
	 *   for the two control types
	 *
	 * @type {Object|string}
	 */
	details: {
		display: Responsive.display.childRow,

		renderer: Responsive.renderer.listHidden(),

		target: 0,

		type: 'inline'
	},

	/**
	 * Orthogonal data request option. This is used to define the data type
	 * requested when Responsive gets the data to show in the child row.
	 *
	 * @type {String}
	 */
	orthogonal: 'display'
};

/*
 * API
 */
var Api = $.fn.dataTable.Api;

// Doesn't do anything - workaround for a bug in DT... Not documented
Api.register('responsive()', function () {
	return this;
});

Api.register('responsive.index()', function (li) {
	li = $(li);

	return {
		column: li.data('dtr-index'),
		row: li.parent().data('dtr-index')
	};
});

Api.register('responsive.rebuild()', function () {
	return this.iterator('table', function (ctx) {
		if (ctx._responsive) {
			ctx._responsive._classLogic();
		}
	});
});

Api.register('responsive.recalc()', function () {
	return this.iterator('table', function (ctx) {
		if (ctx._responsive) {
			ctx._responsive._resizeAuto();
			ctx._responsive._resize();
		}
	});
});

Api.register('responsive.hasHidden()', function () {
	var ctx = this.context[0];

	return ctx._responsive
		? $.inArray(false, ctx._responsive._responsiveOnlyHidden()) !== -1
		: false;
});

Api.registerPlural(
	'columns().responsiveHidden()',
	'column().responsiveHidden()',
	function () {
		return this.iterator(
			'column',
			function (settings, column) {
				return settings._responsive
					? settings._responsive._responsiveOnlyHidden()[column]
					: false;
			},
			1
		);
	}
);

/**
 * Version information
 *
 * @name Responsive.version
 * @static
 */
Responsive.version = '3.0.8';

$.fn.dataTable.Responsive = Responsive;
$.fn.DataTable.Responsive = Responsive;

// Attach a listener to the document which listens for DataTables initialisation
// events so we can automatically initialise
$(document).on('preInit.dt.dtr', function (e, settings, json) {
	if (e.namespace !== 'dt') {
		return;
	}

	if (
		$(settings.nTable).hasClass('responsive') ||
		$(settings.nTable).hasClass('dt-responsive') ||
		settings.oInit.responsive ||
		DataTable.defaults.responsive
	) {
		var init = settings.oInit.responsive;

		if (init !== false) {
			new Responsive(settings, $.isPlainObject(init) ? init : {});
		}
	}
});


return DataTable;
}));


/*! Bootstrap 5 integration for DataTables' Responsive
 * © SpryMedia Ltd - datatables.net/license
 */

(function( factory ){
	if ( typeof define === 'function' && define.amd ) {
		// AMD
		define( ['jquery', 'datatables.net-bs5', 'datatables.net-responsive'], function ( $ ) {
			return factory( $, window, document );
		} );
	}
	else if ( typeof exports === 'object' ) {
		// CommonJS
		var jq = require('jquery');
		var cjsRequires = function (root, $) {
			if ( ! $.fn.dataTable ) {
				require('datatables.net-bs5')(root, $);
			}

			if ( ! $.fn.dataTable.Responsive ) {
				require('datatables.net-responsive')(root, $);
			}
		};

		if (typeof window === 'undefined') {
			module.exports = function (root, $) {
				if ( ! root ) {
					// CommonJS environments without a window global must pass a
					// root. This will give an error otherwise
					root = window;
				}

				if ( ! $ ) {
					$ = jq( root );
				}

				cjsRequires( root, $ );
				return factory( $, root, root.document );
			};
		}
		else {
			cjsRequires( window, jq );
			module.exports = factory( jq, window, window.document );
		}
	}
	else {
		// Browser
		factory( jQuery, window, document );
	}
}(function( $, window, document ) {
'use strict';
var DataTable = $.fn.dataTable;



var _display = DataTable.Responsive.display;
var _original = _display.modal;
var _modal = $(
	'<div class="modal fade dtr-bs-modal" role="dialog">' +
		'<div class="modal-dialog" role="document">' +
		'<div class="modal-content">' +
		'<div class="modal-header">' +
		'<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>' +
		'</div>' +
		'<div class="modal-body"/>' +
		'</div>' +
		'</div>' +
		'</div>'
);
var modal;

// Note this could be undefined at the time of initialisation - the
// DataTable.Responsive.bootstrap function can be used to set a different
// bootstrap object
var _bs = window.bootstrap;

DataTable.Responsive.bootstrap = function (bs) {
	_bs = bs;
};

// Get the Bootstrap library from locally set (legacy) or from DT.
function getBs() {
	let dtBs = DataTable.use('bootstrap');

	if (dtBs) {
		return dtBs;
	}

	if (_bs) {
		return _bs;
	}

	throw new Error('No Bootstrap library. Set it with `DataTable.use(bootstrap);`');
}

_display.modal = function (options) {
	if (!modal && _bs.Modal) {
		let localBs = getBs();
		modal = new localBs.Modal(_modal[0]);
	}

	return function (row, update, render, closeCallback) {
		if (! modal) {
			return _original(row, update, render, closeCallback);
		}
		else {
			var rendered = render();

			if (rendered === false) {
				return false;
			}

			if (!update) {
				if (options && options.header) {
					var header = _modal.find('div.modal-header');
					var button = header.find('button').detach();

					header
						.empty()
						.append('<h4 class="modal-title">' + options.header(row) + '</h4>')
						.append(button);
				}

				_modal.find('div.modal-body').empty().append(rendered);

				_modal
					.data('dtr-row-idx', row.index())
					.one('hidden.bs.modal', closeCallback)
					.appendTo('body');

				modal.show();
			}
			else {
				if ($.contains(document, _modal[0]) && row.index() === _modal.data('dtr-row-idx')) {
					_modal.find('div.modal-body').empty().append(rendered);
				}
				else {
					// Modal not shown for this row - do nothing
					return null;
				}
			}

			return true;
		}
	};
};


return DataTable;
}));