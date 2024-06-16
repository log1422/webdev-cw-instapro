import { renderHeaderComponent } from "./header-component.js";
import { renderUploadImageComponent } from "./upload-image-component.js";

export function renderAddPostPageComponent({ appEl, onAddPostClick }) {
  let imageUrl = "";

  const render = () => {
    const appHtml = `
      <div class="page-container">
        <div class="header-container">
          <div class="page-header">
            <h1 class="logo">instapro</h1>
            <button class="header-button add-or-login-button">
              <div title="Добавить пост" class="add-post-sign"></div>
            </button>
            <button title="exit-btn" class="header-button logout-button">Выйти</button>  
          </div>
        </div>
        <div class="form">
          <h3 class="form-title">Добавить пост</h3>
          <div class="form-inputs">
            <div class="upload-image-container"></div>
          </div>
            <label>
              Опишите фотографию:
              <textarea id="description" class="input textarea" rows="4"></textarea>
            </label>
            <button class="button" id="add-button">Добавить</button>
          </div>
        </div>
      </div>
    `;

    appEl.innerHTML = appHtml;
    renderHeaderComponent({
      element: document.querySelector(".header-container"),
    });

    const descriptionUser = document.getElementById("description");

    renderUploadImageComponent({
      element: appEl.querySelector(".upload-image-container"),
      onImageUrlChange(newImageUrl) {
        imageUrl = newImageUrl;
      },
    });

    document.getElementById("add-button").addEventListener("click", () => {
      if (!descriptionUser.value) {
        alert("Введите описание картинки");
        return;
      }

      onAddPostClick({
        description: descriptionUser.value.sanitize(),
        imageUrl,
      });
    });
  };

  render();
}