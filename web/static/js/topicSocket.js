import { Socket } from "phoenix";

let socket = new Socket("/socket", { params: { token: window.userToken } });

socket.connect();

const createTopicSocket = topicId => {
  let channel = socket.channel(`comments:${topicId}`, {});
  channel
    .join()
    .receive("ok", resp => {
      renderComments(resp.comments);
    })
    .receive("error", resp => {
      console.log("Unable to join", resp);
    });

  channel.on(`comments:${topicId}:new`, renderComment);

  document.querySelector("button").addEventListener("click", () => {
    const content = document.querySelector("textarea").value;
    channel.push("comment:add", { content });
    document.querySelector("textarea").value = "";
    document.querySelector("textarea").focus();
  });
};

function renderComment({ comment }) {
  const renderedComment = commentTemplate(comment);
  document.querySelector(".collection").innerHTML += renderedComment;
}

function renderComments(comments) {
  const renderedComments = comments.map(comment => {
    return commentTemplate(comment);
  });

  document.querySelector(".collection").innerHTML = renderedComments.join("");
}

function commentTemplate(comment) {
  let email = "Anonymous";
  if (comment.user) {
    email = comment.user.email;
  }

  return `
    <li class="collection-item">
      ${comment.content}
      <span class="right secondary-content">${email}</span>
    </li>
  `;
}

window.createTopicSocket = createTopicSocket;
