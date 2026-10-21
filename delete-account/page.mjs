import {signProof} from './sign.mjs';
const $ = id => document.getElementById(id);
$('sign').addEventListener('click', async () => {
  $('result').value = ''; $('status').textContent = '';
  if (!$('consent').checked) { $('status').textContent = '削除依頼の内容を確認し、チェックを入れてください。'; return; }
  const file = $('proof').files[0];
  if (!file || file.size > 4096) { $('status').textContent = '削除専用確認ファイルを選択してください。'; return; }
  $('sign').disabled = true;
  try {
    const result = await signProof(await file.text(), $('challenge').value.trim());
    $('result').value = JSON.stringify(result);
    $('status').textContent = 'この署名結果だけを運営へ返信してください。確認ファイルを添付しないでください。';
  } catch (_) {
    $('status').textContent = '作成できませんでした。ファイルと確認用データを確認してください。対応しない場合は最新版のChromeまたはSafariでお試しください。';
  } finally { $('proof').value = ''; $('sign').disabled = false; }
});
