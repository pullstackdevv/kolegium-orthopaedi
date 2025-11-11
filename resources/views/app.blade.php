<!DOCTYPE html>
<html>

<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <meta name="csrf-token" content="{{ csrf_token() }}">
  
  <!-- Primary Meta Tags -->
  <title>Kolegium Orthopaedi & Traumatologi Indonesia</title>
  <meta name="title" content="Kolegium Orthopaedi & Traumatologi Indonesia">
  <meta name="description" content="Organisasi profesional dokter spesialis orthopaedi dan traumatologi terkemuka di Indonesia. Bergabunglah dengan komunitas profesional terbesar.">
  <meta name="keywords" content="kolegium, orthopaedi, traumatologi, indonesia, dokter spesialis, pendidikan kedokteran">
  <meta name="author" content="Kolegium Orthopaedi & Traumatologi Indonesia">
  
  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="website">
  <meta property="og:url" content="{{ url()->current() }}">
  <meta property="og:title" content="Kolegium Orthopaedi & Traumatologi Indonesia">
  <meta property="og:description" content="Organisasi profesional dokter spesialis orthopaedi dan traumatologi terkemuka di Indonesia. Bergabunglah dengan komunitas profesional terbesar.">
  <meta property="og:image" content="{{ asset('assets/images/logos/kolegium.png') }}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:site_name" content="Kolegium Orthopaedi & Traumatologi Indonesia">
  <meta property="og:locale" content="id_ID">
  
  <!-- Twitter -->
  <meta property="twitter:card" content="summary_large_image">
  <meta property="twitter:url" content="{{ url()->current() }}">
  <meta property="twitter:title" content="Kolegium Orthopaedi & Traumatologi Indonesia">
  <meta property="twitter:description" content="Organisasi profesional dokter spesialis orthopaedi dan traumatologi terkemuka di Indonesia. Bergabunglah dengan komunitas profesional terbesar.">
  <meta property="twitter:image" content="{{ asset('assets/images/logos/kolegium.png') }}">
  
  <!-- WhatsApp Specific -->
  <meta property="og:image:alt" content="Logo Kolegium Orthopaedi & Traumatologi Indonesia">
  
  <!-- Favicon -->
  <link rel="icon" href="{{ asset('assets/images/logos/logo.png') }}" type="image/png">
  <link rel="apple-touch-icon" href="{{ asset('assets/images/logos/logo.png') }}">
  
  @routes
  @viteReactRefresh
  @vite('resources/js/app.jsx')
  @inertiaHead
</head>

<body class="antialiased" theme="light">
  @inertia
</body>

</html>