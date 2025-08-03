<script setup>

</script>

<template>
    <section class="home_cont">
        <h1>메인화면</h1>
        <div class="bg_text"></div>
        <div class="text">
            본 포트폴리오는 Vue.js를 독학한 후 제작되었습니다. <br/> 
            Vue.js의 주요 장점이라고 생각하는 <br/>  '컴포넌트 기반 개발', '반응형 데이터 바인딩', '간결한 문법' 등을 <br/>  활용하여 게시판과 상품 리스트 기능을 구현해 보았습니다. <br/> 
            이를 통해 Vue.js에 대한 저의 이해와 실무 적용 가능성을 보여드리고자 합니다.
        </div>
    </section>
</template>

<style scoped>
    .home_cont{display: block; height: 75vh;}
    .bg_text{position: fixed; top: 0; left: 0; width: 100%; height: 100vh; background: url("../assets/img/main_bg_text.png") repeat-x; background-size: 70% auto; background-position: 100% calc(7vh + 1vw + 15rem); animation: text_ticker 30s linear infinite; opacity: 1; transition: opacity 0.5s ease-out; z-index: -1;}
    @keyframes text_ticker{
        to {
           background-position: -100% calc(7vh + 1vw + 15rem);
        }
    }
    .bg_none{opacity: 0;}
    .text{display: block; position: absolute; top: 55%; left: 50%; transform: translateX(-50%); width: 100%; font-size: 1.2em; text-align: center; line-height: 150%; color: #222222;}
</style>