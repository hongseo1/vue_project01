<script setup>
import { RouterLink } from 'vue-router';


</script>

<template>
    <main>
        <section class="board_cont">
            <h1>게시글 작성</h1>
            <h2>게시판</h2>
            <div id="board_create" class="board_create_update">
                <form action="" method="post">
                    <input type="hidden" key="no"/>
                    <input type="hidden"/> <!-- regdate -->
                    <input type="hidden"/> <!-- writer -->
                    <div class="board_cr_up_li board_tit">
                        <span>제목 </span><textarea rows="5" cols="50"></textarea>
                    </div>
                    <div class="board_cr_up_li board_content cf">
                        <span>내용 </span><textarea th:field="*{content}"></textarea>
                    </div>
                    <div class="board_cr_up_li board_writer cf">
                        <span>작성자 </span><input type="text"/> <!-- disabled -->
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