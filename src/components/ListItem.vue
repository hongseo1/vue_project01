<script setup>
    import { onMounted } from 'vue';
    import { useShoppingStore } from '@/store/shoppingListCont';
    import { storeToRefs } from 'pinia';

    const ShoppingStore = useShoppingStore();
    const {items} = storeToRefs(ShoppingStore);
    const {itemData, deleteData} = ShoppingStore;

    onMounted(() => {
        itemData();
    });
    
</script>

<template>
    <ul>
        <li class="item" v-for="item in items" :key="item.id">
            <div class="item_txt_wrap">
                <input type="checkbox" name="item" id="item"><p>{{item.title}}</p>
            </div>
            <button class="delete_btn" @click="deleteData(item.id)">삭제</button>
        </li>
    </ul>
</template>

<style scoped>
    ul{width: 100%;}
    .item{display: flex; align-items: center; justify-content: space-between; width: 100%; margin-bottom: 15px;}
    .item_txt_wrap{display: flex; align-items: center;}
    .item input{width: 3vw; height: 3vh; margin-right: 10px;}
    .item p{text-align: left; line-height: 100%;}
    .item input:checked+p{color: rgb(87, 87, 87); text-decoration: line-through;}
    .item .delete_btn{padding: 12px 20px; border-radius: 10px;}
</style>