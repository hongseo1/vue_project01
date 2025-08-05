<script setup>
    import { onMounted } from 'vue';
    import { RouterLink, useRouter } from 'vue-router';
    import { useBoardStore } from '@/store/boardCont.js';
    import { storeToRefs } from 'pinia';

    const router = useRouter();
    const boardStore = useBoardStore();
    const { form, isEditMode } = storeToRefs(boardStore);

    const props = defineProps({
        id: {
            type: [String, Number],
            required: false
        }
    });

    onMounted(() => {
        if (props.id) { //id prop이 있다면 수정 모드
            boardStore.fetchPostForEdit(props.id).catch(() => {
                //스토어에서 에러가 발생하면 컴포넌트에서 처리
                alert('게시글 데이터를 불러올 수 없습니다.');
                router.push({ name: 'board' });
            });
        } else { //새 글 작성 모드
            boardStore.resetForm();
        }
    });

    const submitPost = async () => {
        let postData;
        if(isEditMode.value){
            postData = {
                title: form.value.title,
                name: form.value.writer,
                cont: form.value.cont
            };
        }else {
            postData = {
                title: form.value.title,
                name: form.value.writer,
                cont: form.value.cont,
                timestamp: Date.now(),
                date: new Date().toISOString().split('T')[0]
            };
        }
        

        try {
            await boardStore.savePost(props.id, postData);
            alert(`게시글이 ${isEditMode.value ? '수정' : '작성'}되었습니다.`);
            router.push({ name: 'board' });
        } catch (error) {
            alert('게시글 저장에 실패했습니다.');
        }
    };
</script>

<template>
    <h2>{{ isEditMode ? '게시글 수정' : '게시글 작성' }}</h2>
    <div id="board_create" class="board_create_update">
        <form @submit.prevent="submitPost">
            <input type="hidden" key="list_id" />
            <div class="board_cr_up_li board_tit">
                <span>제목 </span><textarea rows="5" cols="50" v-model="form.title"></textarea>
            </div>
            <div class="board_cr_up_li board_content cf">
                <span>내용 </span><textarea v-model="form.cont"></textarea>
            </div>
            <div class="board_cr_up_li board_writer cf">
                <span>작성자 </span>
                <p v-if="isEditMode">{{form.writer}}</p>
                <input type="text" v-model="form.writer" v-else/>
            </div>

            <div class="btn_wrap">
                <RouterLink to="/board" class="btn">목록</RouterLink>
                <button type="submit" class="btn writer_btn">{{ isEditMode ? '수정 완료' : '등록' }}</button>
            </div>
        </form>
    </div>
</template>
