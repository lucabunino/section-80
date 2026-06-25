<script>
	import { collide } from '$lib/utils/collide.js'

	import logoTv from '$lib/assets/section-80.svg?url'
	import videoTv from '$lib/assets/section-80.mp4?url'
	import posterTv from '$lib/assets/section-80.webp?url'
	import logoBar from '$lib/assets/section-80-bar.svg?url'
	import videoBar from '$lib/assets/section-80-bar.mp4?url'
	import posterBar from '$lib/assets/section-80-bar.webp?url'

	let videoTvEl = $state()
	let videoBarEl = $state()
	let tvActive = $state(false)
	let barActive = $state(false)
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
		onpointerenter={(e) => { if (e.pointerType !== 'mouse') return; tvActive = true; if (videoTvEl) videoTvEl.currentTime = 0 }}
		onpointerleave={(e) => { if (e.pointerType !== 'mouse') return; tvActive = false }}
		onclick={(e) => { e.stopPropagation(); tvActive = !tvActive; if (tvActive && videoTvEl) videoTvEl.currentTime = 0 }}>
		<img src={logoTv} alt="Section80" draggable="false" />
	</div>
	<div class="logo" class:active={barActive} role="presentation" {@attach collide}
		onpointerenter={(e) => { if (e.pointerType !== 'mouse') return; barActive = true; if (videoBarEl) videoBarEl.currentTime = 0 }}
		onpointerleave={(e) => { if (e.pointerType !== 'mouse') return; barActive = false }}
		onclick={(e) => { e.stopPropagation(); barActive = !barActive; if (barActive && videoBarEl) videoBarEl.currentTime = 0 }}>
		<img src={logoBar} alt="Third Place by Section80" draggable="false" />
	</div>
</div>

<svelte:window onclick={() => { tvActive = false; barActive = false }} />

<div class="video" aria-hidden="true">
	<video
		bind:this={videoTvEl}
		src={videoTv}
		poster={posterTv}
		autoplay
		muted
		loop
		playsinline
	></video>
</div>
<div class="video-bar" aria-hidden="true">
	<video
		bind:this={videoBarEl}
		src={videoBar}
		poster={posterBar}
		autoplay
		muted
		loop
		playsinline
	></video>
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
								font-size: 2.9vw;
								line-height: 1;
								background-color: var(--black);
								color: var(--white);

								@media (aspect-ratio < 4/3)	{ font-size: 3.5vw; }
								@media (aspect-ratio < 3/4)	{ font-size: 5.4vw; }

								&:hover {
									color: black;
									background-color: yellow;
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
				height: max(140px, min(24vh, 14vw));
				width: auto;

				@media (aspect-ratio < 3/4) { height: max(100px, min(24vh, 20vw)); }
			}
		}

		&:has(.logo:first-child.active) ~ .video,
		&:has(.logo:last-child.active) ~ .video-bar {
			opacity: 1;
		}
	}

	.video,
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
		}
	}
</style>
