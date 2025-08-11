<script setup>
    import { useRouter } from 'vue-router';
    import { onMounted, watch } from 'vue';
    import { useBoardStore } from '@/store/boardCont.js';
    import { storeToRefs } from 'pinia';

    const router = useRouter();
    const boardStore = useBoardStore();
    const { postDetail } = storeToRefs(boardStore);

    const props = defineProps({//부모 컴포넌트에서 데이터 전달 받을 수 있도록 props 정의
        id: { //BoardDetail 컴포넌트가 부모 컴포넌트로부터 받을 props 이름 부모 (컴포넌트에서 id값을 전달 받으면 props.id값이 부모로 부터 받은 id값이 되는 것)
            type: [String, Number],
            required: true
        }
    });

    onMounted(() => {
        boardStore.getPostDetail(props.id); //Pinia 스토어의 getPostDetail 액션을 호출하여 props로 전달받은 id에 해당하는 게시글 상세 정보를 가져옴.
    });

    watch(() => props.id, (newId) => { //첫 번째 인자 props.id > 감시 대상, props.id의 값이 변경될 때마다 watch 콜백 함수를 실행 / 두 번째 인자 newId > 감시 대상의 값이 변경되었을 때 실행될 함수 (if문)
        if (newId) { //새로운 ID가 유효할 때만 실행(비어있는 값으로 넘어오는 경우 방지)
            boardStore.getPostDetail(newId); // pinia스토어의 getPostDetail액션 호출(boardCont.js getPostDetail액션 로직 참고)
        }
    }, { immediate: true }); //세 번째 인자 watch의 동작 방식 제어하는 옵션 객체, watch 콜백함수가 컴포넌트가 처음 마운틴 될 때 즉시 한 번 실행되도록 함(props.id가 처음 컴포넌트에 전달될 때(컴포넌트가 처음 화면에 나타날 때)에도 함수가 바로 실행되어 초기 데이터를 불러올 수 있도록 됨)(++일반적으로는 감시 대상의 값이 처음 할당된 이후에 변경이 발생해야만 콜백을 실행)

    //게시물 삭제
    const deleteData = async () => {
        if (!confirm('삭제하시겠습니까?')) {
            return false; //취소를 눌렀을 경우 함수 종료
        }
        try {
            await boardStore.deletePost(props.id); //pinia 스토어의 dletePost 액션 호출하여 해당 id 게시글 삭제
            router.push({ name: 'board' });
        } catch (err) {
            console.log(err);
        }
    };

    const formatContent = (content) => {
        if (!content) {
            return '';
        }
        return content.replace(/\n/g, '<br>');
    };

    const formatTimestampToDate = (timestamp) => {
        if (!timestamp) {
            return '';
        }
        // Firestore Timestamp 객체에서 seconds 값을 가져와 밀리초로 변환 후 Date 객체 생성
        const date = new Date(timestamp.seconds * 1000);
        const year = date.getFullYear();
        //월은 0부터 시작하므로 +1 하고 두 자리로 포맷 (ex 01, 12)
        const month = String(date.getMonth() + 1).padStart(2, '0');
        //일을 두 자리로 포맷
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}.${month}.${day}`; // 'YYYY.MM.DD' 형식으로 반환
    };
</script>

<template>
    <h2>게시글 상세</h2>
    <div class="board_detail_wrap">
        <div class="board_detail" v-if="postDetail">
            <div class="detail_head">
                <p class="tit">{{postDetail.title}}</p>
                <div class="d_head_info">
                    <p class="writer">{{postDetail.writer}}</p>
                    <p class="date">{{ formatTimestampToDate(postDetail.createdAt) }}</p>
                </div>
            </div>
            <div class="detail_body">
                <div class="cont" v-html="formatContent(postDetail.cont)"></div>
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