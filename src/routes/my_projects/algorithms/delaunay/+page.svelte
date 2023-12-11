<script>
	import { onMount } from 'svelte';
	import { TW } from './colors-tailwind.js';

	/** @type {HTMLElement} */
	let cnv;
	/** @type {CanvasRenderingContext2D} */
	let ctx;

	let [width, height] = [800, 800];
	let aspectRatio = height / width;
	let doLoop = 1;
	let frame = 0;
	const delta = 1 / 60;

	//#region ALL THE MAGIC FUCKERY
	const translated = { x: 0, y: 0 };
	const PI = Math.PI;
	const TAU = Math.PI * 2;
	let RECT_MODE = 'DEFAULT'; // [DEFAULT, CORNERS, CORNER, CENTER, RADIUS]
	let LINE_MODE = 'BUTT'; // [BUTT, ROUND, SQUARE]

	//#region // *** Drawing *** //
	/**
	 * @param {number} x
	 * @param {number} y
	 */
	function translate(x, y, p = 'add') {
		if (p === 'add') {
			translated.x += x;
			translated.y += y;
		}
		if (p === 'set') {
			translated.x = x;
			translated.y = y;
		}
	}

	/**
	 * @param {any} n
	 */
	function noSmooth(n) {
		ctx.imageSmoothingEnabled = false;
	}

	/**
	 * @param {string} c
	 * @param {number} b
	 */
	function shadow(c, b, ox = 0, oy = 0) {
		ctx.shadowColor = c ?? '';
		ctx.shadowBlur = b ?? '';
		ctx.shadowOffsetX = ox;
		ctx.shadowOffsetY = oy;
	}

	/**
	 * @param {number} w
	 * @param {number} [h]
	 */
	function size(w, h) {
		// @ts-ignore
		cnv.width = width = w;
		// @ts-ignore
		cnv.height = height = h ?? w;
		aspectRatio = (h ?? w) / w;
	}

	function rectMode(m = 'CENTER') {
		RECT_MODE = m;
	}

	/**
	 * @param {string} c
	 */
	function fill(c = 'transparent') {
		ctx.fillStyle = c;
	}

	/**
	 * @param {string} c
	 */
	function stroke(c = 'transparent') {
		ctx.strokeStyle = c;
	}

	/**
	 * @param {number} w
	 */
	function strokeWidth(w) {
		ctx.lineWidth = w ?? 1;
	}

	/**
	 * @param {string} c
	 */
	function background(c = 'transparent') {
		ctx.fillStyle = c;
		ctx.fillRect(0, 0, width, height);
	}

	/**
	 * @param {string} t
	 * @param {number} x
	 * @param {number} y
	 */
	function text(t, x, y) {
		strokeWidth(3);
		ctx.strokeText(t, x + translated.x, -y + translated.y);
		ctx.fillText(t, x + translated.x, -y + translated.y);
	}

	function font(name = 'Fira Code', size = 24) {
		ctx.font = `${size}px "${name}"`;
	}

	/**
	 * @param {number} x1
	 * @param {number} y1
	 * @param {number} x2
	 * @param {number} y2
	 */
	function rect(x1, y1, x2, y2) {
		ctx.beginPath();

		if (RECT_MODE === 'DEFAULT') ctx.rect(x1, y1, x2, y2);
		if (RECT_MODE === 'CORNERS') ctx.rect(x1 + translated.x, -y1 + translated.y, x2 - x1, -(y2 - y1));
		if (RECT_MODE === 'CORNER') ctx.rect(x1 + translated.x, y1 + translated.y, x2, y2);
		if (RECT_MODE === 'CENTER') ctx.rect(x1 + translated.x - x2 / 2, -y1 + translated.y - y2 / 2, x2, y2);
		if (RECT_MODE === 'RADIUS') ctx.rect(x1 + translated.x - x2, -y1 + translated.y - y2, x2 * 2, y2 * 2);

		ctx.closePath();
		ctx.fill();
		ctx.stroke();
	}

	/**
	 * @param {number} x
	 * @param {number} y
	 * @param {number} rw
	 * @param {number} rh
	 */
	function romb(x, y, rw, rh) {
		ctx.beginPath();
		ctx.moveTo(x + translated.x, -y + translated.y + rh);
		ctx.lineTo(x + translated.x + rw, -y + translated.y);
		ctx.lineTo(x + translated.x, -y + translated.y - rh);
		ctx.lineTo(x + translated.x - rw, -y + translated.y);
		ctx.lineTo(x + translated.x, -y + translated.y + rh);
		ctx.closePath();
		ctx.fill();
		ctx.stroke();
	}

	/**
	 * @param {number} x
	 * @param {number} y
	 * @param {number} r
	 */
	function point(x, y, r) {
		ctx.beginPath();
		ctx.ellipse(x + translated.x, -y + translated.y, r, r, 0, PI * 2, 0);
		ctx.closePath();
		ctx.fill();
		ctx.stroke();
	}

	/**
	 * @param {number} x
	 * @param {number} y
	 * @param {number} r1
	 * @param {number} r2
	 */
	function ellipse(x, y, r1, r2, a = 0) {
		ctx.beginPath();
		ctx.ellipse(x + translated.x, -y + translated.y, r1, r2, a, PI * 2, 0);
		ctx.closePath();
		ctx.fill();
		ctx.stroke();
	}

	function lineMode(mode = 'BUTT') {
		LINE_MODE = mode;
	}

	/**
	 * @param {number} x1
	 * @param {number} y1
	 * @param {number} x2
	 * @param {number} y2
	 */
	function line(x1, y1, x2, y2) {
		ctx.beginPath();
		ctx.moveTo(x1 + translated.x, -y1 + translated.y);
		ctx.lineCap = 'round'; //LINE_MODE.toLowerCase()
		ctx.lineTo(x2 + translated.x, -y2 + translated.y);
		ctx.stroke();
	}

	function beginPath() {
		ctx.beginPath();
	}

	/**
	 * @param {number} x
	 * @param {number} y
	 */
	function vertex(x, y) {
		ctx.lineTo(x + translated.x, -y + translated.y);
	}

	function closePath() {
		ctx.stroke();
		ctx.closePath();
	}

	/**
	 * @param {number} x
	 * @param {number} y
	 * @param {number} r
	 * @param {number} t
	 */
	function hexagon(x, y, r, t) {
		ctx.beginPath();
		for (let a = 0; a < 6; a++) {
			ctx.lineTo(x + translated.x + cos(a * (PI / 3) + t) * r, -y + translated.y + sin(a * (PI / 3) + t) * r);
		}
		ctx.closePath();
		ctx.fill();
		ctx.stroke();
	}

	class Color {
		static Black = 'hsla(0, 0%, 0%, 1)';
		static Gray50 = 'hsla(0, 0%, 5%, 1)';
		static Gray100 = 'hsla(0, 0%, 10%, 1)';
		static Gray200 = 'hsla(0, 0%, 20%, 1)';
		static Gray300 = 'hsla(0, 0%, 30%, 1)';
		static Gray400 = 'hsla(0, 0%, 40%, 1)';
		static Gray500 = 'hsla(0, 0%, 50%, 1)';
		static Gray600 = 'hsla(0, 0%, 60%, 1)';
		static Gray700 = 'hsla(0, 0%, 70%, 1)';
		static Gray800 = 'hsla(0, 0%, 80%, 1)';
		static Gray900 = 'hsla(0, 0%, 90%, 1)';
		static White = 'hsla(0, 0%, 100%, 1)';
		static Red = 'hsla(0, 60%, 60%, 1)';
		static Orange = 'hsla(30, 60%, 60%, 1)';
		static Yellow = 'hsla(60, 60%, 60%, 1)';
		static Green = 'hsla(120, 60%, 60%, 1)';
		static LightBlue = 'hsla(180, 60%, 60%, 1)';
		static Blue = 'hsla(210, 60%, 60%, 1)';
		static Indigo = 'hsla(240, 60%, 60%, 1)';
		static Purple = 'hsla(270, 60%, 60%, 1)';
		static Pink = 'hsla(300, 60%, 60%, 1)';
		static RandomHue = () => `hsla(${random.int(360)}, 60%, 60%, 1)`;
		static RandomGray = () => `hsla(0, 0%, ${random.int(100)}%, 1)`;
		static HueFrom = (/** @type {any} */ value) => `hsla(${value}, 50%, 50%, 1)`;
		static GrayFrom = (/** @type {any} */ value) => `hsla(0, 0%, ${value}%, 1)`;
	}

	/**
	 * @param {String} color r-g-b-a > example: 102-51-153-204
	 * @returns [ [r, g, b, a], 'rgba(r, g, b, a)' ]
	 */
	function getColorFromString(color) {
		const c = color.split('-').map((n) => parseInt(n));
		return { values: c, color: `rgba(${c.join(', ')})` };
	}
	//#endregion

	//#region // *** Math *** //
	/**
	 * @param {number} value
	 * @param {number} minIn
	 * @param {number} maxIn
	 * @param {number} minOut
	 * @param {number} maxOut
	 */
	function map(value, minIn, maxIn, minOut, maxOut) {
		return ((value - minIn) * (maxOut - minOut)) / (maxIn - minIn) + minOut;
	}
	/**
	 * @param {number} value
	 * @param {number} minIn
	 * @param {number} maxIn
	 */
	function norm(value, minIn, maxIn) {
		return (value - minIn) / (maxIn - minIn);
	}
	/**
	 * @param {number} value
	 * @param {number} v_min
	 * @param {number} v_max
	 */
	function clamp(value, v_min, v_max) {
		return max(min(value, v_max), v_min);
	}
	/**
	 * @param {number} a
	 * @param {number} b
	 * @param {number} t
	 */
	function lerp(a, b, t) {
		return a * (1 - t) + b * t;
	}
	function min() {
		return Math.min(...Array.from(arguments));
	}
	function max() {
		return Math.max(...Array.from(arguments));
	}
	/**
	 * @param {number} v
	 */
	function sin(v) {
		return Math.sin(v);
	}
	/**
	 * @param {number} v
	 */
	function cos(v) {
		return Math.cos(v);
	}
	/**
	 * @param {number} v
	 */
	function abs(v) {
		return Math.abs(v);
	}
	/**
	 * @param {number} v
	 */
	function floor(v) {
		return Math.floor(v);
	}
	/**
	 * @param {number} v
	 */
	function ceil(v) {
		return Math.ceil(v);
	}
	/**
	 * @param {number} v
	 */
	function round(v, p = 0) {
		return Math.round(v * 10 ** p) / 10 ** p;
	}
	/** @type {Object<number, number>} */
	const sqrtTable = {};
	/**
	 * @param {number} v
	 */
	function sqrt(v) {
		return sqrtTable[v] ?? (sqrtTable[v] = Math.sqrt(v));
	}
	/**
	 * @param {number} d
	 */
	function dtr(d) {
		return (d * PI) / 180;
	}
	/**
	 * @param {number} r
	 */
	function rtd(r) {
		return (r * 180) / PI;
	}
	/**
	 * @param {number} x
	 * @param {number} y
	 */
	function atan2(x, y) {
		return Math.atan2(y, x);
	}
	/**
	 * @param {number} x
	 * @param {number} p
	 */
	function pow(x, p) {
		return Math.pow(x, p);
	}
	/**
	 * @param {number} v
	 * @returns {number}
	 */
	function sign(v) {
		return Math.sign(v) === 1 ? 1 : -1;
	}
	/**
	 * @param {number} x1
	 * @param {number} y1
	 * @param {number} x2
	 * @param {number} y2
	 * @param {number} x3
	 * @param {number} y3
	 * @param {number} x4
	 * @param {number} y4
	 */
	function intersect(x1, y1, x2, y2, x3, y3, x4, y4) {
		let slope1 = (y2 - y1) / (x2 - x1);
		let slope2 = (y4 - y3) / (x4 - x3);

		if (slope1 === slope2) return false;

		let x = (y3 - y1 + slope1 * x1 - slope2 * x3) / (slope1 - slope2);
		let y = slope1 * (x - x1) + y1;

		if (x < min(x1, x2) || x > max(x1, x2) || x < min(x3, x4) || x > max(x3, x4)) return false;
		if (y < min(y1, y2) || y > max(y1, y2) || y < min(y3, y4) || y > max(y3, y4)) return false;

		return true;
	}
	/**
	 * @param {number} x1
	 * @param {number} y1
	 * @param {number} x2
	 * @param {number} y2
	 * @param {number} x3
	 * @param {number} y3
	 */
	function area_triangle(x1, y1, x2, y2, x3, y3) {
		return abs(x1 * (y2 - y3) + x2 * (y3 - y1) + x3 * (y1 - y2)) / 2;
	}
	/**
	 * @param {number} x
	 * @param {number} y
	 * @param {number} x1
	 * @param {number} y1
	 * @param {number} x2
	 * @param {number} y2
	 */
	function distance_sq(x, y, x1, y1, x2, y2) {
		const foo = (
			/** @type {number} */ x1,
			/** @type {number} */ y1,
			/** @type {number} */ x2,
			/** @type {number} */ y2
		) => (x1 - x2) ** 2 + (y1 - y2) ** 2;
		const l = foo(x1, y1, x2, y2);
		const t = clamp(((x - x1) * (x2 - x1) + (y - y1) * (y2 - y1)) / l, 0, 1);
		return foo(x, y, x1 + t * (x2 - x1), y1 + t * (y2 - y1));
	}
	//#endregion

	//#region // *** Utility *** //
	/** @param {any[]} args */
	function log(...args) {
		let result = [];
		for (let i = 0; i < args.length; i++) {
			result.push(JSON.parse(JSON.stringify(args[i])));
		}
		console.log(...result);
	}

	const random = {
		/** @returns {number} */
		float: function (/**@type {number}*/ b = 1, /**@type {number}*/ a = 0) {
			if (typeof a !== 'number' || typeof b !== 'number') {
				console.error('random.float function error: ', arguments);
				return NaN;
			}
			return a + (b - a) * Math.random();
		},
		/** @returns {number} */
		int: function (/**@type {number}*/ b = 1, /**@type {number}*/ a = 0) {
			if (typeof a !== 'number' || typeof b !== 'number')
				if (typeof a !== 'number' || typeof b !== 'number') {
					console.error('random.int function error: ', arguments);
					return NaN;
				}
			return Math.floor(random.float(a, b));
		},
		boolean: function () {
			return Math.random() < 0.5;
		},
		sign: function (a = 1) {
			if (typeof a !== 'number') {
				console.error('random.sign function error: ', arguments);
				return NaN;
			}
			return (Math.random() * 2 - 1) * a;
		},
		/** @returns {any} */
		array: function (/** @type {Array<any>} */ a) {
			if (a == null || !Array.isArray(a)) {
				console.error('random.array function error: ', arguments);
				return a;
			}
			return a[random.int(a.length)];
		},
		/** @returns {Array<any>} */
		array_shuffle: function (/** @type {Array<any>} */ a) {
			if (a == null || !Array.isArray(a)) {
				console.error('random.array_shuffle function error: ', arguments);
				return a;
			}
			for (let i = 0; i < a.length; i++) {
				const j = random.int(a.length);
				const temp = a[i];
				a[i] = a[j];
				a[j] = temp;
			}
			return a;
		},
		/** @returns {Array<any>} */
		array_subset: function (/** @type {Array<any>} */ a) {
			if (a == null || !Array.isArray(a)) {
				console.error('random.array_subset function error: ', arguments);
				return a;
			}
			const num = random.int(a.length);
			const shuffled = random.array_shuffle(a.slice());
			return shuffled.slice(0, num);
		},
		object: function (/** @type {Object<any, any>} */ o) {
			if (o == null || typeof o !== 'object') return console.error('random.object function error: ', arguments);
			return random.array(Object.values(o));
		},
		weight: function (/** @type {Array<any>} */ a) {
			// a = [['a', 1], ['b', 2], ['c', 3]]; <-> a: [[value, weight]; N]
			if (!Array.isArray(a) || a.length === 0 || a.some((v) => !Array.isArray(v) || v.length === 0))
				return console.error('random function error: ', arguments);

			const values = a.map((value) => value[0]);
			const weights = a.map((value) => value[1]);
			const sum = weights.reduce((a, b) => a + b);

			const r = random.int(sum);
			for (let i = 0, current = 0; i < a.length; i++) {
				if (r < current) return values[i - 1];
				current += weights[i];
			}

			return values[a.length - 1];
		},
	};

	/**
	 * @param skew bigger skew for max, lesser skew for min
	 */
	function random_bell(min = 0, max = 1, skew = 1) {
		let u = 0,
			v = 0;
		while (u === 0) u = Math.random();
		while (v === 0) v = Math.random();
		let num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);

		num = num / 10.0 + 0.5;
		if (num > 1 || num < 0) num = random_bell(min, max, skew);
		else {
			num = Math.pow(num, 1 / skew);
			num *= max - min;
			num += min;
		}
		return num;
	}

	/**
	 * @param {number} v
	 */
	function prng(v) {
		const x = Math.sin(v + 1e-9) * Math.cos(v + 1e-9) * 1000000;
		return x - Math.floor(x);
	}

	/**
	 * @param {number} start
	 * @param {number} stop
	 */
	function range(start, stop, step = 1) {
		if (arguments.length === 1) {
			stop = start;
			start = 0;
		}

		if ((step > 0 && start >= stop) || (step < 0 && start <= stop)) {
			return [];
		}

		const result = [];
		for (let i = start; step > 0 ? i < stop : i > stop; i += step) {
			result.push(i);
		}

		return result;
	}

	/**
	 * @param {number} x
	 * @param {number} b
	 */
	function biased(x, b) {
		const k = (1 - b) ** 3;
		return (x * k) / (x * (k - 1) + 1);
	}

	/**
	 * @param {number} x
	 * @param {number} a
	 */
	function easing_exp(x, a) {
		if (x < 0 || x > 1) return console.error('easing error', arguments);
		if (x === 0) return 0;
		if (x === 1) return 1;
		if (x <= 0.5) return (1 - pow(2, -2 * a * x)) / 2;
		if (x > 0.5) return (1 + pow(2, 2 * a * (x - 1))) / 2;
	}

	/**
	 * @param {number} x
	 */
	function easing_quad(x) {
		if (x < 0 || x > 1) return console.error('easing error', arguments);
		if (x <= 0.5) return (1 - (-2 * x + 1) * (-2 * x + 1)) / 2;
		if (x > 0.5) return 0.5 + 2 * (x - 0.5) * (x - 0.5);
	}

	/**
	 * @param {string} s
	 */
	function reverse(s) {
		let t = '';
		for (let i = 0; i < s.length; i++) t += s[s.length - 1 - i];
		return t;
	}

	/**
	 * @param {number} dim number of dimensions (1D, 2D, etc.)
	 * @param {(number|Array<number>)} len length of each dimension - int | int[]
	 * @param {any} def default value for all entries
	 * @returns {Array<any> | null}
	 */
	function createArray(dim, len, def = null) {
		if (typeof len === 'number') {
			if (dim < 1) return null;
			if (dim === 1) return Array.from({ length: max(len, 1) }, () => (typeof def === 'function' ? def() : def));

			return Array.from({ length: max(len, 1) }, () => createArray(dim - 1, len, def));
		} else if (Array.isArray(len)) {
			if (dim < 1) return null;
			if (dim === 1)
				return Array.from({ length: max(len[0], 1) }, () => (typeof def === 'function' ? def() : def));

			return Array.from({ length: max(len[0], 1) }, () => createArray(dim - 1, len.slice(1), def));
		} else {
			console.error('createArray error: ', arguments);
			return null;
		}
	}

	/**
	 * @param {ArrayLike<any> | { [s: string]: any; }} obj
	 */
	function swapKeysAndValues(obj) {
		return Object.fromEntries(Object.entries(obj).map((e) => [e[1], e[0]]));
	}

	class Point {
		static POINT_ID = 0;
		static MIN_SPEED = 0.5;
		static MAX_SPEED = 2;
		static MIN_ACC = -0.1;
		static MAX_ACC = 0.1;

		constructor(x = 0, y = 0) {
			this.x = x;
			this.y = y;

			this.a = random.sign(PI);
			this.dx = round(cos(this.a));
			this.dy = round(sin(this.a));

			this.s = random.float(Point.MIN_SPEED, Point.MAX_SPEED);
			this.ds = random.float(0.01);

			this.hue = map(this.s, 0.5, 2, 0, 120);
			this.color = `hsla(${this.hue}, 60%, 60%)`;
			this.id = Point.POINT_ID++;
		}

		render() {
			stroke(Color.Black);
			strokeWidth(0.5);
			fill(this.color);
			point(this.x, this.y, map(this.s, Point.MIN_SPEED, Point.MAX_SPEED, 3, 2) ** 2);
		}

		update() {
			this.x = round(this.x + this.dx * this.s, 3);
			this.y = round(this.y + this.dy * this.s, 3);

			this.s = clamp(this.s + this.ds, Point.MIN_SPEED, Point.MAX_SPEED);
			this.ds = clamp(this.ds + random.sign(Point.MIN_ACC / 10), Point.MIN_ACC, Point.MAX_ACC);

			this.hue = map(this.s, Point.MIN_SPEED, Point.MAX_SPEED, 120, 0);
			this.color = `hsla(${this.hue}, 60%, 60%)`;

			this.a = clamp(this.a + random.sign(PI) * 0.01, -PI, PI);
			this.dx = cos(this.a);
			this.dy = sin(this.a);

			if (this.x < -width / 2 + 4 || this.x > width / 2 - 4) {
				this.x = -this.x + 4 * sign(this.x);
			}
			if (this.y < -height / 2 + 4 || this.y > height / 2 - 4) {
				this.y = -this.y + 4 * sign(this.y);
			}
		}

		/**
		 * @param {number} s
		 * @returns {Point}
		 */
		mult(s) {
			return new Point(this.x * s, this.y * s);
		}

		/**
		 * @param {Point} v
		 * @returns {Point}
		 */
		add(v) {
			return new Point(this.x + v.x, this.y + v.y);
		}

		/**
		 * @param {Point} v
		 * @returns {Point}
		 */
		sub(v) {
			return new Point(this.x - v.x, this.y - v.y);
		}

		/**
		 * @param {number | Point} p
		 * @returns {Point}
		 */
		max(p) {
			if (typeof p === 'number') {
				return new Point(Math.max(this.x, p), Math.max(this.y, p));
			}
			if (typeof p === 'object') {
				return new Point(Math.max(this.x, p.x), Math.max(this.y, p.y));
			}
			return this;
		}

		/**
		 * @param {number | Point} p
		 * @returns {Point}
		 */
		min(p) {
			if (typeof p === 'number') {
				return new Point(Math.min(this.x, p), Math.min(this.y, p));
			}
			if (typeof p === 'object') {
				return new Point(Math.min(this.x, p.x), Math.min(this.y, p.y));
			}
			return this;
		}

		copy() {
			return new Point(this.x, this.y);
		}

		/**
		 * @param p {Point}
		 * @returns {number}
		 */
		dot(p) {
			return this.x * p.x + this.y * p.y;
		}

		/**
		 * @returns {Point}
		 */
		norm() {
			const len = Math.sqrt(this.x * this.x + this.y * this.y);
			return new Point(this.x / len, this.y / len);
		}

		/**
		 * @param n {number} - scaling factor
		 * @returns {Point}
		 */
		scale(n) {
			const len = Math.sqrt(this.x * this.x + this.y * this.y) / n;
			return new Point(this.x / len, this.y / len);
		}

		/**
		 * @param p {Point}
		 * @returns {boolean}
		 */
		eq(p) {
			return this.x == p.x && this.y == p.y;
		}

		/** @returns {Point} */
		static get zero() {
			return new Point(0, 0);
		}
		/** @returns {Point} */
		static get up() {
			return new Point(0, 1);
		}
		/** @returns {Point} */
		static get right() {
			return new Point(1, 0);
		}
		/** @returns {Point} */
		static get down() {
			return new Point(0, -1);
		}
		/** @returns {Point} */
		static get left() {
			return new Point(-1, 0);
		}

		static random2() {
			const a = random.float(Math.PI * 2);
			return new Point(cos(a), sin(a));
		}
	}

	class Triangle {
		/**
		 * @param p0 {Point}
		 * @param p1 {Point}
		 * @param p2 {Point}
		 */
		constructor(p0, p1, p2) {
			this.p0 = p0;
			this.p1 = p1;
			this.p2 = p2;
		}

		render() {
			strokeWidth(width * 0.0025);
			let [p0, p1, p2] = [this.p0, this.p1, this.p2];
			let [q01, q12, q20] = [p1.add(p0).mult(0.5), p2.add(p1).mult(0.5), p0.add(p2).mult(0.5)];

			stroke(p0.color);
			line(p0.x, p0.y, q01.x, q01.y);
			line(p0.x, p0.y, q20.x, q20.y);

			stroke(p1.color);
			line(p1.x, p1.y, q12.x, q12.y);
			line(p1.x, p1.y, q01.x, q01.y);

			stroke(p2.color);
			line(p2.x, p2.y, q20.x, q20.y);
			line(p2.x, p2.y, q12.x, q12.y);
		}

		/**
		 * https://iquilezles.org/articles/distfunctions2d/ --> triangle - exact
		 * @param p  {Point}
		 * @returns  {number}
		 */
		sdf(p) {
			const e0 = this.p1.sub(this.p0);
			const e1 = this.p2.sub(this.p1);
			const e2 = this.p0.sub(this.p2);

			const v0 = p.sub(this.p0);
			const v1 = p.sub(this.p1);
			const v2 = p.sub(this.p2);

			const pq0 = v0.sub(e0.mult(min(max(v0.dot(e0) / e0.dot(e0), 0), 1)));
			const pq1 = v1.sub(e1.mult(min(max(v1.dot(e1) / e1.dot(e1), 0), 1)));
			const pq2 = v2.sub(e2.mult(min(max(v2.dot(e2) / e2.dot(e2), 0), 1)));

			const s = sign(e0.x * e2.y - e0.y * e2.x);

			const d = new Point(pq0.dot(pq0), s * (v0.x * e0.y - v0.y * e0.x))
				.min(new Point(pq1.dot(pq1), s * (v1.x * e1.y - v1.y * e1.x)))
				.min(new Point(pq2.dot(pq2), s * (v2.x * e2.y - v2.y * e2.x)));

			return -sqrt(d.x) * sign(d.y);
		}

		/**
		 * @param {Point} p
		 * @returns {boolean}
		 */
		in_circle(p) {
			const dx = this.p0.x - p.x;
			const dy = this.p0.y - p.y;
			const ex = this.p1.x - p.x;
			const ey = this.p1.y - p.y;
			const fx = this.p2.x - p.x;
			const fy = this.p2.y - p.y;

			const ap = dx * dx + dy * dy;
			const bp = ex * ex + ey * ey;
			const cp = fx * fx + fy * fy;

			return dx * (ey * cp - bp * fy) - dy * (ex * cp - bp * fx) + ap * (ex * fy - ey * fx) > 0;
		}
	}
	//#endregion

	//#endregion

	onMount(() => {
		cnv = document.querySelector('canvas#cnv') ?? document.createElement('canvas'); // @ts-ignore
		ctx = cnv.getContext('2d');

		(function setup() {
			size(800);
			translate(width / 2, height / 2, 'set');

			console.log('%cloop started', 'font-size: 1rem; color: lightblue');
			loop();
		})();
	});

	/** @type {Point[]} */
	let points = [];
	/** @type {Triangle[]} */
	let triangles = [];

	const sup = new Triangle(new Point(0, height * 2), new Point(-width * 2, -height), new Point(width * 2, -height));

	function update() {
		for (let i = 0; i < points.length; i++) {
			points[i].update();
		}
		points = points;

		triangulate();
	}

	function render() {
		background(TW.gray[700]);

		for (let i = 0; i < triangles.length; i++) {
			triangles[i].render();
		}
		for (let i = 0; i < points.length; i++) {
			points[i].render();
		}
	}

	function loop() {
		update();
		render();
		frame++;
		(doLoop && setTimeout(loop, delta * 1000)) || console.log('%c	loop ended', 'font-size: 1rem; color: lightgreen');
	}

	function create_random_point() {
		let [x, y] = [random.int(width * 0.45) * random.sign(), random.int(height * 0.45) * random.sign()];
		points = [...points, new Point(x, y)];
	}
	function delete_last_point() {
		points.pop();
		points = points;
	}

	function triangulate() {
		/** @type {Triangle[]} */
		let triangulation = [sup];

		for (let i = 0; i < points.length; i++) {
			const p = points[i];

			/** @type {number[]} */
			let badTriangles = [];
			for (let j = 0; j < triangulation.length; j++) {
				if (triangulation[j].in_circle(p)) {
					badTriangles.push(j);
				}
			}

			/** @type {Point[][]} */
			let polygon = [];
			for (let j = 0; j < badTriangles.length; j++) {
				const t = triangulation[badTriangles[j]];
				const e = [
					[t.p0, t.p1],
					[t.p1, t.p2],
					[t.p2, t.p0],
				];
				let flag = [true, true, true];
				for (let k = 0; k < badTriangles.length; k++) {
					if (k === j) continue;
					const t1 = triangulation[badTriangles[k]];
					const e1 = [
						[t1.p0, t1.p1],
						[t1.p1, t1.p2],
						[t1.p2, t1.p0],
					];

					for (let u = 0; u < 3; u++) {
						for (let v = 0; v < 3; v++) {
							if (
								(e[u][0].eq(e1[v][0]) && e[u][1].eq(e1[v][1])) ||
								(e[u][0].eq(e1[v][1]) && e[u][1].eq(e1[v][0]))
							)
								flag[u] = false;
						}
					}
				}
				for (let k = 0; k < 3; k++) if (flag[k]) polygon.push(e[k]);
			}

			for (let j = badTriangles.length - 1; j >= 0; j--) {
				triangulation.splice(badTriangles[j], 1);
			}

			for (let j = 0; j < polygon.length; j++) {
				const e = polygon[j];
				triangulation.push(new Triangle(e[0], e[1], p));
			}
		}

		/** @type {number[]} */
		let badTriangles = [];
		for (let i = 0; i < triangulation.length; i++) {
			const t = triangulation[i];
			if (
				t.p0.eq(sup.p0) ||
				t.p0.eq(sup.p1) ||
				t.p0.eq(sup.p2) ||
				t.p1.eq(sup.p0) ||
				t.p1.eq(sup.p1) ||
				t.p1.eq(sup.p2) ||
				t.p2.eq(sup.p0) ||
				t.p2.eq(sup.p1) ||
				t.p2.eq(sup.p2)
			)
				badTriangles.push(i);
		}

		for (let i = badTriangles.length - 1; i >= 0; i--) {
			triangulation.splice(badTriangles[i], 1);
		}

		triangles = triangulation;
	}
</script>

<main>
	<canvas id="cnv" width="800" height="800" bind:this={cnv} />
	<div id="menu">
		<div id="point-make">
			<button class="btn" id="btn-create" on:click={create_random_point}>Add A Random Point</button>
			<button class="btn" id="btn-remove" on:click={delete_last_point}>Remove The Last Point</button>
		</div>
		<h3>Points</h3>
		<div id="point-list">
			{#each points as p, i}
				<div class="pid" id="pid-{p.id}">
					<label style="--accent:{p.color}">
						X<sub>{i}</sub>:
						<input
							type="number"
							min={-width / 2}
							max={width / 2}
							step="0.1"
							readonly
							id={p.id.toString()}
							bind:value={p.x}
						/>
						<input
							type="range"
							min={-width / 2}
							max={width / 2}
							step="0.1"
							readonly
							id={p.id.toString()}
							bind:value={p.x}
						/>
					</label>
					<label for="Y-{p.id}" style="--accent:{p.color}">
						Y<sub>{i}</sub>:
						<input
							type="number"
							min={-height / 2}
							max={height / 2}
							step="0.1"
							readonly
							id={p.id.toString()}
							bind:value={p.y}
						/>
						<input
							type="range"
							min={-height / 2}
							max={height / 2}
							step="0.1"
							readonly
							id={p.id.toString()}
							bind:value={p.y}
						/>
					</label>
				</div>
				<br />
			{/each}
		</div>
	</div>
</main>

<style>
	main {
		width: 100%;
		height: 100%;
		padding: 1rem;
		display: grid;
		place-items: center;
		grid-auto-flow: column;

		& > #cnv {
			justify-self: center;
			width: clamp(400px, 100%, 800px);
			padding: 2rem;
		}

		& > #menu {
			display: grid;
			justify-content: center;
			align-items: start;
			grid-template-rows: auto 0 3fr;
			overflow-y: hidden;

			padding: 1rem;
			height: 100%;
			gap: 2rem;
			border-radius: 1rem;
			background: var(--ctp-mocha-mantle);

			& > #point-make {
				width: 100%;
				height: fit-content;
				display: grid;
				gap: 1rem;

				& > .btn {
					--_pri: var(--pri, var(--ctp-mocha-text));
					--_sec: var(--sec, var(--ctp-mocha-overlay2));
					padding: 0.25rem 1rem;
					border-radius: 1rem;
					font-size: inherit;
					font-weight: bold;
					color: var(--ctp-mocha-base);
					background: var(--_pri);
					box-shadow: 0 0 0.2rem 0.1rem var(--_sec);
					width: 100%;
				}

				& > #btn-create {
					--pri: var(--ctp-mocha-green);
					--sec: var(--ctp-mocha-teal);
				}
				& > #btn-remove {
					--pri: var(--ctp-mocha-red);
					--sec: var(--ctp-mocha-mauve);
				}
				& > #btn-triangulate {
					--pri: var(--ctp-mocha-sky);
					--sec: var(--ctp-mocha-blue);
				}
				& > #btn-create-triangulate {
					--pri: var(--ctp-mocha-teal);
					--sec: var(--ctp-mocha-sky);
				}
			}

			& > #point-list {
				width: 100%;
				height: 100%;
				padding: 2rem;
				background: var(--ctp-mocha-crust);
				border-radius: 0.25rem;
				gap: 1rem;

				overflow-y: scroll;
				overflow-x: hidden;
				&::-webkit-scrollbar {
					width: 0.5rem;
				}
				&::-webkit-scrollbar-track {
					background: transparent;
				}
				&::-webkit-scrollbar-thumb {
					background: var(--ctp-mocha-text);
					border-radius: 100vw;
				}
				&::-webkit-scrollbar-thumb:hover {
					background: #555;
				}

				& > div.pid {
					display: grid;
				}

				& label {
					color: var(--accent);
				}

				& input[type='number'] {
					color: var(--ctp-mocha-text);
					background: var(--ctp-mocha-mantle);
					border: none;
					font-size: 1rem;
					padding-right: 1ch;
					border-radius: 0.5rem;
					width: 5ch;
					text-align: start;
				}

				/* & input[type='range'] {
					accent-color: var(--accent);
				} */
			}
		}
	}

	:global(input::-webkit-outer-spin-button, input::-webkit-inner-spin-button) {
		appearance: none;
		margin: 0;
	}

	@media only screen and (orientation: portrait) {
		main {
			grid-auto-flow: row;
		}

		main > #cnv {
			width: clamp(400px, 100%, 600px);
		}

		main > #menu {
			font-size: 1rem;
			width: 100%;
		}
	}
</style>
