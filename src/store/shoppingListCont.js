import { defineStore } from 'pinia';
import axios from 'axios';

export const useShoppingStore = defineStore('shopping',{
    state: () => ({
        items: [],
        title: '',
        error: null, 
    }),
    actions: {
        async itemData(){
            try{
                const res = await axios.get(`http://localhost:3000/shopping?_sort=-timestamp`); //json-server 1.0.0 버전에서 오름 차순, 내림 차순 방법 _sort=-timestamp 처럼 기준으로 내림차순은 -를 붙이고 오름차순은 아무것도 붙이지 않거나 아예 안 써도 됨(기본) 
                this.items = res.data
                //console.log(items.value)
            }catch(err){
                console.log(err);
            }
        },
        async inputItem(){
            try{
                await axios.post(`http://localhost:3000/shopping`, {
                    title: this.title,
                    timestamp: Date.now()
                });
                this.itemData();
                this.title = '';
            }catch(err){
                console.log(err);
            }
        },
        async deleteData(id){
            try{
                await axios.delete(`http://localhost:3000/shopping/` + id);
                this.itemData();
            }catch(err){
                console.log(err);
            }
        }
    },
});