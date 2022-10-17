const contentBox = document.getElementById("detail_box");
const form = document.getElementById("commentForm");
let deleteComments = document.querySelectorAll("#comment_span");

const addComment = (text, id) => {
  const contentsComments = document.querySelector(".comment_showing_box ul");
  const newComment = document.createElement("li");
  newComment.dataset.id = id;
  const span = document.createElement("span");
  span.innerText = ` ${text}`;
  const span2 = document.createElement("span");
  span2.innerText = "❌";
  newComment.appendChild(span);
  newComment.appendChild(span2);
  contentsComments.prepend(newComment);
};

const handleSubmit = async (event) => {
  event.preventDefault();
  const textarea = form.querySelector("textarea");
  const text = textarea.value;
  const contentId = contentBox.dataset.id;
  if (text === "") {
    return;
  }
  const response = await fetch(`/api/contents/${contentId}/comment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  });
  if (response.status === 201) {
    textarea.value = "";
    const { newCommentId } = await response.json();
    addComment(text, newCommentId);
  }
};

const handleDeleteComment = async (event) => {
  const li = event.srcElement.parentNode;
  const {
    dataset: { id: commentId },
  } = li;
  await fetch(`/api/comment/${commentId}`, {
    method: "POST",
  });
  li.remove();
};

if (form) {
  form.addEventListener("submit", handleSubmit);
}

if (deleteComments) {
  deleteComments.forEach((deleteComment) => {
    deleteComment.addEventListener("click", handleDeleteComment);
  });
}
