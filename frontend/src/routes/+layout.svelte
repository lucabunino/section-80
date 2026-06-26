<script>
	import '$lib/scss/reset.scss'
	import '$lib/scss/typography.scss'
	import '$lib/scss/main.scss'

	import ogImage from '$lib/assets/og-image.jpg'

	let { children } = $props()

	const description = 'Section80 is a cultural company rooted in creative production. Est. 2015, Milan.'

	import { onMount } from 'svelte'
	onMount(() => document.fonts.ready.then(() => document.documentElement.classList.add('fonts-loaded')))
</script>

<svelte:head>
	<title>Section80</title>
	<link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96" />
	<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
	<link rel="shortcut icon" href="/favicon.ico" />
	<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
	<meta name="apple-mobile-web-app-title" content="Section80" />
	<meta name="format-detection" content="address=no, telephone=no, email=no" />
	<link rel="manifest" href="/site.webmanifest" />
	<meta name="description" content={description} />
	<meta property="og:title" content="Section80" />
	<meta property="og:description" content={description} />
	<meta property="og:type" content="website" />
	<meta property="og:site_name" content="Section80" />
	<meta property="og:image" content={ogImage} />
	<meta property="og:locale" content="en_US" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="Section80" />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content={ogImage} />

	<!-- Geo -->
	<meta name="geo.region" content="IT-MI" />
	<meta name="geo.placename" content="Milan" />
	<meta name="geo.position" content="45.4879;9.1843" />
	<meta name="ICBM" content="45.4879, 9.1843" />

	<!-- Schema.org -->
	{@html `<script type="application/ld+json">${JSON.stringify({
		"@context": "https://schema.org",
		"@type": "Organization",
		"name": "Section80",
		"description": description,
		"foundingDate": "2015",
		"address": {
			"@type": "PostalAddress",
			"streetAddress": "Via Carlo Farini 44–48",
			"addressLocality": "Milan",
			"postalCode": "20159",
			"addressCountry": "IT"
		},
		"sameAs": [
			"https://www.instagram.com/section80.tv/",
			"https://www.instagram.com/section80.bar/",
			"https://vimeo.com/section80"
		],
		"email": "info@section80.tv"
	})}<\/script>`}
</svelte:head>

{@render children()}
