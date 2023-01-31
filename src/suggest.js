import axios from "axios";

const requests = {
  get: (url, headers) => axios.get(url, { headers }),
  post: (url, body) => axios.post(url, body),
};

const authorize = ({
  default_avatar_id: defaultAvatarId,
  display_name: displayName,
}) => {
  const avatarHtml = `<div class="avatar" style="background-image=url('https://avatars.mds.yandex.net/get-yapic/${defaultAvatarId}/islands-middle')"></div>`;
  const nameHtml = `<div class="name">${displayName}</div>`;

  document.getElementById("auth").innerHTML = `${avatarHtml}${nameHtml}`;
};

const fetchYandexData = (token) =>
  requests.get(`https://login.yandex.ru/info?format=json&oauth_token=${token}`);

const saveToken = (token) => localStorage.setItem("token", token);

window.onload = () => {
  YaAuthSuggest.init(
    {
      client_id: "f8c0fb137ddc4bd2acea1a1489b5ae1b",
      response_type: "token",
      redirect_uri: "https://oauth-master-class.vercel.app/token2.html",
    },
    "https://oauth-master-class.vercel.app"
  )
    .then(({ handler }) => handler())
    .then(async (data) => {
      console.log("Сообщение с токеном: ", data);

      saveToken(data.access_token);

      const result = await fetchYandexData(data.access_token);

      console.log("Сообщение с ответом Яндекса: ", result);

      authorize(result);
    })
    .catch((error) => console.log("Что-то пошло не так: ", error));
};