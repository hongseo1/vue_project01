import { defineStore } from 'pinia';
import { db } from '@/firebase'; //Firebase db 인스턴스 임포트
import { collection, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc, query, orderBy, limit, startAfter, getCountFromServer } from "firebase/firestore"; //study.vue 설명 참조

export const useBoardStore = defineStore('board', { //'board'라는 이름의 Pinia 스토어를 정의
    state: () => ({ //state: 스토어의 상태(데이터)를 관리하는 곳, 모든 반응형 데이터는 여기에 정의
        lists: [], //게시물 목록을 저장하는 배열(Firestore에서 가져온 원본 데이터를 담음)
        per_page: 10, //한 페이지당 표시할 게시물의 개수를 정의
        lastVisibleDoc: null, //다음 페이지를 위한 "마지막으로 보이는 문서" 참조, Firestore 페이지네이션의 커서 역할
        pageHistory: [], //페이지 이동 기록을 저장하는 배열, 이전 페이지로 돌아갈 때 사용될 'lastVisibleDoc' 참조들을 저장
        currentPageNumber: 1, //사용자가 현재 보고 있는 페이지 번호를 나타냄(UI 표시용으로 사용)
        hasMoreData: true, //다음 페이지에 데이터가 더 있는지 여부를 나타내는 객체, 더 이상 불러올 데이터가 없으면 'false'
        totalPostsCount: 0, //전체 게시물 수를 저장할 상태, 게시물 번호를 계산하거나 전체 페이지 수를 표시하는 데 사용
        postDetail: null, //특정 게시물 상세 정보를 담을 객체, 게시물 상세 페이지에서 사용
        form: { //게시물 작성 또는 수정 시 사용되는 폼의 입력 필드 데이터를 담을 객체
            title: '',
            writer: '',
            cont: '',
        },
        isEditMode: false //현재가 게시물 수정 모드인지('true') 아니면 새 글 작성 모드인지('false')를 구분하기 위한 객체
    }),
    getters: { // getters: 'state'를 기반으로 계산된 속성을 정의하는 곳, 'state'를 직접 수정하지 않고 파생된 상태를 반환
        processedLists: (state) => {
            if (!state.lists || state.lists.length === 0) { //'lists'가 없거나 비어있으면 빈 배열을 반환
                return [];
            }
            //'lists' 배열을 순회하며 각 게시물에 고유 번호('no')를 추가
            return state.lists.map((item, index) => {
                //전체 게시물 수에서 현재 페이지의 시작 게시물 번호를 빼고, 인덱스를 더해 정확한 역순 번호를 계산
                const startPostIndex = (state.currentPageNumber - 1) * state.per_page;
                const calculated_no = state.totalPostsCount - startPostIndex - index;
                return {
                    id: item.id, //Firestore 문서의 고유 ID
                    ...item,     //기존 게시물 데이터(제목, 작성자, 내용 등)를 복사
                    no: calculated_no //계산된 게시물 번호
                };
            });
        },
        hasNextPage: (state) => state.hasMoreData, //다음 페이지가 있는지 여부를 반환, 'hasMoreData' 상태를 직접 사용
        hasPrevPage: (state) => state.pageHistory.length > 0, //이전 페이지가 있는지 여부를 반환, 'pageHistory' 배열의 길이를 확인하여 판단
    },
    actions: { //actions: 비동기 작업 및 'state' 변경 로직을 정의하는 곳, 'state'를 직접 변경할 수 있다.
        //게시물 목록을 가져오는 비동기 액션
        async fetchPosts(direction = 'current') { //페이지네이션 방향('next', 'prev', 'current')을 인자로 받음
            try {
                const boardCollectionRef = collection(db, 'board'); //'board' 컬렉션에 대한 참조를 생성 (collection() 함수: Firestore DB내의 특정 컬렉션에 대한 참조를 생성 study.vue 설명 참고 77라인)

                //게시물 번호('no')를 올바르게 계산하고 UI에 전체 페이지 정보를 표시하는 데 필요(getCountFromServer()는 이 전체 개수를 빠르고 효율적으로 얻어낼 수 있게 해줌)
                const countSnapshot = await getCountFromServer(boardCollectionRef); //'board' 컬렉션 내의 모든 문서 수를 세어줌(getCountFromServer() 함수: Firebase Firestore에서 문서의 수를 효율적으로 계산하기 위해 사용되는 함수
                this.totalPostsCount = countSnapshot.data().count; //Firestore 서버에서 'board' 컬렉션의 전체 문서 개수를 가져와 'totalPostsCount' 상태에 저장(스토어를 사용하는 모든 컴포넌트에서 이 totalPostsCount 값을 반응형으로 활용할 수 있게됨)

                let q; //Firestore 쿼리 객체를 저장할 변수를 선언

                if (direction === 'next') { //'next' 방향: 다음 페이지로 이동
                    if (!this.lastVisibleDoc) { //'lastVisibleDoc'이 없으면 더 이상 다음 페이지가 없다는 의미
                        console.warn("더 이상 다음 페이지가 없습니다.");
                        this.hasMoreData = false; //'false'로 설정하여 다음 페이지가 없음을 표시
                        return; //함수 실행 중단
                    }
                    
                    this.pageHistory.push(this.lastVisibleDoc); //현재 페이지의 마지막 문서를 'pageHistory'에 기록하여 이전 페이지로 돌아갈 때 사용
                    q = query(boardCollectionRef, orderBy('createdAt', 'desc'), startAfter(this.lastVisibleDoc), limit(this.per_page)); //'createdAt' 필드를 기준으로 내림차순 정렬하고, 'lastVisibleDoc' 이후부터 'per_page' 개수만큼 게시물을 가져오는 쿼리를 생성
                } else if (direction === 'prev') { //이전 페이지로 이동
                    if (this.pageHistory.length === 0) { //'pageHistory'가 비어있으면 더 이상 이전 페이지가 없다는 의미
                        console.warn("더 이상 이전 페이지가 없습니다.");
                        return; //함수 실행 중단
                    }
                    
                    this.pageHistory.pop(); //'pageHistory'에서 현재 페이지의 마지막 문서 참조를 제거
                    const prevLastDoc = this.pageHistory[this.pageHistory.length - 1]; //제거 후, 'pageHistory'의 마지막 요소(즉, 이전 페이지의 마지막 문서 참조)를 가져옴
                    
                    if (prevLastDoc) { //prevLastDoc이 존재하면 해당 문서부터 시작하는 쿼리
                        q = query(boardCollectionRef, orderBy('createdAt', 'desc'), startAfter(prevLastDoc), limit(this.per_page));
                    } else { //'prevLastDoc'이 없으면 (즉, 'pageHistory'가 비어있으면) 첫 페이지로 돌아감
                        q = query(boardCollectionRef, orderBy('createdAt', 'desc'), limit(this.per_page)); //처음부터 'per_page' 개수만큼 게시물을 가져오는 쿼리를 생성
                    }
                } else { //'current' 방향 (현재 페이지 새로고침) 또는 첫 로딩 시
                    q = query(boardCollectionRef, orderBy('createdAt', 'desc'), limit(this.per_page));
                    this.pageHistory = []; //페이지 기록 초기화
                }
                
                const querySnapshot = await getDocs(q); //구성된 쿼리를 실행하여 문서 스냅샷을 비동기적으로 가져옴
                
                if (querySnapshot.empty) { //가져온 문서가 없을 경우(더 이상 게시물이 없는 경우) 상태를 업데이트
                    this.lists = []; //게시물 목록을 비움
                    this.lastVisibleDoc = null; //'lastVisibleDoc'을 초기화
                    this.hasMoreData = false; //다음 데이터가 없음을 표시
                    console.log("더 이상 게시물이 없습니다.");
                    this.currentPageNumber = this.pageHistory.length + 1; //페이지 번호를 갱신
                    return; //함수 실행 중단
                }

                this.hasMoreData = querySnapshot.docs.length === this.per_page; //가져온 문서의 개수가 'per_page'와 같으면 다음 페이지가 더 있을 가능성이 높다고 판단
                this.lists = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })); //가져온 문서들을 'lists' 상태에 저장, 각 문서의 ID와 데이터를 포함
                this.lastVisibleDoc = querySnapshot.docs[querySnapshot.docs.length - 1]; //현재 페이지의 마지막 문서를 'lastVisibleDoc'에 저장하여 다음 페이지 쿼리에 사용
                this.currentPageNumber = this.pageHistory.length + 1; //데이터를 성공적으로 가져온 후 현재 페이지 번호를 올바르게 업데이트

            } catch (error) {
                console.error('게시물 목록을 가져오는 중 오류 발생:', error);
                throw error; //에러를 다시 throw하여 상위 컴포넌트에서 처리할 수 있도록
            }
        },
        //특정 페이지 번호로 직접 이동할 때 호출될 비동기 액션
        async fetchPostsByNumber(targetPageNumber) { 
            if (targetPageNumber === this.currentPageNumber) { //목표 페이지가 현재 페이지와 같으면 아무것도 하지 않고 함수를 종료
                return; 
            }

            if (targetPageNumber < this.currentPageNumber) { //목표 페이지가 현재 페이지보다 이전일 경우
                const stepsBack = this.currentPageNumber - targetPageNumber; 
                for (let i = 0; i < stepsBack; i++) { //현재 페이지에서 목표 페이지까지 'prev' 액션을 반복 호출하여 역방향으로 이동
                    await this.fetchPosts('prev');
                }
            } 
            else { //목표 페이지가 현재 페이지보다 이후일 경우(targetPageNumber > this.currentPageNumber)
                const stepsForward = targetPageNumber - this.currentPageNumber;
                for (let i = 0; i < stepsForward; i++) { //현재 페이지에서 목표 페이지까지 'next' 액션을 반복 호출하여 정방향으로 이동
                    await this.fetchPosts('next');
                }
            }
        },
        //게시물 상세 정보를 가져오는 비동기 액션
        async getPostDetail(id) { 
            try {
                const docRef = doc(db, 'board', id); //'board' 컬렉션에서 특정 'id'를 가진 문서에 대한 참조를 생성
                const docSnap = await getDoc(docRef); //해당 문서의 스냅샷을 비동기적으로 가져옴
                
                if (docSnap.exists()) { //문서가 존재하는지 확인
                    this.postDetail = { //'postDetail' 상태에 문서 ID와 문서 데이터를 저장
                        id: docSnap.id,
                        ...docSnap.data()
                    };
                } else {
                    console.warn('해당 ID의 게시물이 존재하지 않습니다:', id);
                    this.postDetail = null; //게시물이 없으면 'postDetail'을 'null'로 설정
                }
            } catch (error) {
                console.error('게시물 상세 정보를 가져오는 중 오류 발생:', error);
                throw error;
            }
        },
        //게시물 삭제 비동기 액션
        async deletePost(id) {
            try {
                await deleteDoc(doc(db, 'board', id)); //'board' 컬렉션에서 특정 'id'를 가진 문서를 삭제
                await this.fetchPosts(); //삭제 후 게시물 목록을 새로고침하여 최신 상태를 반영
            } catch (error) {
                console.error('게시물 삭제 중 오류 발생:', error);
                throw error; 
            }
        },
        //게시물 작성/수정 폼의 데이터를 초기화하는 액션
        resetForm() {
            this.form = { //form 값으로 초기화
                title: '',
                writer: '',
                cont: ''
            };
            this.isEditMode = false; //새 글 작성 모드로 전환
        },
        //게시물 수정 시, 폼에 기존 데이터를 채우는 비동기 액션
        async fetchPostForEdit(id) {
            try {
                const docRef = doc(db, 'board', id); //'board' 컬렉션에서 특정 'id'를 가진 문서에 대한 참조를 생성
                const docSnap = await getDoc(docRef); //해당 문서의 스냅샷을 비동기적으로 가져옴

                if (docSnap.exists()) { //문서가 존재하는지 확인
                    const post = docSnap.data(); //문서 데이터를 가져옴
                    //폼 필드에 기존 게시물 데이터를 채움 '|| '''를 사용하여 데이터가 없을 경우 빈 문자열로 설정하여 에러를 방지
                    this.form.title = post.title || '';
                    this.form.writer = post.writer || '';
                    this.form.cont = post.cont || '';
                    this.isEditMode = true; //수정 모드로 전환
                } else {
                    console.warn('수정할 게시물을 찾을 수 없습니다:', id);
                    this.resetForm(); //게시물을 찾지 못하면 폼을 초기화
                    throw new Error('게시글 데이터를 가져오는 데 실패했습니다 (수정 모드): 게시글 없음'); //에러를 throw하여 컴포넌트에서 'catch'할 수 있도록
                }
            } catch (error) {
                console.error('게시글 데이터를 가져오는 데 실패했습니다 (수정 모드):', error);
                throw error; //에러를 다시 throw
            }
        },
        //게시물 작성/수정 비동기 액션
        async savePost(id = null, componentPostData) { //'id'는 수정 시에만 사용(기본값은 'null'), componentPostData를 인자로 추가
            try {
                /* let finalDataToSave = { ...componentPostData };  */ //컴포넌트에서 전달받은 데이터를 기본으로 사용
                /* 
                if (finalDataToSave.timestamp) { //'timestamp' 필드가 존재하면 'createdAt' 필드로 정규화하고 'timestamp' 필드는 삭제 (BoardWriteEdit.vue에서 timestamp: Date.now()로 구현하였으나 차후에 수정할 거니깐 우선은...)
                    finalDataToSave.createdAt = finalDataToSave.timestamp;
                    delete finalDataToSave.timestamp; 
                } 
                */
                
                if (this.isEditMode && id) { //'isEditMode'가 'true'이고 'id'가 존재하면 수정 모드로
                    //수정 모드: 'updateDoc'을 사용하여 기존 문서를 부분적으로 업데이트, createdAt 필드는 수정 시 일반적으로 변경하지 않으므로, 업데이트 데이터에서 제외
                    const { createdAt, ...updateData } = componentPostData; //(finalDataToSave에서 componentPostData로 수정)
                    const postRef = doc(db, 'board', id); //특정 문서에 대한 참조 생성
                    await updateDoc(postRef, updateData); //문서 업데이트
                    console.log('게시글이 성공적으로 수정되었습니다:', id);
                } else {//작성 모드: 'addDoc'을 사용하여 새 문서를 추가, 'createdAt' 필드를 컴포넌트에서 전달받은 값(Date.now())을 사용, 만약 컴포넌트에서 createdAt이 전달되지 않았다면 Date.now()로 기본값 설정
                    /* 
                    if (!finalDataToSave.createdAt) { //createdAt이 이미 componentPostData에 없다면
                        finalDataToSave.createdAt = Date.now(); //Date.now()로 날짜 저장
                    } 
                    */
                    const docRef = await addDoc(collection(db, 'board'), componentPostData);
                    /* const docRef = await addDoc(collection(db, 'board'), finalDataToSave); */
                    console.log('새 게시글이 성공적으로 작성되었습니다. ID:', docRef.id);
                }
                await this.fetchPosts(); //데이터 변경(작성 또는 수정) 후 게시물 목록을 새로고침
                this.resetForm(); //form 초기화
            } catch (error) {
                console.error('게시글 저장 중 오류 발생:', error);
                throw error; //에러를 다시 throw
            }
        }
    }
});
