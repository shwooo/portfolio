import { test, expect } from '@playwright/test';
import path from 'node:path';

export async function 이미지_업로드(page){

    await page.locator('[id="사이드바-업로드-메뉴"]').click();
    await page.waitForTimeout(1000); 

    const 새작업추가버튼 = await page.locator('[id="새_작업_추가_버튼"]', { state: 'visible' });
    await 새작업추가버튼.click();
    const 작업설정_전체선택값: { [key: string]: any } = {};

    const 공급사_전체설정값: string[] = [];
    // 특정 텍스트를 포함하는 요소 찾기
    const 공급사_전체설정값_찾기 = await page.locator("xpath=//*[text()='공급사 선택']/..").first();

    if (공급사_전체설정값_찾기) {
        const 공급사_전체설정값_리스트 = await 공급사_전체설정값_찾기.locator('[type="radio"]').all();
        // 각 버튼 요소의 텍스트 추출 및 출력
        for (const button of 공급사_전체설정값_리스트) {
            const buttonText = await button.getAttribute('value');
            if (buttonText === 'none') {
                공급사_전체설정값.push('공급사 없음(기본 배송지)');   
            } else {
                공급사_전체설정값.push(buttonText);
            }
            console.log(buttonText);
        }
    }
    console.log(공급사_전체설정값);
    if (공급사_전체설정값.length > 0){
        // 리스트에서 랜덤으로 요소 선택
        const randomIndex = Math.floor(Math.random() * 공급사_전체설정값.length);
        const 공급사_랜덤값 = 공급사_전체설정값[randomIndex];
        // 선택한 텍스트에 해당하는 버튼 클릭
        await 공급사_전체설정값_찾기.locator(`xpath=//*[text()='${공급사_랜덤값}']`).click();
        작업설정_전체선택값['공급사'] = 공급사_랜덤값
    }
    await page.getByPlaceholder("예시) 12월 25일 업로드 상품 폴더").fill("자동화 생성 작업");
    await page.locator(`[data-testid="작업 만들기 버튼"]`).click();



    const [fileChooser] = await Promise.all([
        page.waitForEvent("filechooser"),
        page.locator('[data-testid="업로드 상품 추가 버튼"]').nth(0).click()
    ]);
    // 파일 경로를 설정합니다. C:\Users\Looko\PLAYWRIGHT\e2e
    const filePaths = [
        path.join(__dirname, '테스트이미지1.jpg'),
        path.join(__dirname, '테스트이미지2.jpg'),
        path.join(__dirname, '테스트이미지3.jpeg'),
        path.join(__dirname, '테스트이미지4.jpeg')       
    ];
    await page.waitForTimeout(5000); 

    // 여러 파일을 업로드합니다.
    await fileChooser.setFiles(filePaths);
    page.getByRole('button', { name: '업로드' }).click();
    await page.waitForSelector('[role="progressbar"]', { state: 'attached' });

}


export async function 이미지_업로드2(
    page 
  ){


    const 작업설정_전체선택값: { [key: string]: any } = {};

    const 공급사_전체설정값: string[] = [];
    // 특정 텍스트를 포함하는 요소 찾기
    const 공급사_전체설정값_찾기 = await page.locator("xpath=//*[text()='공급사 선택']/..").first();

    if (공급사_전체설정값_찾기) {
        const 공급사_전체설정값_리스트 = await 공급사_전체설정값_찾기.locator('[type="radio"]').all();
        // 각 버튼 요소의 텍스트 추출 및 출력
        for (const button of 공급사_전체설정값_리스트) {
            const buttonText = await button.getAttribute('value');
            if (buttonText === 'none') {
                공급사_전체설정값.push('공급사 없음(기본 배송지)');   
            } else {
                공급사_전체설정값.push(buttonText);
            }
            console.log(buttonText);
        }
    }
    console.log(공급사_전체설정값);

    // 리스트에서 랜덤으로 요소 선택
    const randomIndex = Math.floor(Math.random() * 공급사_전체설정값.length);
    const 공급사_랜덤값 = 공급사_전체설정값[randomIndex];
    // 선택한 텍스트에 해당하는 버튼 클릭
    await 공급사_전체설정값_찾기.locator(`xpath=//*[text()='${공급사_랜덤값}']`).click();
    작업설정_전체선택값['공급사'] = 공급사_랜덤값

    await page.getByPlaceholder("작업 제목").fill("제목 테스트");

    await page.click('button:has-text("작업 만들기")');



    const [fileChooser] = await Promise.all([
        page.waitForEvent("filechooser"),
        page.getByRole('button', { name: '상품 추가' }).click(),
    ]);
    // 파일 경로를 설정합니다.
    const filePaths = [
        path.join(__dirname, '테스트이미지3.jpg'),
        path.join(__dirname, '테스트이미지4.jpeg'),
        path.join(__dirname, '테스트이미지5.jpeg')
    ];

    // 여러 파일을 업로드합니다.
    await fileChooser.setFiles(filePaths);
    page.getByRole('button', { name: '업로드' }).click();
    await page.waitForSelector('[role="progressbar"]', { state: 'detached' });

}
