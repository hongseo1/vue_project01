<script setup>
    import { onMounted, watch, computed } from 'vue';
    import { useRoute } from 'vue-router';
    import { useBoardStore } from '@/store/boardCont.js';
    import { storeToRefs } from 'pinia';

    const route = useRoute();
    const boardStore = useBoardStore();

    /* const { lists, number_page, prev, next, current_page } = storeToRefs(boardStore); //기존 json-server로 구현했을 때 사용*/
    const { currentPageNumber, hasPrevPage, hasNextPage } = storeToRefs(boardStore);
    const processedLists = computed(() => boardStore.processedLists);

    const { fetchPosts, fetchPostsByNumber } = boardStore;

    //초기 데이터 로딩을 담당
    onMounted(() => {
        /* 기존 json-server로 구현 시에 사용
        URL 쿼리 파라미터에서 페이지 번호를 가져오고, 없으면 1을 기본값으로 사용
        //const pageNumber = route.query.page ? Number(route.query.page) : 1;
        */
        //해당 페이지의 게시물 목록을 스토어에서 불러옴(최신 게시물 데이터 다시 불러오기)
        fetchPosts('current');
    });

    //전체 게시물 수를 페이지당 게시물 수로 나누어 전체 페이지 수를 계산
    const totalPages = computed(() => {
        return Math.ceil(boardStore.totalPostsCount / boardStore.per_page); //Math.ceil() 함수를 사용하여 소수점 이하를 올림 처리하여 전체 페이지 수를 구함
    });

    //전체 페이지 번호(1부터 totalPages까지)를 담은 배열을 생성
    const pageNumbers = computed(() => {
        const pages = [];
        for (let i = 1; i <= totalPages.value; i++) {
            pages.push(i);
        }
        return pages;
    });

    //이전 페이지로 이동하는 함수
    const goToPrevPage = () => {
        fetchPosts('prev'); //스토어의 fetchPosts 액션을 호출하여 이전 페이지 게시물을 가져옴
    };

    //다음 페이지로 이동하는 함수
    const goToNextPage = () => {
        fetchPosts('next'); //스토어의 fetchPosts 액션을 호출하여 다음 페이지 게시물을 가져옴
    };

    //페이지 이동 시 데이터가 자동으로 업데이트되도록 watch 사용
    watch(() => route.path, (newPath) => {
        //라우터 경로가 '/board'로 변경되었을 때만 실행(작성, 수정 페이지에서 다시 /board로 돌아왔을 경우)
        if (newPath === '/board') {
            //const pageNumber = route.query.page ? Number(route.query.page) : 1;
            fetchPosts('current');
        }
    });
</script>

<template>
    <section class="board_cont">
        <h2 class="cont_tit">게시판</h2>
        <div class="board_list_wrap" v-if="$route.name === 'board'">
            <ul class="list" v-if="processedLists && processedLists.length > 0"> <!-- processedLists가 존재하고 길이가 0보다 클 때만 게시물 목록을 표시 -->
                <li class="list_li list_header">
                    <p class="no">no</p>
                    <p class="tit">제목</p>
                    <p class="writer">작성자</p>
                    <p class="date">등록일</p>
                </li>
                <li v-for="board in processedLists" :key="board.id" class="list_li"> <!-- processedLists 배열을 순회하며 각 게시물(board)에 대한 리스트 아이템을 생성 :key는 Vue가 각 요소를 효율적으로 업데이트하는 데 사용 -->
                    <p class="no">{{board.no}}</p>
                    <RouterLink class="tit" :to="{name: 'boardDetail', params: {id: board.id}}">{{board.title}}</RouterLink>
                    <p class="writer">{{board.writer}}</p>
                    <p class="date">{{board.createdAt ? new Date(board.createdAt.seconds * 1000).toLocaleDateString() : ' '}}</p>
                </li>
            </ul>
            <p v-else>등록된 게시글이 없습니다.</p>
            <div class="list_botton">
                <ul class="pagination" v-if="processedLists && processedLists.length > 0"> <!-- 위와 동일 게시글이 있을 경우 표시 -->
                    <li v-if="hasPrevPage"><a @click="goToPrevPage()"><</a></li>
                    <li v-for="page in pageNumbers" :key="page"><a @click="boardStore.fetchPostsByNumber(page)" :class="{ 'on': currentPageNumber === page }">{{ page }}</a></li>
                    <li v-if="hasNextPage"><a @click="goToNextPage()">></a></li>
                </ul>
                <RouterLink to="/board/write" class="btn writer_btn">글쓰기</RouterLink>
            </div>
        </div>
        <router-view v-else></router-view>
    </section>
</template>