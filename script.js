// ライトボックスに関連するセレクターとクラス名を定義
const LIGHTBOX_SEL = "[data-lightbox]"; // ライトボックスのトリガー
const OPEN_CLASS = "is-open"; // ライトボックスが開かれているときに付与するクラス
const CLOSE_CLASS = "is-close"; // ライトボックスが閉じられるときに付与するクラス
const body = document.body;
let currentLightbox = null; // 現在開いているライトボックスを管理

// すべてのライトボックス用のdialogを生成
document.querySelectorAll(LIGHTBOX_SEL).forEach((link, index) => {
  const lightboxId = `lightbox-${index + 1}`; // 各ライトボックスに一意のIDを付与
  const lightbox = document.createElement("dialog"); // dialog要素を生成
  lightbox.id = lightboxId;
  lightbox.classList.add("lightbox");
  lightbox.setAttribute("data-lightbox", "");
  lightbox.setAttribute("aria-hidden", "true");

  const lightboxContainer = document.createElement("div");
  lightboxContainer.classList.add("lightbox-container");
  lightboxContainer.setAttribute("data-lightbox-container", "");

  const lightboxInner = document.createElement("div");

  const lightboxImg = document.createElement("img");
  lightboxImg.id = `lightbox-image-${index + 1}`;

  const closeBtn = document.createElement("button");
  closeBtn.classList.add("lightbox-btn");
  closeBtn.setAttribute("type", "button");
  closeBtn.setAttribute("data-lightbox-close", "");
  closeBtn.setAttribute("aria-label", "ライトボックスを閉じる");
  closeBtn.textContent = "ライトボックスを閉じる";

  // 要素を組み立ててbodyに追加
  lightboxInner.appendChild(lightboxImg);
  lightboxInner.appendChild(closeBtn);
  lightboxContainer.appendChild(lightboxInner);
  lightbox.appendChild(lightboxContainer);
  document.body.appendChild(lightbox);

  // 画像リンクをクリックするとライトボックスを開く
  link.addEventListener("click", (e) => {
    e.preventDefault(); // デフォルトのリンク動作を防ぐ
    openLightbox(lightboxId, link.getAttribute("href"), link.querySelector("img")?.alt || "");
  });

  // ライトボックス外のクリックで閉じる
  lightbox.addEventListener("click", (e) => {
    if (!e.target.closest(".lightbox-container")) {
      closeLightbox();
    }
  });

  // ライトボックスの閉じるボタンをクリック
  closeBtn.addEventListener("click", () => closeLightbox());
});

// ESCキーを押したら現在開いているライトボックスを閉じる
window.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && currentLightbox) {
    e.preventDefault(); // デフォルトの動作を防ぐ
    closeLightbox();
  }
});

// ライトボックスを開く関数
function openLightbox(lightboxId, src, alt) {
  const lightbox = document.getElementById(lightboxId);
  const lightboxImg = lightbox.querySelector("img");

  // クリックされた画像のsrcとaltを設定
  lightboxImg.src = src;
  lightboxImg.alt = alt;

  // ライトボックスを開く前にbodyをinertに設定（モーダル以外の要素を無効化）
  body.setAttribute("inert", "");

  lightbox.classList.add(OPEN_CLASS); // ライトボックスを開くクラスを追加
  lightbox.setAttribute("aria-hidden", "false"); // アクセシビリティ用にaria-hiddenをfalseに設定
  lightbox.showModal(); // ネイティブのshowModal()でライトボックスを表示

  // ライトボックス自体をinertの影響から除外
  lightbox.removeAttribute("inert");

  // スクロールを無効化
  body.style.overflow = "hidden";
  body.style.height = "100vh";

  // フェードインアニメーションを適用
  requestAnimationFrame(() => {
    lightbox.classList.remove(OPEN_CLASS);
  });

  // 現在開いているライトボックスを保存
  currentLightbox = lightbox;
}

// ライトボックスを閉じる関数
function closeLightbox() {
  if (!currentLightbox) return; // 現在開いているライトボックスがなければ処理しない

  const lightbox = currentLightbox;

  lightbox.classList.add(CLOSE_CLASS); // ライトボックスを閉じるクラスを追加
  lightbox.setAttribute("aria-hidden", "true"); // アクセシビリティ用にaria-hiddenをtrueに設定

  // スクロールを有効化
  body.style.overflow = "";
  body.style.height = "";

  // フェードアウトアニメーション終了後にライトボックスを閉じる
  lightbox.addEventListener(
    "transitionend",
    () => {
      lightbox.classList.remove(CLOSE_CLASS); // 閉じるクラスを削除
      lightbox.close(); // ネイティブのclose()でライトボックスを閉じる

      // bodyを通常の状態に戻す
      body.removeAttribute("inert");

      // 現在のライトボックスをクリア
      currentLightbox = null;
    },
    { once: true } // 一度だけ実行するリスナー
  );
}
