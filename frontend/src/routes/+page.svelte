<script>
	import { collide } from '$lib/utils/collide.js'

	import logoTv from '$lib/assets/section-80.svg?url'
	import videoTv from '$lib/assets/section-80.mp4?url'
	import posterTv from '$lib/assets/section-80.webp?url'
	import logoBar from '$lib/assets/section-80-bar.svg?url'
	import videoBar from '$lib/assets/section-80-bar.mp4?url'
	import posterBar from '$lib/assets/section-80-bar.webp?url'
	import videoTvMb from '$lib/assets/section-80-mb.mp4?url'
	import posterTvMb from '$lib/assets/section-80-mb.webp?url'
	import videoBarMb from '$lib/assets/section-80-bar-mb.mp4?url'
	import posterBarMb from '$lib/assets/section-80-bar-mb.webp?url'

	let videoTvEl = $state()
	let videoTvMbEl = $state()
	let videoBarEl = $state()
	let videoBarMbEl = $state()
	let tvActive = $state(false)
	let barActive = $state(false)
	let tvTouchOpen = $state(false)
	let barTouchOpen = $state(false)
	let tvPaused = $state(false)
	let barPaused = $state(false)

	/** @param {HTMLVideoElement | undefined} el @param {(v: boolean) => void} setPaused */
	function tryResume(el, setPaused) {
		if (!el) return
		el.play().then(() => setPaused(false)).catch(() => setPaused(true))
	}

	/** @type {ReturnType<typeof setTimeout> | undefined} */
	let tvLeaveTimeout
	/** @type {ReturnType<typeof setTimeout> | undefined} */
	let barLeaveTimeout

	// Snapshot paused state on pointerdown, not read live in onclick: Safari can
	// auto-resume a blocked autoplay video as soon as it sees any gesture (mousedown
	// counts), so by click time tvPaused may have already flipped to false.
	let tvWasPausedOnPress = false
	let barWasPausedOnPress = false

	// Alternate option: real native Fullscreen API instead of the fake CSS-overlay
	// approach below. iOS auto-rotates for free but neither iOS nor Android let us
	// intercept a tap to close (native chrome swallows it), so this was dropped.
	//
	// function enterVideoFullscreen(el) {
	// 	if (!el) return
	// 	if (el.requestFullscreen) el.requestFullscreen()
	// 	else if (el.webkitEnterFullscreen) el.webkitEnterFullscreen()
	// }
	//
	// function exitFullscreenOnTap() {
	// 	document.exitFullscreen?.()
	// }
	//
	// $effect(() => {
	// 	function onFullscreenChange() {
	// 		const el = document.fullscreenElement
	// 		if (el instanceof HTMLVideoElement) {
	// 			screen.orientation?.lock?.('landscape').catch(() => {})
	// 			el.addEventListener('click', exitFullscreenOnTap)
	// 		} else {
	// 			videoTvEl?.removeEventListener('click', exitFullscreenOnTap)
	// 			videoBarEl?.removeEventListener('click', exitFullscreenOnTap)
	// 		}
	// 	}
	// 	document.addEventListener('fullscreenchange', onFullscreenChange)
	// 	return () => document.removeEventListener('fullscreenchange', onFullscreenChange)
	// })
</script>

<main>
	<section aria-label="Section80 + Third Place">
		<div class="content">
			<h1>Section80</h1>
			<h2>Production <br class="nl-1">Company<br class="nl">
			+ <br class="nl-2">Third <br class="nl-2">Place</h2>
			<address>
				Via Carlo <br class="nl-1">Farini,<br class="nl">
				48 + 44<br class="nl">
				20159 <br class="nl-2">Milan
			</address>
			<p><small>©2026</small></p>
			<nav aria-label="Links">
				<ul>
					<li class="tag">
						<a href="https://www.instagram.com/section80.tv/" target="_blank" rel="noopener noreferrer" aria-label="Section80 TV on Instagram">@section80.tv</a>
					</li>
					<li class="tag">
						<a href="https://www.instagram.com/section80.bar/" target="_blank" rel="noopener noreferrer" aria-label="Section80 Bar on Instagram">@section80.bar</a>
					</li>
					<li class="tag">
						<a href="https://vimeo.com/section80" target="_blank" rel="noopener noreferrer" aria-label="Section80 on Vimeo">Work</a>
					</li>
					<li class="tag">
						<a href="mailto:info@section80.tv" aria-label="Contact Section80 by email">Contact</a>
					</li>
				</ul>
			</nav>
		</div>
	</section>
</main>

<div class="logo-canvas" aria-hidden="true">
	<div class="logo" class:active={tvActive} role="presentation" {@attach collide}
		onpointerenter={(e) => { if (e.pointerType !== 'mouse') return; clearTimeout(tvLeaveTimeout); tvActive = true; if (videoTvEl) videoTvEl.currentTime = 0; if (videoTvMbEl) videoTvMbEl.currentTime = 0 }}
		onpointerleave={(e) => { if (e.pointerType !== 'mouse') return; clearTimeout(tvLeaveTimeout); tvLeaveTimeout = setTimeout(() => { tvActive = false }, 50) }}
		onpointerdown={(e) => { if (e.pointerType !== 'mouse') return; tvWasPausedOnPress = tvPaused }}
		onclick={(e) => {
			e.stopPropagation()
			clearTimeout(tvLeaveTimeout)
			const pointerType = /** @type {any} */ (e).pointerType
			if (pointerType === 'touch') { if (videoTvEl) videoTvEl.currentTime = 0; tvPaused = false; videoTvEl?.play(); tvTouchOpen = true; return }
			if (pointerType === 'pen') {
				tvPaused = false
				videoTvEl?.play()
				videoTvMbEl?.play()
				tvActive = !tvActive
				if (tvActive) { if (videoTvEl) videoTvEl.currentTime = 0; if (videoTvMbEl) videoTvMbEl.currentTime = 0 }
				return
			}
			if (tvWasPausedOnPress) { tryResume(videoTvEl, (v) => tvPaused = v); videoTvMbEl?.play() }
			else tvActive = false
		}}>
		<img src={logoTv} alt="Section80" draggable="false" />
	</div>
	<div class="logo" class:active={barActive} role="presentation" {@attach collide}
		onpointerenter={(e) => { if (e.pointerType !== 'mouse') return; clearTimeout(barLeaveTimeout); barActive = true; if (videoBarEl) videoBarEl.currentTime = 0; if (videoBarMbEl) videoBarMbEl.currentTime = 0 }}
		onpointerleave={(e) => { if (e.pointerType !== 'mouse') return; clearTimeout(barLeaveTimeout); barLeaveTimeout = setTimeout(() => { barActive = false }, 50) }}
		onpointerdown={(e) => { if (e.pointerType !== 'mouse') return; barWasPausedOnPress = barPaused }}
		onclick={(e) => {
			e.stopPropagation()
			clearTimeout(barLeaveTimeout)
			const pointerType = /** @type {any} */ (e).pointerType
			if (pointerType === 'touch') { if (videoBarEl) videoBarEl.currentTime = 0; barPaused = false; videoBarEl?.play(); barTouchOpen = true; return }
			if (pointerType === 'pen') {
				barPaused = false
				videoBarEl?.play()
				videoBarMbEl?.play()
				barActive = !barActive
				if (barActive) { if (videoBarEl) videoBarEl.currentTime = 0; if (videoBarMbEl) videoBarMbEl.currentTime = 0 }
				return
			}
			if (barWasPausedOnPress) { tryResume(videoBarEl, (v) => barPaused = v); videoBarMbEl?.play() }
			else barActive = false
		}}>
		<img src={logoBar} alt="Third Place by Section80" draggable="false" />
	</div>
</div>

<svelte:window onclick={() => { tvActive = false; barActive = false }} />

<div class="video-tv" class:touch-fullscreen={tvTouchOpen} aria-hidden="true"
	onclick={(e) => {
		if (!tvTouchOpen) return
		e.stopPropagation()
		if (tvPaused) { tvPaused = false; videoTvEl?.play(); return }
		tvTouchOpen = false
	}}>
	<video bind:this={videoTvEl} src={videoTv} poster={posterTv} autoplay muted loop playsinline disablePictureInPicture controlsList="nodownload noremoteplayback"
		onplay={() => { tvPaused = false }}
		onpause={() => { tryResume(videoTvEl, (v) => tvPaused = v) }}
		oncanplay={() => { if (videoTvEl?.paused) tryResume(videoTvEl, (v) => tvPaused = v) }}></video>
	<video bind:this={videoTvMbEl} src={videoTvMb} poster={posterTvMb} autoplay muted loop playsinline class="mb" disablePictureInPicture controlsList="nodownload noremoteplayback"></video>
	{#if tvPaused}
		<img src={posterTv} alt="" class="poster-cover" />
		<span class="click-to-play">Click to play</span>
	{/if}
</div>
<div class="video-bar" class:touch-fullscreen={barTouchOpen} aria-hidden="true"
	onclick={(e) => {
		if (!barTouchOpen) return
		e.stopPropagation()
		if (barPaused) { barPaused = false; videoBarEl?.play(); return }
		barTouchOpen = false
	}}>
	<video bind:this={videoBarEl} src={videoBar} poster={posterBar} autoplay muted loop playsinline disablePictureInPicture controlsList="nodownload noremoteplayback"
		onplay={() => { barPaused = false }}
		onpause={() => { tryResume(videoBarEl, (v) => barPaused = v) }}
		oncanplay={() => { if (videoBarEl?.paused) tryResume(videoBarEl, (v) => barPaused = v) }}></video>
	<video bind:this={videoBarMbEl} src={videoBarMb} poster={posterBarMb} autoplay muted loop playsinline class="mb" disablePictureInPicture controlsList="nodownload noremoteplayback"></video>
	{#if barPaused}
		<img src={posterBar} alt="" class="poster-cover" />
		<span class="click-to-play">Click to play</span>
	{/if}
</div>

<style lang="scss">
	main {
		z-index: 0;
		width: 100%;
		height: 100svh;

		br { display: none; }
		br.nl { display: block; }
		@media (aspect-ratio < 4/3) { br.nl-1 { display: block; } }
		@media (aspect-ratio < 3/4) { br.nl-2 { display: block; } }

		::selection {
			background-color: rgba($color: #000000, $alpha: .1);
		}

		section {
			min-height: 100svh;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			text-align: center;

			.content {
				position: relative;
				margin: .1em 0;
				@media (aspect-ratio < 3/4)	{ margin: .25em 0; }

				nav {
					display: contents;
					ul {
						display: contents;
						.tag {
							position: absolute;
							user-select: none;
							touch-action: none;

							&:nth-child(1) {
								top: .95em;
								left: 25.8%;
								@media (aspect-ratio < 4/3)	{ top: 1.2em; left: 2.8%; }
								@media (aspect-ratio < 3/4)	{ top: 1.2em; left: 2.8%; }
							}
							&:nth-child(2) {
								top: 1.83em;
								right: 29%;
								@media (aspect-ratio < 4/3)	{ top: 2.75em; right: unset; left: 13.5%; }
								@media (aspect-ratio < 3/4)	{ top: 3.46em; right: unset; left: 3.5%; }
							}
							&:nth-child(3) {
								top: 1.07em;
								right: 27.5%;
								@media (aspect-ratio < 4/3)	{ top: 1.9em; right: 42%; }
								@media (aspect-ratio < 3/4)	{ top: 1.75em; right: 42%; }
							}
							&:nth-child(4) {
								top: 3.31em;
								right: 16%;
								@media (aspect-ratio < 4/3)	{ top: 4em; right: 18.9%; }
								@media (aspect-ratio < 3/4)	{ top: 5.55em; right: 8.9%; }
							}

							a {
								display: block;
								font-size: 2.4vw;
								padding: 0 .3em;
								line-height: 1;
								background-color: var(--black);
								color: var(--white);

								@media (aspect-ratio < 4/3)	{ font-size: 3.5vw; }
								@media (aspect-ratio < 3/4)	{ font-size: 5.4vw; }

								&:hover {
									color: var(--black);
									background-color: var(--white);
								}
							}
						}
					}
				}
			}
		}

		
	}

	.logo-canvas {
		position: fixed;
		inset: 0;
		z-index: 2;
		pointer-events: none;

		.logo {
			display: inline-block;
			pointer-events: all;
			opacity: 0;
			user-select: none;
			touch-action: none;
			position: fixed;
			left: 0;
			top: 0;
			will-change: transform;
			cursor: pointer;

			img {
				height: max(140px, min(26vh, 20vw));
				width: auto;

				@media (aspect-ratio < 3/4) { height: max(120px, min(26vh, 24vw)); }
			}
		}

		&:has(.logo:first-child.active) ~ .video-tv,
		&:has(.logo:last-child.active) ~ .video-bar {
			opacity: 1;
		}
	}

	.video-tv,
	.video-bar {
		position: fixed;
		inset: 0;
		z-index: 3;
		opacity: 0;
		pointer-events: none;

		video {
			width: 100%;
			height: 100%;
			object-fit: cover;

			&::-webkit-media-controls-start-playback-button {
				display: none !important;
				-webkit-appearance: none;
			}
		}

		.poster-cover {
			position: absolute;
			inset: 0;
			width: 100%;
			height: 100%;
			object-fit: cover;
			pointer-events: none;
			z-index: 1;
		}

		.click-to-play {
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			color: var(--white);
			pointer-events: none;
			z-index: 2;
			font-size: .2rem;
		}

		video.mb { display: none; }
		@media (aspect-ratio < 1) {
			video:not(.mb) { display: none; }
			video.mb { display: block; }
		}

		&.touch-fullscreen {
			z-index: 10;
			opacity: 1;
			pointer-events: auto;
			background: var(--black);

			video.mb { display: none; }
			video:not(.mb) {
				display: block;
				@media (aspect-ratio < 1) {
					position: absolute;
					top: 50%;
					left: 50%;
					width: 100dvh;
					height: 100dvw;
					max-width: unset;
					max-height: unset;
					transform: translate(-50%, -50%) rotate(90deg);
				}
			}
		}
	}

</style>
