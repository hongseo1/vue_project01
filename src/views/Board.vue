<script setup>
    import { onMounted, watch } from 'vue';
    import { RouterLink, useRoute } from 'vue-router';
    import { useBoardStore } from '@/store/boardCont.js';
    import { storeToRefs } from 'pinia';

    const route = useRoute();
    const boardStore = useBoardStore();

    //storeToRefs: Pinia 스토어의 반응형 상태를 가져온다. (상태가 변경될 때마다 화면 업데이트)
    const { lists, number_page, prev, next, current_page } = storeToRefs(boardStore);

    //스토어의 액션을 직접 가져와서 사용
    const { getData } = boardStore;

    //초기 데이터 로딩을 담당
    onMounted(() => {
        //URL 쿼리 파라미터에서 페이지 번호를 가져오고, 없으면 1을 기본값으로 사용
        const pageNumber = route.query.page ? Number(route.query.page) : 1;
        //해당 페이지의 게시물 목록을 스토어에서 불러옴(최신 게시물 데이터 다시 불러오기)
        getData(pageNumber);
    });

    //페이지 이동 시 데이터가 자동으로 업데이트되도록 watch 사용
    watch(() => route.path, (newPath) => {
        //라우터 경로가 '/board'로 변경되었을 때만 실행(작성, 수정 페이지에서 다시 /board로 돌아왔을 경우)
        if (newPath === '/board') {
            const pageNumber = route.query.page ? Number(route.query.page) : 1;
            getData(pageNumber);
        }
    });
</script>

<template>
    <section class="board_cont">
        <h2 class="cont_tit">게시판</h2>
        <div class="board_list_wrap" v-if="$route.name === 'board'">
            <ul class="list" v-if="lists && lists.length > 0">
                <li class="list_li list_header">
                    <p class="no">no</p>
                    <p class="tit">제목</p>
                    <p class="writer">작성자</p>
                    <p class="date">등록일</p>
                </li>
                <li v-for="board in lists" :key="board.id" class="list_li">
                    <p class="no">{{board.no}}</p>
                    <RouterLink class="tit" :to="{name: 'boardDetail', params: {id: board.id}}">{{board.title}}</RouterLink>
                    <p class="writer">{{board.name}}</p>
                    <p class="date">{{board.date}}</p>
                </li>
            </ul>
            <p v-else>등록된 게시글이 없습니다.</p>
            <div class="list_botton">
                <ul class="pagination" v-if="lists && lists.length > 0">
                    <li v-if="prev"><a @click="getData(prev)"><</a></li>
                    <li v-for="page in number_page" :class="current_page == page ? 'on' : ''"><a @click="getData(page)">{{page}}</a></li>
                    <li v-if="next"><a @click="getData(next)">></a></li>
                </ul>
                <RouterLink to="/board/write" class="btn writer_btn">글쓰기</RouterLink>
            </div>
        </div>
        <router-view v-else></router-view>
    </section>
</template>