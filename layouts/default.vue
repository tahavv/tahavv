<template>
    <div class="site">
        <a class="skip" href="#main">Skip to content</a>
        <div class="backdrop" aria-hidden="true"></div>
        <ClientOnly>
            <LazySceneWorld />
            <ChapterIndicator />
        </ClientOnly>
        <SiteNav />
        <main id="main">
            <slot />
        </main>
        <SiteFooter />
    </div>
</template>
