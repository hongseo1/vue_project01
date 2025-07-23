<script setup>
    import axios from 'axios';
    import { ref } from 'vue';
    import { RouterLink, useRouter } from 'vue-router';
    
    const router = useRouter();
    const list_id = ref('');
    const no = ref('');
    const title = ref('');
    const writer = ref('');
    const cont = ref('');

    const inputData = async () => {
        try{
            const now = new Date();
            const formatted_date = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}`;

            const timestamp = now.getTime(); 

            await axios.post('http://localhost:3000/list', {
                name: writer.value,
                title: title.value,
                date: formatted_date,
                cont: cont.value,
                timestamp: timestamp,
            });
            console.log("게시글 작성 성공! /board로 이동 시도..."); // 🚨 이 로그를 추가
        router.push('/board');
        }catch (error){
            console.log('오류' + error)
        } 
    }
</script>

<template>
    <main>
        <section class="board_cont">
            <h1>게시글 작성</h1>
            <h2>게시판</h2>
            <div id="board_create" class="board_create_update">
                <form @submit.prevent="inputData">
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
                        <input type="submit" value="작성 완료" class="btn save_btn">
                    </div>
                </form>
            </div>
        </section>
    </main>
</template>