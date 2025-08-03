<script setup>
    import Header from './components/Header.vue';
    import Footer from './components/Footer.vue';
</script>

<template>
    <div id="wrap">
        <main>
            <Header></Header>
            <div id="cont_wrap">
                <RouterView></RouterView>
            </div>
            <Footer></Footer>
        </main>
    </div>
</template>

<style scoped>

</style>