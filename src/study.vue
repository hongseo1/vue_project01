<!-- 코드 추가 설명 (복습용)
 - import로 Vue의 컴포지셔 API 함수들을 가지고 오는 것들 설명 { }
onMounted: 컴포넌트가 마운틴된 후(DOM에 추가된 후) 실행될 코드를 정의 
watch: 특정 데이터의 변화를 감지하고, 변화가 있을 때마다 특정 로직을 실행 (java에서 배운 것과 동일)
computed: 기존의 반응형 데이터를 기반으로 새로운 반응형 데이터를 만든다.

useRouter() 와 useRoute()
- useRouter: 라우터 인스턴스에 접근 (라우터 조작), router.push / router.replace / router.back() 등 라우팅을 조작할 때 사용한다.
- useRoute: 현재 활성화된 라우트에 대한 정보에 접근 (라우터 정보 조회), params, query, path, name, meta 등 현재 라우팅 정보를 읽을 때 사용한다.

use'StoreName'Store: Pinia 스토어를 가져옴 (ex)) import { useBoardStore } from '@/store/boardCont.js';)
storeToRefs: Pinia 스토어의 상태를 직접 구조분해 할당 (destructuring)하여 반응성을 유지하는 데 사용 일반적인 구조분해는 반응성을 잃게 된다.

- 변수 선언 관련 설명
const route = useRoute();
useRouter() 훅을 사용하여 현재 라우터(경로) 객체를 가져온다.

const 'StoreName'Store = use'StoreName'Store();
use'StoreName'Store() 훅을 사용하여 Pinia로 정의된 스토어 인스턴스를 가져온다.

const { 'store state에 선언한 변수명' } = storeToRefs('StoreName'Store);
storeToRefs: Pinia 스토어 상태(state)를 반응형 참조(ref)로 만든다. (상태가 변경될 때마다 화면 업데이트)

const { 'store에 액션명' } = boardStore;
스토어의 액션을 직접 가져와 사용(위에서 useBoardStore()를 가져왔을 경우 사용)

const processedLists = computed(() => boardStore.processedLists);
processedLists는 getter이므로 computed 속성으로 래핑하여 반응성을 유지함 getter는 자동으로 캐싱되고, 종속된 반응형 데이터가 변경될 때만 다시 계산된다.

props: Vue.js 컴포넌트가 부모 컴포넌트로부터 데이터를 전달받을 때 사용하는 속성으로 props를 통해 전달받은 데이터를 내부에서 사용할 수 있으며(객체 참조 가능), 이를 통해 컴포넌트의 재사용성과 유연성이 높아진다.
defineProps({...}): props를 정의 할 때 사용하는 매크로, Vue3의 <script setup> 컴포지션 API에서 컴포넌트의 props를 선언하는 표준 방식
BoardDetail.vue에서 사용하고 있는 props는 props.id와 같이 접근하여 부모 컴포넌트로부터 전달받은 id값을 사용할 수 있다.
부모 컴포넌트에서 BoardDtail:id="aa"와 같이 전달할 경우 BoardDtail 컴포넌트 안에서는 props.id의 값이 aa가 된다.


사용은 하지 않았지만 권장 사항
BoardWriteEdit.vue에서 submitPost 함수 실행 시에 timestamp: Date.now() 부분을 Date.now()를 사용하는 대신
Firestore의 serverTimestamp을 사용하는 것이 권장(데이터를 Firestore로 사용하고 있어서 기능과 통합하기에 좋음)
serverTimestamp: 이 값은 Firestore 서버에 문서가 기록되는 시점의 시간을 기반으로 하기에 클라이언트의 시간 설정과 무관하게 Firestore 서버가 관리하는 정확한 시간으로 기록되어, 모든 사용자와 모든 데이터에서 시간의 일관성을 완벽하게 유지할 수 있다.
게시글 작성 시간, 마지막 수정 시간 등 중요한 시간 정보를 다룰 때 매우 중요하기 때문

Firestore 기능과의 통합: Timestamp는 Firestore에서 지원하는 특수 데이터 타입으로 이를 사용하면 Firestore에서 시간 기반으로 데이터를 정렬(orderBy)하거나 필터링(where)할 때 더 효율적이고 안정적인 쿼리 성능을 기대할 수 있다. Date.now()로 저장된 일반 숫자형 타임스탬프도 정렬/필터링이 가능하지만, Timestamp 타입이 Firestore의 고유한 시간 처리 방식과 더 잘 맞다.

++
RouterLink
(
main.js에 전역으로 등록한 경우가 아닌 개별 등록할 경우 RouterLInk를 import 해줘야하는데 해당 컴포넌트에 개별로 imoprt할 경우의 장점은 다음과 같다.

- 트리 쉐이킹 (Tree Shaking) 최적화
전역 등록 시: 번들러(Webpack, Vite 등)는 해당 컴포넌트가 전역으로 등록되어 있기 때문에, 실제로 사용되는지 여부와 상관없이 최종 번들에 포함시킬 가능성이 높다.
개별 import 시: import 문을 사용하면 번들러가 코드의 의존성을 명확하게 파악할 수 있다. 만약 특정 컴포넌트에서 RouterLink를 전혀 사용하지 않는다면, 번들러는 이를 '사용되지 않는 코드(Dead Code)'로 간주하고 최종 번들에서 제거한다. 이를 트리 쉐이킹이라고 하며, 애플리케이션의 번들 크기를 줄여 로딩 성능을 최적화하는 데 매우 중요하다. 이것이 바로 개별 import가 성능 측면에서 더 '표준'이 되는 가장 큰 이유이다.

- 명시적인 의존성 관리 및 가독성 
<script setup>을 사용하는 Vue 3 컴포넌트는 모든 외부 의존성(다른 컴포넌트, 유틸리티 함수 등)을 파일 상단에 import 문으로 명시하는 것을 권장힌다.

이를 통해 해당 컴포넌트가 무엇에 의존하고 있는지 한눈에 파악할 수 있어 코드의 가독성이 높아지고, 장기적인 유지보수나 팀 협업 시 불필요한 혼동을 줄일 수 있다. '마법처럼 작동하는' 것보다 '명시적으로 가져와서 사용하는' 것이 현대적인 개발 방식에서는 선호된다.

(출저를 물었더니 Vue 커뮤니티 및 Best Practice 논의: Vue 개발자 커뮤니티(예: Vue.js 포럼, Stack Overflow, 다양한 기술 블로그)에서는 성능 최적화와 코드 품질 향상을 위해 import를 명시하는 것이 일반적인 모범 사례로 논의되고 있습니다. 특히 큰 규모의 프로젝트나 성능이 중요한 애플리케이션에서는 이러한 접근 방식이 더욱 강조됩니다. 라고 했다.)
)

Pinia Store boardCont.js 설명

collection, //Firestore 컬렉션에 대한 참조를 생성하는 함수
getDocs,    //쿼리 스냅샷에서 여러 문서를 비동기적으로 가져오는 함수
doc,        //특정 Firestore 문서에 대한 참조를 생성하는 함수
getDoc,     //특정 문서를 비동기적으로 가져오는 함수
addDoc,     //지정된 컬렉션에 새 문서를 추가하는 함수
updateDoc,  //기존 문서를 업데이트하는 함수
deleteDoc,  //문서를 삭제하는 함수
query,      //Firestore 쿼리를 구성하는 함수
orderBy,    //쿼리 결과를 특정 필드를 기준으로 정렬하는 함수
limit,      //쿼리 결과의 최대 개수를 제한하는 함수
startAfter, //페이지네이션을 위해 특정 문서 이후부터 쿼리를 시작하는 함수
getCountFromServer //서버에서 컬렉션의 문서 개수를 가져오는 함수(컬렉션 크기 측정)(비용이 발생할 수 있음)


collection() 함수: Firestore DB내의 특정 컬렉션에 대한 참조를 생성하는 함수
collection(db, 'board'); > db: Firestore db import한 거 'board': 접근하고자 하는 컬렉션의 이름
collection 함수로 변수를 만들어 나중에 이 컬렉션에 문서를 추가하거나(addDoc), 특정 문서를 가져오거나(getDoc), 또는 쿼리(query)를 실행할 때 사용

getCountFromServer() 함수: Firebase Firestore에서 문서의 수를 효율적으로 계산하기 위해 사용되는 함수, 클라이언트 측에서 모든 문서를 직접 가져와서 수를 세는 대신, Firestore 백엔드에서 직접 문서 수를 계산한 후 그 결과만 클라이언트에게 전달해줌

사용하는 이유: 일반적인 getDocs()를 사용하여 모든 문서를 가져온 후 .docs.length로 개수를 세는 방식은 문서 개수가 많을 경우 모든 문서를 다운로드해야 하므로 네트워크 대역폭과 비용이 많이 들 수 있다. getCountFromServer()는 실제 데이터를 가져오지 않고 개수 정보만 가져오므로, 대량의 데이터에 대한 카운트가 필요할 때 훨씬 비용 효율적이다.

this.totalPostsCount = countSnapshot.data().count;
countSnapshot: getCountFromServer 호출의 결과로 반환되는 객체, 이 객체는 일반적인 Firestore 문서 스냅샷과 비슷하지만, 실제 문서 데이터가 아닌 서버에서 계산된 카운트 정보(세어진 문서 개수 정보)를 담고 있다.
.data: 실제 데이터를 객체 형태로 반환
.count: .data() 메서드가 반환하는 객체에 있는 속성. 이 속성은 CountFromServer()가 계산한 최종 문서의 수를 담고 있다. 즉, 이 값을 통해 우리가 원하는 개수를 얻을 수 있는 것

.pop(): JavaScript 배열에서 가장 마지막 요소를 제거하고, 그 제거된 요소를 반환하는 메서드

querySnapshot: 특정 Firestore query가 성공적으로 완료되었을 때 반환되는 객체, 이 객체는 쿼리 결과로 얻어진 문서들의 스냅샷(snapshot) 모음을 담고 있으며, 이 문서들에 대한 다양한 정보를 제공한다.
 -->