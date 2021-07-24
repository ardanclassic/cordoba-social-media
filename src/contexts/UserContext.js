import React, { useState, useEffect, useContext, createContext } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { storage, firestore as fs } from "firebaseConfig";
import { createNewChannel, checkChannelExisting } from "utils/helpers";
import { useAuth } from "contexts/AuthContext";
import moment from "moment";

const UserContext = createContext();
export function useUserContext() {
  return useContext(UserContext);
}

export const UserProvider = ({ children }) => {
  const history = useHistory();
  const location = useLocation();
  const { currentUser } = useAuth();
  const [people, setPeoples] = useState();
  const [loading, setLoading] = useState(true);
  // const [mounted, setMounted] = useState(false);

  useEffect(() => {
    let mounted = true;
    fs.collection("users")
      .orderBy("created_at")
      .onSnapshot((snap) => {
        let users = [];
        snap.forEach((doc) => {
          users.push(doc.data());
        });
        if (mounted) {
          setPeoples(users);
          setLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, [history, location]);

  const getLoginUser = () => {
    return new Promise(async (resolve, reject) => {
      if (people) {
        const loginuser = people.find((e) => e.email === currentUser.email);
        resolve(loginuser);
      }
    });
  };

  const getThisUser = (data) => {
    return new Promise(async (resolve, reject) => {
      if (people) {
        const thisuser = people.find((e) => e.email === data.email);
        resolve(thisuser);
      }
    });
  };

  const followActivity = (sender, recipient, type) => {
    return new Promise(async (resolve, reject) => {
      const senderDB = fs.collection("users").doc(sender.email);
      const recipientDB = fs.collection("users").doc(recipient.email);

      if (type === "follow") {
        let followcount = 0;
        recipientDB.get().then(async (rec) => {
          const dataFollowers = rec.data().userData.connections.followers;
          const newData = [...dataFollowers, sender];
          await recipientDB
            .update({ "userData.connections.followers": newData })
            .then(() => followcount++);
        });

        senderDB.get().then(async (rec) => {
          const dataFollowers = rec.data().userData.connections.followings;
          // senderFollowings.push(...dataFollowers, recipient);
          const newData = [...dataFollowers, recipient];
          await senderDB
            .update({ "userData.connections.followings": newData })
            .then(() => followcount++);
        });
        if (followcount === 2) resolve("success follow");
      } else {
        let unfollowcount = 0;
        recipientDB.get().then(async (rec) => {
          const dataFollowers = rec.data().userData.connections.followers;
          const filtered = dataFollowers.filter(
            (e) => e.email !== sender.email
          );
          await recipientDB
            .update({ "userData.connections.followers": filtered })
            .then(() => unfollowcount++);
        });
        senderDB.get().then(async (rec) => {
          const dataFollowers = rec.data().userData.connections.followings;
          const filtered = dataFollowers.filter(
            (e) => e.email !== recipient.email
          );
          await senderDB
            .update({ "userData.connections.followings": filtered })
            .then(() => unfollowcount++);
        });
        if (unfollowcount === 2) resolve("success unfollow");
      }
    });
  };

  const updateProfile = (data) => {
    return new Promise(async (resolve, reject) => {
      const userDB = fs.collection("users").doc(data.email);
      const promName = await userDB.update({
        "userData.username": data.username,
      });
      const promPassion = await userDB.update({
        "userData.passion": data.passion,
      });
      const promGender = await userDB.update({
        "userData.gender": data.gender,
      });
      const promPhotoProfile = await userDB.update({
        "userData.photoProfile": data.photoProfile,
      });

      Promise.all([promName, promPassion, promGender, promPhotoProfile]).then(
        () => {
          resolve({ status: true, message: value });
        }
      );
    });
  };

  /** ------------------------ CHATTING SYSTEM ------------------------ */

  const sendMessage = (data) => {
    return new Promise(async (resolve, reject) => {
      const roomID = "room#" + Math.floor(Math.random() * Math.pow(10, 10));
      const chatData = {
        roomID: roomID,
        message: data.message,
        sender: data.sender.email,
        recipient: data.recipient.email,
        created_at: new Date().getTime(),
        updated_at: new Date().getTime(),
        stat_change: new Date().getTime(),
        status: "unread",
      };

      /** checking channel is already exist or not */
      checkChannelExisting(data).then(async (channelExist) => {
        if (channelExist) {
          const message = {
            ...chatData,
            channelID: channelExist.channelID,
          };

          /** update channel data on sender */
          fs.collection("users")
            .doc(data.sender.email)
            .collection("channels")
            .doc(channelExist.channelID)
            .update({
              updated_at: new Date().getTime(),
            });

          /** update channel data on recipient */
          fs.collection("users")
            .doc(data.recipient.email)
            .collection("channels")
            .doc(channelExist.channelID)
            .update({
              updated_at: new Date().getTime(),
            });

          /** post data chat to firestore */
          await fs
            .collection("conversations")
            .doc(channelExist.channelID)
            .collection("chatroom")
            .doc(roomID)
            .set(message);

          resolve("update");
        } else {
          /** if channel not exist then create & setup new channel in 3 different places */
          await createNewChannel(data).then((create) => {
            if (create.status) {
              const message = {
                ...chatData,
                channelID: create.channelID,
              };
              /** post data chat to firestore */
              fs.collection("conversations")
                .doc(create.channelID)
                .collection("chatroom")
                .doc(roomID)
                .set(message);

              resolve("create");
            }
          });
        }
      });
    });
  };

  const readChat = (data) => {
    return new Promise(async (resolve, reject) => {
      if (data.type === "first-phase") {
        if (data.sender && data.recipient) {
          /** get channel */
          checkChannelExisting(data)
            .then((channel) => {
              /** get chatroom */
              const collect = fs
                .collection("conversations")
                .doc(channel.channelID)
                .collection("chatroom")
                .orderBy("created_at", "desc")
                .limit(data.latestChat);

              resolve(collect);
            })
            .catch((err) => {
              reject(null);
            });
        }
      } else {
        if (data.snap) {
          /** prepare & collect all chats from chatroom */
          const dialogs = [];
          data.snap.forEach((chat) => {
            const chatData = {
              channelID: chat.data().channelID,
              roomID: chat.data().roomID,
              message: chat.data().message,
              updated_at: chat.data().updated_at,
              created_at: moment(chat.data().created_at).format("dddd, D MMMM"),
              timeCreated: moment(chat.data().created_at).format("h:mm A"),
              timeDivider: moment(chat.data().created_at).fromNow(),
              sender: chat.data().sender,
              recipient: chat.data().recipient,
              stat_change: chat.data().stat_change,
              status: chat.data().status,
            };
            dialogs.push(chatData);
          });

          const groupBy = (array, key) => {
            // Return the reduced array
            return array.reduce((result, currentItem) => {
              // If an array already present for key, push it to the array. Otherwise create an array and push the object.
              (result[currentItem[key]] = result[currentItem[key]] || []).push(
                currentItem
              );
              // return the current iteration `result` value, this will be the next iteration's `result` value and accumulate
              return result;
            }, {}); // Empty object is the initial value for result object
          };

          dialogs.reverse();
          const groupByDay = Object.values(groupBy(dialogs, "created_at"));
          resolve(groupByDay);
        } else {
          reject(null);
        }
      }
    });
  };

  const getChannels = (data) => {
    return new Promise(async (resolve, reject) => {
      if (data.type === "first-phase") {
        const collect = fs
          .collection("users")
          .doc(data.sender.email)
          .collection("channels")
          .orderBy("updated_at", "desc")
          .limit(200);

        resolve(collect);
      } else {
        if (data.snap) {
          const channels = [];
          data.snap.forEach((doc) => {
            const dataChannel = {
              ...doc.data(),
              updated_at: moment(doc.data().updated_at).fromNow(),
            };
            channels.push(dataChannel);
          });
          resolve(channels);
        }
      }
    });
  };

  const setSenderTypingStatus = (data) => {
    return new Promise(async (resolve, reject) => {
      /** get channel */
      checkChannelExisting(data).then((channel) => {
        if (channel) {
          if (data.status) {
            fs.collection("conversations")
              .doc(channel.channelID)
              .update({
                typing: {
                  email: data.sender.email,
                  userID: data.sender.userID,
                  username: data.sender.userData.username,
                },
              });
          } else {
            fs.collection("conversations").doc(channel.channelID).update({
              typing: null,
            });
          }
        }
      });
    });
  };

  const checkTypingStatus = (data) => {
    return new Promise(async (resolve, reject) => {
      /** get channel */
      checkChannelExisting(data).then((channel) => {
        if (channel) {
          const collect = fs.collection("conversations").doc(channel.channelID);
          resolve(collect);
        }
      });
    });
  };

  const deleteChannel = async (data) => {
    return new Promise(async (resolve, reject) => {
      /** delete all chats related to channels in conversation */
      const chatroom = fs
        .collection("conversations")
        .doc(data.channelID)
        .collection("chatroom");
      await chatroom.get().then((query) => {
        query.forEach((chat) => chatroom.doc(chat.data().roomID).delete());
      });

      /** delete channel in conversation */
      await fs.collection("conversations").doc(data.channelID).delete();

      /** delete channel in each related user */
      await data.users.forEach((user) => {
        fs.collection("users")
          .doc(user.email)
          .collection("channels")
          .doc(data.channelID)
          .delete();
      });

      resolve("delete success!");
    });
  };

  const deleteChat = (data) => {
    return new Promise(async (resolve, reject) => {
      fs.collection("conversations")
        .doc(data.channelID)
        .collection("chatroom")
        .doc(data.roomID)
        .delete();

      resolve("success delete");
    });
  };

  /** ------------------------ POST SYSTEM ------------------------ */

  const postNewContent = (data) => {
    return new Promise(async (resolve, reject) => {
      const collect = fs.collection("posts").doc(data.contentID);
      const datapost = {
        ...data,
        contentID: data.contentID,
        content: data.content,
        created_at: new Date().getTime(),
        updated_at: new Date().getTime(),
      };

      if (data.image) {
        const fileRef = storage.child(
          `user-contents/${data.email}/${data.imageName}`
        );
        fileRef.put(data.image).then(async () => {
          const imageURL = await fileRef.getDownloadURL();
          data.image = imageURL;
          collect
            .set({
              ...datapost,
              image: data.image,
            })
            .then(() => {
              resolve({
                success: true,
                message: "success post content with image!",
              });
            });
        });
      } else {
        collect
          .set({
            ...datapost,
            image: null,
          })
          .then(() => {
            resolve({ success: true, message: "success post content." });
          });
      }
    });
  };

  const updateContentPost = (data) => {
    return new Promise(async (resolve, reject) => {
      const collect = fs.collection("posts").doc(data.contentID);
      const dataUpdate = {
        ...data,
        updated_at: new Date().getTime(),
      };
      // console.log(dataUpdate);

      if (data.image) {
        if (data.oldImageName) {
          const filepath = storage.child(
            `user-contents/${data.email}/${data.oldImageName}`
          );
          await filepath.delete();
        }

        const fileUpdateImage = storage.child(
          `user-contents/${data.email}/${data.imageName}`
        );
        fileUpdateImage.put(data.image).then(async () => {
          const imageURL = await fileUpdateImage.getDownloadURL();
          data.image = imageURL;
          collect
            .set({
              ...dataUpdate,
              image: data.image,
            })
            .then(() => {
              resolve({
                success: true,
                message: "success update content with image!",
              });
            });
        });
      } else {
        collect
          .set({
            ...dataUpdate,
            image: data.oldImage,
            imageName: data.oldImageName,
          })
          .then(() => {
            resolve({ success: true, message: "success update content." });
          });
      }
    });
  };

  const getUserPostContent = (data) => {
    return new Promise(async (resolve, reject) => {
      const collect = fs.collection("posts").where("email", "==", data.email);
      resolve(collect);
    });
  };

  const getAllPostData = (data) => {
    return new Promise(async (resolve, reject) => {
      resolve(fs.collection("posts").where("email", "==", data.email));
    });
  };

  const deletePost = (data) => {
    return new Promise(async (resolve, reject) => {
      const collect = fs.collection("posts").doc(data.post.contentID);

      /** delete all likes related to post */
      const likes = collect.collection("likes");
      await likes.get().then((query) => {
        query.forEach((like) => likes.doc(like.data().sender).delete());
      });

      /** delete all comments related to post */
      const comments = collect.collection("comments");
      await comments.get().then((query) => {
        query.forEach((comment) =>
          comments.doc(comment.data().commentID).delete()
        );
      });

      if (data.post.image) {
        const filepath = storage.child(
          `user-contents/${data.user.email}/${data.post.imageName}`
        );
        filepath
          .delete()
          .then(() => {
            collect
              .delete()
              .then(() => {
                resolve({ status: true, message: "success delete post!" });
              })
              .catch((error) => {
                reject(error);
              });
          })
          .catch((error) => {
            reject(error);
          });
      } else {
        collect
          .delete()
          .then(() => {
            resolve({ status: true, message: "success delete post!" });
          })
          .catch((error) => {
            reject(error);
          });
      }
    });
  };

  const sendComment = (data) => {
    return new Promise(async (resolve, reject) => {
      const commentID = `comment#${new Date().getTime()}`;
      const collect = fs
        .collection("posts")
        .doc(data.post.contentID)
        .collection("comments")
        .doc(commentID);

      collect
        .set({
          commentID,
          comment: data.message,
          postID: data.post.contentID,
          postOwner: data.recipient.email,
          sender: data.sender.email,
          senderID: data.sender.userID,
          senderName: data.sender.userData.username,
          senderImage: data.sender.userData.photoProfile
            ? data.sender.userData.photoProfile
            : null,
          senderGender: data.sender.userData.gender,
          created_at: new Date().getTime(),
        })
        .then(() => {
          resolve({ status: true, message: "sending comment success!" });
        });
    });
  };

  const getComments = (data) => {
    return new Promise(async (resolve, reject) => {
      if (data.type === "first-phase") {
        const collect = fs
          .collection("posts")
          .doc(data.post.contentID)
          .collection("comments")
          .orderBy("created_at", "asc");

        resolve(collect);
      } else {
        if (data.snap) {
          const comments = [];
          data.snap.forEach((doc) => {
            const dataComment = {
              ...doc.data(),
              hoursDuration: moment().diff(
                moment(doc.data().created_at),
                "hours"
              ),
              daysDuration: moment().diff(
                moment(doc.data().created_at),
                "days"
              ),
              created_at: moment(doc.data().created_at).format("LL"),
              timeFormat: moment(doc.data().created_at).format("hh:mm A"),
              fromNow: moment(doc.data().created_at).fromNow(),
            };
            comments.push(dataComment);
          });
          resolve(comments);
        }
      }
    });
  };

  const updateComments = (data) => {
    return new Promise(async (resolve, reject) => {
      fs.collection("posts")
        .doc(data.postID)
        .collection("comments")
        .doc(data.commentID)
        .update({
          comment: data.comment,
        })
        .then(() => {
          resolve({ status: true, message: "success update comment!" });
        });
    });
  };

  const getTotalComments = (data) => {
    return new Promise(async (resolve, reject) => {
      const collect = fs
        .collection("posts")
        .doc(data.post.contentID)
        .collection("comments");

      resolve(collect);
    });
  };

  const deleteComment = (data) => {
    return new Promise(async (resolve, reject) => {
      await fs
        .collection("posts")
        .doc(data.postID)
        .collection("comments")
        .doc(data.commentID)
        .delete();

      resolve({ success: true, message: "success delete comment." });
    });
  };

  const sendLike = (data) => {
    return new Promise(async (resolve, reject) => {
      const collect = fs
        .collection("posts")
        .doc(data.postID)
        .collection("likes")
        .doc(data.sender);

      collect.set(data).then(() => {
        resolve({ status: true, message: "sending like success!" });
      });
    });
  };

  const sendUnlike = (data) => {
    return new Promise(async (resolve, reject) => {
      const collect = fs
        .collection("posts")
        .doc(data.postID)
        .collection("likes")
        .doc(data.sender);

      collect.delete().then(() => {
        resolve({ status: true, message: "sending unlike success!" });
      });
    });
  };

  const checkPostLike = (data) => {
    return new Promise(async (resolve, reject) => {
      const collect = fs
        .collection("posts")
        .doc(data.postID)
        .collection("likes")
        .doc(data.sender);

      resolve(collect);
    });
  };

  const getDataLikes = (data) => {
    return new Promise(async (resolve, reject) => {
      const collect = fs
        .collection("posts")
        .doc(data.post.contentID)
        .collection("likes");

      resolve(collect);
    });
  };

  const value = {
    people,
    getLoginUser,
    getThisUser,
    followActivity,
    updateProfile,
    sendMessage,
    readChat,
    setSenderTypingStatus,
    checkTypingStatus,
    deleteChat,
    getChannels,
    deleteChannel,
    postNewContent,
    updateContentPost,
    getUserPostContent,
    deletePost,
    sendComment,
    updateComments,
    getComments,
    getTotalComments,
    deleteComment,
    sendLike,
    sendUnlike,
    checkPostLike,
    getDataLikes,
    getAllPostData,
  };

  return (
    <UserContext.Provider value={value}>
      {!loading && children}
    </UserContext.Provider>
  );
};
