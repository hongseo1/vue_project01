<script setup>
    import { RouterLink, useRouter } from 'vue-router';
    import { ref, onMounted } from 'vue';
    import axios from 'axios';

    const lists = ref([]);
    const router = useRouter();

    const props = defineProps({
        id: {
            type: [String, Number], // id는 문자열 또는 숫자일 수 있습니다.
            required: true // id는 필수 prop입니다.
        }
    });

    const postDetail = ref(null);

    const getDetailData = async () => {
        const res = await axios.get(`http://localhost:3000/list/${props.id}`);
        postDetail.value = res.data; 
        console.log(res.data);

    }

    const deleteData = async () => {
        if(!confirm('삭제하시겠습니까?')){
            return false;
        }
        try{
            await axios.delete(`http://localhost:3000/list/${props.id}`);
            router.push({ name: 'board' });
        }catch(err){
            console.log(err);
        }
    };

    onMounted(() => {
        getDetailData();
    });
</script>

<template>
    <h2>게시글 상세</h2>
    <div class="board_detail_wrap">
        <div class="board_detail" v-if="postDetail">
            <div class="detail_head">
                <p class="tit">{{postDetail.title}}</p>
                <p class="writer">{{postDetail.name}}</p>
                <p class="date">{{postDetail.date}}</p>
            </div>
            <div class="detail_body">
                <div class="cont">{{postDetail.cont}}</div>
            </div>
        </div>
        <div v-else>
            <p>게시글을 불러오는 중이거나, 게시글이 존재하지 않습니다.</p>
        </div>
        <div class="btn_wrap">
            <RouterLink to="/board" class="btn">목록</RouterLink>
            <RouterLink :to="{name: 'boardEdit', params: {id: props.id}}" class="btn edit_btn" v-if="postDetail">수정</RouterLink>
            <input type="button" value="삭제" class="btn delete_btn" @click="deleteData">
        </div>
    </div>
</template>