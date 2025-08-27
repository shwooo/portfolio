import { test, expect } from '@playwright/test';
import { 이미지_업로드 } from "./image_upload.spec";
import path from 'node:path';

// 튜토리얼 여부 localStorage 에 넣기
const tutorialData = {
  "AI_상품설명_생성했는가": false,
  "AI_상품설명_튜토리얼": false,
  "서비스소개": false,
  "첫_정보입력_완료": false,
  "메인_기능_튜토리얼": false,
  "업로드_페이지_튜토리얼": false,
  "작업_상세_페이지_튜토리얼": false,
  "상세설명_편집기_튜토리얼": false,
  "업로드_설정_튜토리얼": false,
  "작업_상세_업로드_튜토리얼": false,
  "상품_분류_모달_튜토리얼": false
};


test.beforeEach(async ({ page }) => {
  // 각 테스트 시작 전에 실행될 코드
  await page.goto('url'); // 내부 QA용 사이트
  await page.evaluate((data) => {
    localStorage.setItem('tutorial', JSON.stringify(data));
  }, tutorialData);
    // 페이지를 새로 고침하여 로컬 스토리지 데이터가 반영되도록 함
  await page.reload();

  await page.getByRole('textbox', { name: '이메일' }).fill('zxcv@acloset.app');
  await page.getByRole('textbox', { name: '비밀번호' }).fill('1q2w3e!@');
  await page.getByRole('button', { name: '로그인' }).click();
  await page.waitForTimeout(3000); 
  
});
  
test('가격 설정 - 자주 사용하는 가격 중복/추가', async ({ page }) => {
  await page.locator(`[id="사이드바-설정-메뉴"]`).click();
  await page.getByRole('link', { name: '업로드 설정' }).click();
  await page.getByRole('link', { name: '가격 설정' }).click();
  await expect(page).toHaveURL(/settings\/upload\/price$/)

  const 자주사용하는가격목록 = [];

  // '자주 사용하는 가격' 영역을 찾아 모든 취소 아이콘을 선택합니다.
  const 자주사용하는가격찾기 = await page.locator('xpath=//*[text()="자주 사용하는 가격"]/../../..');
  await 자주사용하는가격찾기.waitFor();  // 해당 요소가 로드될 때까지 대기

  const 자주사용하는가격아이콘들 = 자주사용하는가격찾기.locator('[data-testid="CancelIcon"]');

  if (await 자주사용하는가격아이콘들.count() === 0) {
    function generateRandomFiveDigitNumber() {
        const randomFourDigits = Math.floor(Math.random() * 9000) + 1000; // 1000 ~ 9999 범위
        return randomFourDigits * 10; // 마지막 자리에 0을 붙임
      }

      const randomFiveDigitNumber = generateRandomFiveDigitNumber();
      function formatNumber(value) {
        // 숫자에 쉼표 추가
        return new Intl.NumberFormat('ko-KR').format(value);
      }
      
      const formatted = formatNumber(randomFiveDigitNumber);
      const formatted원 = `${formatted}원`
    
      console.log(formatted); // 출력 예시: 34,540원
      // 중복 확인 함수
      const hasDuplicates = (자주사용하는가격목록) => {
        return new Set(자주사용하는가격목록).size !== 자주사용하는가격목록.length;
      };
    
      if (hasDuplicates(formatted원)) {
        console.log('중복된 값이 있습니다.');
      } else {
        console.log('중복된 값이 없습니다.');
      }

    await page.locator(`[name="pricePresets"]`).fill(randomFiveDigitNumber.toString());
    await page.locator(`role=button[name="추가"]`).click();

  }
  await 자주사용하는가격아이콘들.first().waitFor(); // 첫 번째 아이콘이 나타날 때까지 대기

  // 아이콘 요소의 수를 구합니다.
  const 아이콘수 = await 자주사용하는가격아이콘들.count();

  // 각 버튼의 텍스트를 추출합니다.
  for (let i = 0; i < 아이콘수; i++) {
    const 가격요소 = 자주사용하는가격아이콘들.nth(i).locator('xpath=../..');
    await 가격요소.waitFor();  // 가격 요소가 로드될 때까지 대기

    const 가격텍스트 = await 가격요소.innerText();
    자주사용하는가격목록.push(가격텍스트.trim());
    console.log(가격텍스트.trim());
  }
  
  console.log(자주사용하는가격목록);

  const randomIndex = Math.floor(Math.random() * 자주사용하는가격목록.length);
  // 무작위로 선택된 요소를 클릭합니다.
  // 리스트에서 랜덤하게 하나의 항목 선택
  const 중복시도할가격 = await 자주사용하는가격목록[randomIndex]
  console.log(중복시도할가격)
  await page.waitForTimeout(3000); 

  const 중복시도할가격치환 = 중복시도할가격.replace(/,|원/g, '');  // , 원 문자를 빈 문자열로 치환

  await page.locator(`[name="pricePresets"]`).fill(중복시도할가격치환);
  await page.locator(`role=button[name="추가"]`).click();

  const 중복스낵바 = await page.waitForSelector('[role="alert"]');
  await expect(await 중복스낵바.innerText()).toBe("이미 추가된 가격입니다");


  function generateRandomFiveDigitNumber() {
    const randomFourDigits = Math.floor(Math.random() * 9000) + 1000; // 1000 ~ 9999 범위
    return randomFourDigits * 10; // 마지막 자리에 0을 붙임
  }

  const randomFiveDigitNumber = generateRandomFiveDigitNumber();

  function formatNumber(value) {
    // 숫자에 쉼표 추가
    return new Intl.NumberFormat('ko-KR').format(value);
  }
  
  const formatted = formatNumber(randomFiveDigitNumber);
  const formatted원 = `${formatted}원`

  console.log(formatted); // 출력 예시: 34,540원
  // 중복 확인 함수
  const hasDuplicates = (자주사용하는가격목록) => {
    return new Set(자주사용하는가격목록).size !== 자주사용하는가격목록.length;
  };

  if (hasDuplicates(formatted원)) {
    console.log('중복된 값이 있습니다.');
  } else {
    console.log('중복된 값이 없습니다.');
  }


  await page.locator(`[name="pricePresets"]`).fill(randomFiveDigitNumber.toString());
  await page.locator(`role=button[name="추가"]`).click();

  const 추가후자주사용하는가격목록 = [];

  // '자주 사용하는 가격' 영역을 찾아 모든 취소 아이콘을 선택합니다.
  const 자주사용하는가격찾기2 = await page.locator('xpath=//*[text()="자주 사용하는 가격"]/../../..');
  await 자주사용하는가격찾기2.waitFor();  // 해당 요소가 로드될 때까지 대기

  const 자주사용하는가격아이콘들2 = 자주사용하는가격찾기2.locator('[data-testid="CancelIcon"]');
  await 자주사용하는가격아이콘들2.first().waitFor(); // 첫 번째 아이콘이 나타날 때까지 대기

  // 아이콘 요소의 수를 구합니다.
  const 아이콘수2 = await 자주사용하는가격아이콘들2.count();

  // 각 버튼의 텍스트를 추출합니다.
  for (let i = 0; i < 아이콘수2; i++) {
    const 가격요소 = 자주사용하는가격아이콘들.nth(i).locator('xpath=../..');
    await 가격요소.waitFor();  // 가격 요소가 로드될 때까지 대기

    const 가격텍스트 = await 가격요소.innerText();
    추가후자주사용하는가격목록.push(가격텍스트.trim());
    console.log(가격텍스트.trim());
  }
  
  console.log(추가후자주사용하는가격목록);

  const exists = 추가후자주사용하는가격목록.includes(formatted원);

  console.log(`${randomFiveDigitNumber} 자주 사용하는 가격 목록에 존재 : ${exists}`);
  await expect(exists).toBeTruthy()

  await page.locator(`role=button[name="저장"]`).click();
  await page.waitForTimeout(10000); 

  await 이미지_업로드(page);
  await page.waitForTimeout(30000); 
  await page.getByRole('combobox', { name: '판매가' }).click();

  const dropdown = await page.locator('[data-popper-placement="bottom"]');

  let allTexts = new Set(); // 텍스트 중복 방지를 위해 Set 사용
  let previousHeight = 0;

  while (true) {
  // 현재 드롭다운의 모든 요소 가져오기
  const elements = await dropdown.locator('*').all();

  for (const element of elements) {
    const text = await element.textContent();
    allTexts.add(text?.trim()); // 텍스트를 Set에 추가
  }

  // 현재 높이 가져오기
  const currentHeight = await dropdown.evaluate((element) => element.scrollHeight);

  if (currentHeight === previousHeight) {
    console.log("더 이상 로드된 콘텐츠가 없습니다.");
    break; // 새로운 콘텐츠가 없으면 종료
  }

  // 스크롤 내리기
  await dropdown.evaluate((element) => {
    element.scrollBy(0, 100); // 100px씩 스크롤
  });

  // 약간의 대기
  await page.waitForTimeout(500);

  // 이전 높이 업데이트
  previousHeight = currentHeight;
  }

  console.log("모든 텍스트:", Array.from(allTexts));
  // const 자주사용하는가격리스트 = await page.locator(`[role="presentation"]`).waitFor({ state: 'attached' });
  // await page.waitForTimeout(10000); 
  // const children = 자주사용하는가격리스트.locator('*'); // 모든 하위 요소 선택
  // const childTexts = await children.allInnerTexts(); // 모든 하위 요소의 텍스트 가져오기
  // console.log(childTexts); // 출력

  // for (const button of 자주사용하는가격리스트) {
  //   const buttonText = await button.innerText();
  //   console.log(buttonText)
  // const 중복시도할가격찾기 = await page.locator(`${중복시도할가격}`);
  // await 삭제시도할가격찾기.locator(`[data-testid="CancelIcon"]`).click;
      
});
