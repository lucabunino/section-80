/** @type {{ el: HTMLElement, x: number, y: number, vx: number, vy: number, w: number, h: number, paused: boolean, mask: { alpha: Uint8Array, w: number, h: number } | null }[]} */
const balls = []
let rafId = null

const SPEED = 1.2
const SPEED_MAX = SPEED * 8
const MASK_SIZE = 64
const SAMPLE_STEP = 3
const INERTIA = .998

function randomSign() {
	return Math.random() > 0.5 ? 1 : -1
}

/**
 * @param {HTMLImageElement} imgEl
 * @param {number} displayW
 * @param {number} displayH
 * @returns {{ alpha: Uint8Array, w: number, h: number }}
 */
function createMask(imgEl, displayW, displayH) {
	const aspect = displayW / displayH
	const mw = aspect >= 1 ? MASK_SIZE : Math.round(MASK_SIZE * aspect)
	const mh = aspect >= 1 ? Math.round(MASK_SIZE / aspect) : MASK_SIZE
	const canvas = new OffscreenCanvas(mw, mh)
	const ctx = canvas.getContext('2d')
	ctx.drawImage(imgEl, 0, 0, mw, mh)
	const { data } = ctx.getImageData(0, 0, mw, mh)
	const alpha = new Uint8Array(mw * mh)
	for (let i = 0; i < mw * mh; i++) alpha[i] = data[i * 4 + 3]
	return { alpha, w: mw, h: mh }
}

/**
 * @param {{ x: number, y: number, w: number, h: number, mask: { alpha: Uint8Array, w: number, h: number } | null }} ball
 * @param {number} worldX
 * @param {number} worldY
 */
function getAlpha(ball, worldX, worldY) {
	if (!ball.mask) return 255
	const mx = Math.floor(((worldX - ball.x) / ball.w) * ball.mask.w)
	const my = Math.floor(((worldY - ball.y) / ball.h) * ball.mask.h)
	if (mx < 0 || mx >= ball.mask.w || my < 0 || my >= ball.mask.h) return 0
	return ball.mask.alpha[my * ball.mask.w + mx]
}

/**
 * @param {typeof balls[0]} a
 * @param {typeof balls[0]} b
 */
function pixelsOverlap(a, b) {
	const x1 = Math.max(a.x, b.x)
	const y1 = Math.max(a.y, b.y)
	const x2 = Math.min(a.x + a.w, b.x + b.w)
	const y2 = Math.min(a.y + a.h, b.y + b.h)
	if (x2 <= x1 || y2 <= y1) return false
	for (let y = y1; y < y2; y += SAMPLE_STEP) {
		for (let x = x1; x < x2; x += SAMPLE_STEP) {
			if (getAlpha(a, x, y) > 128 && getAlpha(b, x, y) > 128) return true
		}
	}
	return false
}

function tick() {
	const vw = window.innerWidth
	const vh = window.innerHeight

	for (const b of balls) {
		if (b.paused) continue
		const speed = Math.sqrt(b.vx ** 2 + b.vy ** 2)
		if (speed > SPEED) {
			const damped = speed * INERTIA
			const s = (damped < SPEED ? SPEED : damped) / speed
			b.vx *= s
			b.vy *= s
		}
		b.x += b.vx
		b.y += b.vy
		if (b.x <= 0) { b.x = 0; b.vx = Math.abs(b.vx) }
		if (b.y <= 0) { b.y = 0; b.vy = Math.abs(b.vy) }
		if (b.x + b.w >= vw) { b.x = vw - b.w; b.vx = -Math.abs(b.vx) }
		if (b.y + b.h >= vh) { b.y = vh - b.h; b.vy = -Math.abs(b.vy) }
		b.el.style.transform = `translate(${b.x}px, ${b.y}px)`
	}

	for (let i = 0; i < balls.length; i++) {
		for (let j = i + 1; j < balls.length; j++) {
			const a = balls[i]
			const b = balls[j]
			if (pixelsOverlap(a, b)) {
				const tmpVx = a.vx; const tmpVy = a.vy
				a.vx = b.vx; a.vy = b.vy
				b.vx = tmpVx; b.vy = tmpVy
			}
		}
	}

	rafId = requestAnimationFrame(tick)
}

function startLoop() {
	if (!rafId) rafId = requestAnimationFrame(tick)
}

function stopLoop() {
	if (rafId) { cancelAnimationFrame(rafId); rafId = null }
}

/**
 * @param {HTMLElement} el
 */
export function collide(el) {
	const quadrant = balls.length % 2
	const angle = Math.random() * 2 * Math.PI
	const ball = {
		el,
		x: 0,
		y: 0,
		vx: Math.cos(angle) * SPEED * randomSign(),
		vy: Math.sin(angle) * SPEED * randomSign(),
		w: 0,
		h: 0,
		paused: false,
		mask: null,
	}

	balls.push(ball)

	const img = el.querySelector('img')

	function init() {
		const rect = el.getBoundingClientRect()
		ball.w = rect.width
		ball.h = rect.height

		// spawn in opposite quadrants to avoid initial overlap
		if (quadrant === 0) {
			ball.x = Math.random() * (window.innerWidth / 2 - ball.w)
			ball.y = Math.random() * (window.innerHeight / 2 - ball.h)
		} else {
			ball.x = window.innerWidth / 2 + Math.random() * (window.innerWidth / 2 - ball.w)
			ball.y = window.innerHeight / 2 + Math.random() * (window.innerHeight / 2 - ball.h)
		}

		el.style.transform = `translate(${ball.x}px, ${ball.y}px)`
		if (img) ball.mask = createMask(img, ball.w, ball.h)
		startLoop()
		requestAnimationFrame(() => { el.style.opacity = '1' })
	}

	if (img && !img.complete) {
		img.addEventListener('load', init, { once: true })
	} else {
		init()
	}

	// drag state
	let dragging = false
	let hasDragged = false
	let dragOffsetX = 0
	let dragOffsetY = 0
	let dragStartX = 0
	let dragStartY = 0
	let prevX = 0, prevY = 0, prevT = 0
	let lastX = 0, lastY = 0, lastT = 0

	/** @param {PointerEvent} e */
	function onPointerDown(e) {
		dragging = true
		hasDragged = false
		ball.paused = true
		dragOffsetX = e.clientX - ball.x
		dragOffsetY = e.clientY - ball.y
		dragStartX = e.clientX
		dragStartY = e.clientY
		prevX = lastX = e.clientX
		prevY = lastY = e.clientY
		prevT = lastT = performance.now()
		el.setPointerCapture(e.pointerId)
	}

	/** @param {PointerEvent} e */
	function onPointerMove(e) {
		if (!dragging) return
		if (Math.abs(e.clientX - dragStartX) > 4 || Math.abs(e.clientY - dragStartY) > 4) {
			hasDragged = true
		}
		prevX = lastX; prevY = lastY; prevT = lastT
		lastX = e.clientX; lastY = e.clientY; lastT = performance.now()
		ball.x = Math.max(0, Math.min(e.clientX - dragOffsetX, window.innerWidth - ball.w))
		ball.y = Math.max(0, Math.min(e.clientY - dragOffsetY, window.innerHeight - ball.h))
		el.style.transform = `translate(${ball.x}px, ${ball.y}px)`
	}

	/** @param {PointerEvent} e */
	function onPointerUp(e) {
		if (!dragging) return
		dragging = false

		if (hasDragged) {
			e.stopPropagation()
			const dt = lastT - prevT
			if (dt > 0 && dt < 100) {
				const scale = (1000 / 60) / dt
				ball.vx = (lastX - prevX) * scale
				ball.vy = (lastY - prevY) * scale
				const speed = Math.sqrt(ball.vx ** 2 + ball.vy ** 2)
				if (speed > SPEED_MAX) {
					ball.vx = (ball.vx / speed) * SPEED_MAX
					ball.vy = (ball.vy / speed) * SPEED_MAX
				} else if (speed < SPEED) {
					ball.vx = Math.cos(angle) * SPEED * randomSign()
					ball.vy = Math.sin(angle) * SPEED * randomSign()
				}
			}
		}

		ball.paused = false
	}

	function onEnter() { if (!dragging) ball.paused = true }
	function onLeave() { if (!dragging) ball.paused = false }

	el.addEventListener('pointerdown', onPointerDown)
	el.addEventListener('pointermove', onPointerMove)
	el.addEventListener('pointerup', onPointerUp)
	el.addEventListener('mouseenter', onEnter)
	el.addEventListener('mouseleave', onLeave)

	return () => {
		const idx = balls.indexOf(ball)
		if (idx !== -1) balls.splice(idx, 1)
		el.removeEventListener('pointerdown', onPointerDown)
		el.removeEventListener('pointermove', onPointerMove)
		el.removeEventListener('pointerup', onPointerUp)
		el.removeEventListener('mouseenter', onEnter)
		el.removeEventListener('mouseleave', onLeave)
		if (balls.length === 0) stopLoop()
	}
}
