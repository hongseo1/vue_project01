<script setup>   
    import { useShoppingStore } from '@/store/shoppingListCont';
    import { storeToRefs } from 'pinia';

    const shoppingStore = useShoppingStore();
    const {title} = storeToRefs(shoppingStore);
    const {inputItem} = shoppingStore;
</script>

<template>
    <form @submit.prevent="inputItem">
        <div class="input_item_wrap">
            <input type="text" class="item_tit" placeholder="구매할 품목을 입력해주세요." required v-model="title"/>
            <button class="submit_btn">추가</button>
        </div>
    </form>
</template>

<style scoped>
    form{width: 100%;}
    .input_item_wrap{display: flex; align-items: center; justify-content: space-between; margin-bottom: 30px;}
    .item_tit{width: 29vw; padding: 10px; border: 1px solid #222222;}
    .input_item_wrap .submit_btn{margin-left: 15px; padding: 12px 20px; border-radius: 10px;}
</style>