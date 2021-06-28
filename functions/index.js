const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();
const db = admin.firestore();
const messaging = admin.messaging();

exports.addTransaction = functions.firestore
  .document("users/{userID}/customers/{custID}/transactions/{transID}")
  .onWrite(async (change, context) => {
    const customerName = await db
      .collection("users")
      .doc(context.params.userID)
      .collection("customers")
      .doc(context.params.custID)
      .get()
      .then((doc) => doc.data().name);

    // Add Transaction in customer's account
    db.collection("users")
      .doc(context.params.custID)
      .collection("customers")
      .doc(context.params.userID)
      .collection("transactions")
      .doc(change.after.id)
      .set({ ...change.after.data(), amount: -1 * change.after.data().amount });

    // Update Sent/Received and customer's balance in user's account
    db.collection("users")
      .doc(context.params.userID)
      .update(
        change.after.data().amount >= 0
          ? {
              received: admin.firestore.FieldValue.increment(
                change.after.data().amount
              ),
            }
          : {
              sent: admin.firestore.FieldValue.increment(
                Math.abs(change.after.data().amount)
              ),
            }
      );
    db.collection("users")
      .doc(context.params.userID)
      .collection("customers")
      .doc(context.params.custID)
      .update({
        balance: admin.firestore.FieldValue.increment(
          change.after.data().amount
        ),
      });

    // Sent Transaction notification to customer
    const payload = {
      notification: {
        title: "Transaction Added",
        body: `Your transaction with ${customerName} was added.`,
        icon:
          "https://firebasestorage.googleapis.com/v0/b/bahi-book.appspot.com/o/icon.png?alt=media&token=13344b24-3410-4047-957a-e6447432c4e7",
      },
    };
    const fcmTokens = await db
      .collection("users")
      .doc(context.params.custID)
      .get()
      .then((doc) => doc.data().fcmTokens);

    if (!fcmTokens || !fcmTokens.length) {
      return console.log("There are no notification tokens to send to.");
    }

    try {
      const response = await messaging.sendToDevice(fcmTokens, payload);

      response.results.forEach((result, index) => {
        const error = result.error;
        if (error) {
          console.error(
            "Failure sending notification to",
            fcmTokens[index],
            error
          );
          // Cleanup the tokens who are not registered anymore.
          if (
            error.code === "messaging/invalid-registration-token" ||
            error.code === "messaging/registration-token-not-registered"
          ) {
            db.collection("users")
              .doc(context.params.userID)
              .update({
                fcmTokens: admin.firestore.FieldValue.arrayRemove(
                  fcmTokens[index]
                ),
              });
          }
        }
      });
    } catch (error) {
      console.log("Error occurred while sending notifications");
    }
  });

exports.addCustomer = functions.firestore
  .document("users/{userID}/customers/{custID}")
  .onCreate(async (change, context) => {
    const customerName = change.data().name;

    // Add user's document in customer's customers collection
    db.doc(`users/${context.params.custID}/customers/${context.params.userID}`)
      .get()
      .then(async (doc) => {
        if (!doc.exists) {
          const userName = await db
            .doc(`users/${context.params.userID}`)
            .get()
            .then((doc) => doc.data().name);
          db.doc(`users/${context.params.custID}`)
            .set({}, { merge: true })
            .catch((err) => console.log(err.message));
          db.doc(
            `users/${context.params.custID}/customers/${context.params.userID}`
          )
            .set({ name: userName, balance: 0 })
            .catch((err) => console.log(err.message));
        }
      });

    const payload = {
      notification: {
        title: "Customer Added",
        body: `${customerName} was added as your customer.`,
        icon:
          "https://firebasestorage.googleapis.com/v0/b/bahi-book.appspot.com/o/icon.png?alt=media&token=13344b24-3410-4047-957a-e6447432c4e7",
      },
    };
    const fcmTokens = await db
      .collection("users")
      .doc(context.params.userID)
      .get()
      .then((doc) => doc.data().fcmTokens);

    if (!fcmTokens || !fcmTokens.length) {
      return console.log("There are no notification tokens to send to.");
    }

    try {
      const response = await messaging.sendToDevice(fcmTokens, payload);

      response.results.forEach((result, index) => {
        const error = result.error;
        if (error) {
          console.error(
            "Failure sending notification to",
            fcmTokens[index],
            error
          );
          // Cleanup the tokens who are not registered anymore.
          if (
            error.code === "messaging/invalid-registration-token" ||
            error.code === "messaging/registration-token-not-registered"
          ) {
            db.collection("users")
              .doc(context.params.userID)
              .update({
                fcmTokens: admin.firestore.FieldValue.arrayRemove(
                  fcmTokens[index]
                ),
              });
          }
        }
      });
    } catch (error) {
      console.log("Error occurred while sending notifications");
    }
  });
