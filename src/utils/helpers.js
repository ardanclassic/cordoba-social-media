import { firestore as fs } from "../firebaseConfig";

export const createNewUser = (data) => {
  fs.collection("users")
    .doc(data.user.email)
    .set({
      userID: data.user.uid,
      email: data.user.email,
      created_at: new Date().getTime(),
      login_at: new Date().getTime(),
      userData: {
        ...data.additionalUserInfo.profile,
        gender: "male",
        passion: "A Mysterious Person",
        username: "",
        photoProfile: "",
        request: [],
        notif: [],
        connections: {
          friends: [],
          followers: [],
          followings: [],
        },
      },
    })
    .then(() => {
      console.log("User successfully created!");
      return;
    })
    .catch((error) => {
      console.error("Error create user: ", error);
    });
};

export const SetNameFromEmail = (name) => {
  const getName = name.split("@")[0];
  const words = getName.replace(".", " ").split(" ");
  for (let i = 0; i < words.length; i++) {
    words[i] = words[i][0].toUpperCase() + words[i].substr(1);
  }

  return words.join(" ");
};

export const getInitials = (name) => {
  var names = name.split(" "),
    initials = names[0].substring(0, 1).toUpperCase();

  if (names.length > 1) {
    initials += names[names.length - 1].substring(0, 1).toUpperCase();
  }
  return initials;
};

export const checkChannelExisting = (data) => {
  return new Promise(async (resolve, reject) => {
    const userlink = [data.sender.email, data.recipient.email];
    fs.collection("conversations").doc();
    const senderDB = fs
      .collection("users")
      .doc(data.sender.email)
      .collection("channels");

    senderDB.onSnapshot((channel) => {
      let foundChannel = null;
      channel.forEach((ch) => {
        const chUsers = ch.data().users;
        let isFounded = chUsers.every((user) => userlink.includes(user.email));
        if (isFounded) foundChannel = ch.data();
      });
      resolve(foundChannel);
    });
  });
};

export const createNewChannel = async (data) => {
  const batch = fs.batch();
  const dataChannel = {
    channelID: "ch#" + Math.floor(Math.random() * Math.pow(10, 10)),
    created_at: new Date().getTime(),
    updated_at: new Date().getTime(),
    stat_change: new Date().getTime(),
    status: "active",
    users: [
      {
        id: data.sender.userID,
        email: data.sender.email,
        username: data.sender.userData.username
          ? data.sender.userData.username
          : SetNameFromEmail(data.sender.email),
      },
      {
        id: data.recipient.userID,
        email: data.recipient.email,
        username: data.recipient.userData.username
          ? data.recipient.userData.username
          : SetNameFromEmail(data.recipient.email),
      },
    ],
  };

  const dataForSender = { ...dataChannel, unread: 0 };
  const dataForRecipient = { ...dataChannel, unread: 1 };

  /** set channel on conversation collection */
  const conversation = fs
    .collection("conversations")
    .doc(dataChannel.channelID);
  batch.set(conversation, dataChannel);

  /** set sender channel subcollection */
  const userChannel = fs
    .collection("users")
    .doc(data.sender.email)
    .collection("channels")
    .doc(dataChannel.channelID);
  batch.set(userChannel, dataForSender);

  /** set recipient channel subcollection */
  const recipientChannel = fs
    .collection("users")
    .doc(data.recipient.email)
    .collection("channels")
    .doc(dataChannel.channelID);
  batch.set(recipientChannel, dataForRecipient);

  /** commit all batch */
  await batch.commit();
  return {
    status: true,
    message: "success create new channel",
    channelID: dataChannel.channelID,
  };
};