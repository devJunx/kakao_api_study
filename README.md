# 작업 내용
- "카카오 API"를 이용하여 책 검색 리스트 구현
- 네이티브 웹뷰 구현
- 웹뷰, 네트워크 모듈 커스텀
# 그외에 알아야 할것
- 윈도우 환경에서 개발함
## 참고 사이트
[kakako developer daum search dev guide](https://developers.kakao.com/docs/latest/ko/daum-search/dev-guide)
## 1. curl을 통한 요청 방법
`curl -X GET "https://dapi.kakao.com/${REQUEST_URL}?{options}" -H "Authorization: KakaoAK ${YOUR_REST_API_KEY}"`
## 2. fetch문을 통한 요청 방법
<pre>
const url = 'http://dapi.kakao.com/${REQUEST_URL}?{options}';
fetch(url, {
method: "get",
headers: {
  "content-type": "application/json",
  "Authorization": "KakaoAK ${YOUR_REST_API_KEY}"
}
})
.then(response => console.log(response)) //
.catch(error => console.log(error));
</pre>
