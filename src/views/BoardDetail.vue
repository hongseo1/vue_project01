<script setup>
    import { RouterLink, useRouter } from 'vue-router';
    import { onMounted } from 'vue';
    import { useBoardStore } from '@/store/boardCont.js';
    import { storeToRefs } from 'pinia';

    const router = useRouter();
    const boardStore = useBoardStore();
    const { postDetail } = storeToRefs(boardStore);

    const props = defineProps({
        id: {
            type: [String, Number],
            required: true
        }
    });

    // 컴포넌트가 마운트될 때, Pinia 스토어의 getPostDetail 액션을 호출(id값과 함께)
    onMounted(() => {
        boardStore.getPostDetail(props.id);
    });

    //게시물 삭제
    const deleteData = async () => {
        if (!confirm('삭제하시겠습니까?')) {
            return false;
        }
        try {
            await boardStore.deletePost(props.id);
            router.push({ name: 'board' });
        } catch (err) {
            console.log(err);
        }
    };
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