<script setup>
    import axios from 'axios';
    import { ref, onMounted } from 'vue';
    import { RouterLink } from 'vue-router';

    const lists = ref([]);
    const per_page = 10;
    const total_items = ref(0);
    const number_page = ref(1);
    const prev = ref(null);
    const next = ref(null);
    const last = ref(null);
    const current_page = ref(1);

    const getData = async (page) => {
        try {
            const res = await axios.get(`http://localhost:3000/list?_page=${page}&_per_page=${per_page}&_sort=timestamp&_order=asc`);

            total_items.value = res.data.items;
            number_page.value = res.data.pages;
            prev.value = res.data.prev;
            next.value = res.data.next;
            last.value = res.data.last;
            current_page.value = page;

            const data_process = res.data.data;

            const data_nums = data_process.map((item, index) => {
                const offset = (current_page.value - 1) * per_page;
                const calculated_no = offset + index + 1; 
                
                return {
                    ...item,
                    no: calculated_no
                };
                /* 
                item, idex 데이터의 총 개수, 현재 순서 offset에 현재페이지 수 - 1 * 한 페이지에 보여지는 데이터 수 ex)현제 페이지가 1이면 (1-1)*10 = 0
                calculated_no = 해당 데이터 순번 (0, 1, 2..) 데이터가 1번이면(index=0) 0+1 = 1
                return ...item(원본 데이터 복제) no에 calculated_no (1)반환
                즉, 데이터의 개수와 페이지 수를 이용해 해당 데이터의 번호가 순차적으로 1, 2, 3...으로 매길 수 있도록 한다
                위에서는  timestamp(밀리초 단위 숫자)로 오름차순으로 정렬하기 때문에 데이터가 최신순이 마지막으로 정렬되게 한다
                */
            });

            lists.value = data_nums.reverse(); 
        } catch (error) {
            console.error('서버 문제 발생:', error);
        }
    };

    onMounted(() => {
        getData(1);
    });
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
                    <li v-if="prev"><a @click="getData(prev)"><</a></li>
                    <li v-for="page in number_page" :class="current_page == page ? 'on' : ''"><a @click="getData(page)">{{page}}</a></li>
                    <li v-if="next"><a @click="getData(next)">></a></li>
                </ul>
                <RouterLink to="/boardWrite" class="btn writer_btn">글쓰기</RouterLink>
            </div>
        </section>
    </main>
</template>