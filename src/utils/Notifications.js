import firebase from '../firebase';

const messaging = firebase.messaging;

export const getFcmToken = async () => {
	Notification.requestPermission().catch((err) => console.log(err.code));
	try {
		const token = await messaging().getToken({
			vapidKey:
				'BB8AXcA2_kgmm-5XNEVYGvvVOgIy6fKZ12pA6sJMj43IyG3KZKYiutgJoEtBsTXwL5aeZeiRTqk9CZUwcmaJXOw',
		});
        console.log(token);
		return { message: 'success', token };
	} catch (err) {
		return { error: err.message || 'Invalid error', token: null };
	}
};
