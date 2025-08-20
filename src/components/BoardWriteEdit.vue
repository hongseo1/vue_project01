<script setup>
    /* 게시글 작성/수정 페이지 */
    import { onMounted } from 'vue';
    import { useRouter } from 'vue-router';
    import { useBoardStore } from '@/store/boardCont.js';
    import { storeToRefs } from 'pinia';
    import { serverTimestamp } from "firebase/firestore";

    const router = useRouter();
    const boardStore = useBoardStore();
    const { form, isEditMode } = storeToRefs(boardStore);

    const props = defineProps({ //BoardDetail.vue, study.vue 설명 참고
        id: {
            type: [String, Number],
            required: false
        }
    });

    onMounted(() => {
        if (props.id) { //props.id 존재할 경우 수정 모드
            boardStore.fetchPostForEdit(props.id).catch(() => { //boardStore의 fetchPostForEdit 액션을 호출하여 해당 id의 게시글 데이터를 불러와 폼에 채움 / .catch()를 사용하여 데이터 로드 실패 시 컴포넌트에서 에러를 처리
                alert('게시글 데이터를 불러올 수 없습니다.');
                router.push({ name: 'board' });
            });
        } else { //새 글 작성 모드
            boardStore.resetForm(); //boardStore의 resetForm 액션을 호출하여 폼 데이터를 초기화
        }
    });

    const submitPost = async () => {
        let postData; //제출할 게시글 데이터를 담을 변수 선언
        if(isEditMode.value){ //isEditMode 값에 따라 postData 객체를 다르게 구성(날짜 부분이 수정 날짜로 업데이트 안 되도록..)
            postData = {
                title: form.value.title,
                writer: form.value.writer,
                cont: form.value.cont
            };
        }else {
            postData = {
                title: form.value.title,
                writer: form.value.writer,
                cont: form.value.cont,
                createdAt: serverTimestamp()
                /* timestamp: Date.now(), //Date.now()는 밀리초 단위의 타임스탬프를 반환
                date: new Date().toISOString().split('T')[0] //'YYYY-MM-DD' 형식의 날짜 */
            };
        }
        
        try {
            await boardStore.savePost(props.id, postData); //boardStore의 savePost 액션을 호출 첫 번째 인자로 props.id를 전달하여 수정 시 어떤 게시글을 수정할지 지정하고, 두 번째 인자로 구성된 postData를 전달
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
        <form @submit.prevent="submitPost"> <!-- 폼 제출 시 submitPost 함수를 호출하고, 기본 제출 동작을 방지 -->
            <div class="board_cr_up_li board_tit">
                <span>제목 </span><textarea rows="5" cols="50" v-model="form.title" required></textarea>
            </div>
            <div class="board_cr_up_li board_content cf">
                <span>내용 </span><textarea v-model="form.cont"></textarea>
            </div>
            <div class="board_cr_up_li board_writer cf">
                <span>작성자 </span>
                <p v-if="isEditMode">{{form.writer}}</p>
                <input type="text" v-model="form.writer" v-else required/>
            </div>

            <div class="btn_wrap">
                <RouterLink to="/board" class="btn">목록</RouterLink>
                <button type="submit" class="btn writer_btn">{{ isEditMode ? '수정 완료' : '등록' }}</button>
            </div>
        </form>
    </div>
</template>

<style scoped>
    .board_create_update{display: block; width: 80vw; /* height: 65vh; */ margin: 0 auto; border-top: 2px solid #333333;}
    .board_create_update .board_cr_up_li{display: flex; align-items: center; justify-content: center; width: 100%; border-bottom: 1px solid #dddddd;}
    .board_create_update .board_tit, .board_create_update .board_writer{height: 10vh;}
    .board_create_update .board_content{height: 30vh;}
    .board_create_update .board_cr_up_li span{display: flex; align-items: center; justify-content: center; width: 12vw; height: 100%; background: #efefef; text-align: center; font-weight: bold; font-size: 1.2em;}
    .board_create_update textarea, .board_create_update .board_writer input, .board_create_update .board_writer p{width: calc(87% - 40px); padding: 0 20px; margin: 20px 20px 20px 0; resize: none; font-size: 1.125em;}
    .board_create_update .board_tit textarea{height: calc(100% - 60px); padding: 10px 20px;}
    .board_create_update .board_content textarea{height: calc(100% - 80px); padding: 20px; line-height: 150%;}
</style>