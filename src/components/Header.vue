<script setup>
    import { RouterLink } from 'vue-router';
</script>

<template>
    <header id="header">
        <nav>
            <ul>
                <li><RouterLink to="/" class="link">Home</RouterLink></li>
                <li><RouterLink to="/board" class="link">게시판</RouterLink></li>
                <li><RouterLink to="/shopping" class="link">상품 리스트</RouterLink></li>
            </ul>
        </nav>
    </header>
</template>