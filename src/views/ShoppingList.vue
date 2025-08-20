<script setup>
    import InputItem from '@/components/InputItem.vue';
    import ListItem from '@/components/ListItem.vue';
</script>

<template>
    <section class="shopping_cont">
        <h2 class="cont_tit">Wish List</h2>
        <div class="shopping_wrap">
            <InputItem></InputItem>
            <div class="list_wrap">
                <!-- <p>작성한 Wish LIst가 없습니다.</p> -->
                <ListItem></ListItem>
            </div>
        </div>
    </section>
</template>

<style>
    .shopping_wrap{display: block; width: 35vw; margin: 0 auto;}
</style>
