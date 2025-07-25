<script setup>
    import axios from 'axios';
    import { ref, onMounted } from 'vue';
    import { RouterLink, useRouter } from 'vue-router';
    
    const router = useRouter();

    const title = ref('');
    const writer = ref('');
    const cont = ref('');
    const isEditMode = ref(false)

    const props = defineProps({
        id: {
            type: [String, Number],
            required: false //(새 글 작성 시)
        }
    });

    /* const inputData = async () => {
        try{
            const now = new Date();
            const formatted_date = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}`;

            const timestamp = now.getTime(); 

            await axios.post('http://localhost:3000/list', {
                name: writer.value,
                title: title.value,
                date: formatted_date,
                cont: cont.value,
                timestamp: timestamp, //(밀리초 단위 숫자)
            });
            //console.log("게시글 작성 /board로 이동 시도...");
        router.push('/board');
        }catch (error){
            console.log('오류' + error)
        } 
    } */

    onMounted(async () => {
        if(props.id) { // id prop이 있다면 수정 모드
            isEditMode.value = true;
            try {
                const res = await axios.get(`http://localhost:3000/list/${props.id}`);
                const post = res.data;
                title.value = post.title;
                writer.value = post.name;
                cont.value = post.cont; 
            } catch (error) {
                console.error('게시글 데이터를 가져오는 데 실패했습니다 (수정 모드):', error);
                alert('게시글 데이터를 불러올 수 없습니다.');
                router.push({ name: 'board' }); // 에러 시 목록으로 리다이렉트
            }
        }
    });

    const submitPost = async () => {
        const postData = {
            title: title.value,
            name: writer.value,
            cont: cont.value,
            timestamp: Date.now(),
            date: new Date().toISOString().split('T')[0] // 'YYYY-MM-DD' 형식
        };

        try {
            if (isEditMode.value) {
            // 수정 모드: PUT 요청
            await axios.put(`http://localhost:3000/list/${props.id}`, postData);
            alert('게시글이 수정되었습니다.');
            } else {
            // 작성 모드: POST 요청
            await axios.post('http://localhost:3000/list', postData);
            alert('게시글이 작성되었습니다.');
            }
            router.push({ name: 'board' }); // 작성/수정 후 게시판 목록으로 이동
        } catch (error) {
            console.error('게시글 저장 중 오류 발생:', error);
            alert('게시글 저장에 실패했습니다.');
        }
    };
</script>

<template>
    <h2>게시글 작성</h2>
    <div id="board_create" class="board_create_update">
        <form @submit.prevent="submitPost">
            <input type="hidden" key="list_id"/>
            <div class="board_cr_up_li board_tit">
                <span>제목 </span><textarea rows="5" cols="50" v-model="title"></textarea>
            </div>
            <div class="board_cr_up_li board_content cf">
                <span>내용 </span><textarea v-model="cont"></textarea>
            </div>
            <div class="board_cr_up_li board_writer cf">
                <span>작성자 </span><input type="text" v-model="writer"/> <!-- disabled -->
            </div>
            
            <div class="btn_wrap">
                <RouterLink to="/board" class="btn">목록</RouterLink>
                <button type="submit" class="btn writer_btn">{{ isEditMode ? '수정 완료' : '등록' }}</button>
            </div>
        </form>
    </div>
</template>