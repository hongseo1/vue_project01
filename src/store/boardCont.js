import { defineStore } from 'pinia';
import axios from 'axios';

export const useBoardStore = defineStore('board', {
    //state: 스토어의 상태를 관리하는 곳
    state: () => ({
        lists: [], //게시물 목록
        per_page: 10, //페이지당 게시물 수
        number_page: 0, //전체 페이지 수
        prev: null, //이전 페이지 번호
        next: null, //다음 페이지 번호
        last: null, //마지막 페이지 번호
        current_page: 1, //현재 페이지 번호
        postDetail: null, //게시물 상세 정보를 저장할 상태 추가
        
        //게시물 작성/수정 폼을 위한 상태
        form: {
            title: '',
            writer: '',
            cont: '',
        },
        isEditMode: false
    }),

    //actions: 상태를 변경하거나 비동기 로직을 처리하는 메서드를 정의
    actions: {
        //게시물 목록을 가져오는 액션
        async getData(page) {
            try {
                const res = await axios.get(`http://localhost:3000/list?_page=${page}&_per_page=${this.per_page}&_sort=-timestamp`);
                this.total_items = res.data.items;
                this.number_page = res.data.pages;
                this.prev = res.data.prev;
                this.next = res.data.next;
                this.last = res.data.last;
                this.current_page = page;

                const data_process = res.data.data;
                const data_nums = data_process.map((item, index) => {
                    const calculated_no = this.total_items - ((this.current_page - 1) * this.per_page) - index;
                    return {
                        ...item,
                        no: calculated_no
                    };
                });
                this.lists = data_nums;
            } catch (error) {
                console.error('서버 문제 발생:', error);
            }
        },

        //게시물 상세 정보를 가져오는 액션
        async getPostDetail(id) {
            try {
                const res = await axios.get(`http://localhost:3000/list/${id}`);
                this.postDetail = res.data;
            } catch (error) {
                console.error('게시물 상세 정보를 가져오는 중 문제 발생:', error);
            }
        },

        //게시물 삭제 액션
        async deletePost(id) {
            try {
                await axios.delete(`http://localhost:3000/list/${id}`);
            } catch (error) {
                console.error('게시물 삭제 중 문제 발생:', error);
            }
        },

        //게시물 작성/수정 폼의 데이터를 초기화하는 액션
        resetForm() {
            this.form = {
                title: '',
                writer: '',
                cont: ''
            };
            this.isEditMode = false;
        },

        //게시물 수정 시, 폼에 기존 데이터를 채우는 액션
        async fetchPostForEdit(id) {
            try {
                const res = await axios.get(`http://localhost:3000/list/${id}`);
                const post = res.data;
                this.form.title = post.title;
                this.form.writer = post.name;
                this.form.cont = post.cont;
                this.isEditMode = true;
            } catch (error) {
                console.error('게시글 데이터를 가져오는 데 실패했습니다 (수정 모드):', error);
                throw error; //에러를 컴포넌트로 전달
            }
        },

        //게시물 작성/수정 액션
        async savePost(id = null, postData) {
            try {
                if (this.isEditMode) {
                    //수정 모드: PUT 요청
                    await axios.put(`http://localhost:3000/list/${id}`, postData);
                } else {
                    //작성 모드: POST 요청
                    await axios.post('http://localhost:3000/list', postData);
                }
            } catch (error) {
                console.error('게시글 저장 중 오류 발생:', error);
                throw error; //에러를 컴포넌트로 전달
            }
        }
    }
});
