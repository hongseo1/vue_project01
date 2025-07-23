<script setup>
    import axios from 'axios';
    import { ref } from 'vue';
    import { RouterLink } from 'vue-router';
    
    const list_id = ref('');
    const no = ref('');
    const title = ref('');
    const writer = ref('');
    const date = ref('');
    const lists = ref([]);

    const per_page = 10; //한 페이지당 출력 개수
    const numberOfList = ref(null); //전체 데이터 개수
    const numberOfPage = ref(1); //전체 페이지수
    const prev = ref(null); //이전 페이지
    const next = ref(null); //다음 페이지
    const last = ref(null) //마지막 페이지
    const current_page = ref(1); //현재 페이지
    
    const getDate = async (page) => {
        const res = await axios.get(`http://localhost:3000/list?_page=${page}&_per_page=${per_page}`);
        console.log(res.data)
        lists.value = res.data;
        
        /* const dataWithNumbers = fetchedData.map((item, index) => {
            return {
                ...item,
                no: index + 1
            };
        }); */

        /* lists.value = dataWithNumbers.sort((a, b) => b.id - a.id); */
    }
    getDate()
</script>

<template>
    <main>
        <section class="board_cont">
            <h1>게시판</h1>
            <h2>게시판</h2>
            <div class="board_list_wrap">
                <!-- <p>등록된 게시글이 없습니다.</p> -->
                <ul class="list">
                    <li class="list_li list_header">
                        <p class="no">no</p>
                        <p class="tit">제목</p>
                        <p class="writer">작성자</p>
                        <p class="date">등록일</p>
                    </li>
                    <li v-for="list in lists" :key="list.id" class="list_li">
                        
                        <p class="no">{{list.no}}</p>
                        <p class="tit">{{list.title}}</p>
                        <p class="writer">{{list.name}}</p>
                        <p class="date">{{list.date}}</p>
                    </li>
                </ul>
            </div>
            <div class="list_botton">
                <ul class="pagination">
                    <li v-if="prev"><a @click="getDate(prev)"><</a></li>
                    <li v-for="page in numberOfPage" :class="current_page == page ? 'on' : ''"><a @click="getDate(page)">{{page}}</a></li>
                    <li v-if="next"><a @click="getDate(next)">></a></li>
                </ul>
                <RouterLink to="/boardWrite" class="btn writer_btn">글쓰기</RouterLink>
            </div>
            <!--  *전체 데이터 개수
            {{numberOfList}} / 
            *전체 페이지 수
            {{numberOfPage}} / 
            *이전 페이지
            {{prev}} / 
            *다음 페이지
            {{next}} / 
            *마지막 페이지
            {{last}} -->
            
        </section>
    </main>
</template>