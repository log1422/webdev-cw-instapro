import { USER_POSTS_PAGE } from "../routes.js";
import { renderHeaderComponent } from "./header-component.js";
import {getToken, posts, goToPage, user} from "../index.js";
import { likeChange } from "../api.js";
import { timeAgo } from "../helpers.js";

export function renderPostsPageComponent({ appEl }) {
  const postsHtml = [];

  posts.forEach((post) => {
    const likeSvg = post.isLiked ? "like-active.svg" : "like-not-active.svg";
    let likeDescription

    if (user && post.isLiked) {
      const length = post.likes.length - 1

      if (length)
        likeDescription = `<strong>${user.name.sanitize()}</strong> и <strong>${length}</strong>`
      else
        likeDescription = `<strong>${user.name.sanitize()}</strong>`
    } else {
      likeDescription = `<strong>${post.likes.length}</strong>`
    }

    postsHtml.push(
    `<li class="post">
      <div class="post-header" data-user-id="${post.user.id}">
          <img src="${post.user.imageUrl}" class="post-header__user-image" alt="person">
          <p class="post-header__user-name">${post.user.name.sanitize()}</p>
      </div>
      <div class="post-image-container">
        <img class="post-image" src="${post.imageUrl}" alt="avatarka">
      </div>
      <div id="${post.id}" class="post-likes">
        <button data-id="${post.id}" data-like="${post.isLiked}" class="like-button">
          <img src="./assets/images/${likeSvg}" alt="heart">
        </button>
        <p class="post-likes-text">
<!--          Нравится: <strong>${post.likes.length}</strong>-->
          Нравится: ${likeDescription}
        </p>
      </div>
      <p class="post-text">
        <span class="user-name">${post.user.name.sanitize()}</span>
        ${post.description}
      </p>
      <p class="post-date">
        ${timeAgo(new Date(post.createdAt))}
      </p>
    </li>`
    )
  })

  const appHtml = `
              <div class="page-container">
                <div class="header-container"></div>
                <ul class="posts">
                  ${postsHtml.join('')}
                </ul>
              </div>`;

  appEl.innerHTML = appHtml;

  renderHeaderComponent({
    element: document.querySelector(".header-container"),
  });

  for (let userEl of document.querySelectorAll(".post-header")) {
    userEl.addEventListener("click", () => {
      goToPage(USER_POSTS_PAGE, {
        userId: userEl.dataset.userId,
      });
    });
  }

  renderLike()
}

function renderLike() {
  for (let likesButtons of document.querySelectorAll(".like-button")) {
    likesButtons.addEventListener("click", () => {
      const postId = likesButtons.dataset.id

      const likePosition = (likesButtons.dataset.like === "true") ? "dislike" : "like";

      likeChange({token: getToken(), postId, likePosition})
      .then((post) => {
        const likeItem = document.getElementById(post.id)
        const likeSvg = post.isLiked ? "like-active.svg" : "like-not-active.svg";
        let likeDescription

        if (user && post.isLiked) {
          const length = post.likes.length - 1

          if (length)
            likeDescription = `<strong>${user.name}</strong> и <strong>${length}</strong>`
          else
            likeDescription = `<strong>${user.name}</strong>`
        } else {
          likeDescription = `<strong>${post.likes.length}</strong>`
        }

        likeItem.innerHTML = `
        <div id="${post.id}" class="post-likes">
          <button data-id="${post.id}" data-like="${post.isLiked}" class="like-button">
            <img src="./assets/images/${likeSvg}" alt="like">
          </button>
          <p class="post-likes-text">
<!--            Нравится: <strong>${post.likes.length}</strong>-->
            Нравится: ${likeDescription}
          </p>
        </div>`;
      renderLike();
      })
    });
  }
}