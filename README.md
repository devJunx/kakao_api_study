# 카카오 다음 검색 api를 학습하기 위한 레포지토리
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
