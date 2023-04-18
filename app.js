const firebaseConfig = {
    apiKey: "AIzaSyCsKjEcyaPu6Wx7a9zqOPJscVHNkxeh9hM",
    authDomain: "devrev-8a26b.firebaseapp.com",
    databaseURL: "https://devrev-8a26b-default-rtdb.firebaseio.com",
    projectId: "devrev-8a26b",
    storageBucket: "devrev-8a26b.appspot.com",
    messagingSenderId: "224214643534",
    appId: "1:224214643534:web:99a61c6ab0b755a4b5e41f",
    measurementId: "G-5SV4Z2JP18"
};

firebase.initializeApp(firebaseConfig);
firebase.analytics();

const auth = firebase.auth()
const db = firebase.firestore()
const database = firebase.database()


const loginbtn = document.querySelector('#loguser')
const content = document.querySelector('.content')
const dashboard = document.querySelector('.dashboard')
const signupbtn = document.querySelector('#sign_btn')

const userDetails = id => {
    window.localStorage.setItem('currently_loggedIn', id)
    const docRef = db.collection('users').doc(id)
    docRef.get().then(doc => {
        const user = `${doc.data().userName}`
        if (user == "admin") {
            window.location.href = 'admin.html'
        } else {
            window.location.href = 'user.html'
        }


    }).catch(err => {
        console.log(`Error getting document : ${err}`)
    })
}


window.onload = () => {
    try {
        const currentUser = window.localStorage.getItem('currently_loggedIn')
        if (currentUser == null) {
            throw new Error('No Current User')
        } else {

            userDetails(currentUser)
        }


    } catch (err) {
        content.style.display = 'block'

    }




}
signupbtn.addEventListener('click', event => {
    event.preventDefault()
    document.getElementById("dis").style.display = 'none'

    const userName = document.querySelector('#user_data').value
    const email = document.querySelector('#user_mail').value
    const password = document.querySelector('#user_password').value
    auth.createUserWithEmailAndPassword(email, password).then(cred => {
        swal({
            title: 'Account Created Successfully',
            icon: 'success'
        }).then(() => {
            db.collection('users').doc(cred.user.uid).set({
                userName: userName,
                email: email
            }).then(() => {


                document.querySelector('#signin').reset()
                document.getElementById("dis").style.display = 'block'
                document.getElementById("signin").style.display = 'none';
                document.getElementById("login").style.display = 'block';

            }).catch(err => {
                swal({
                    title: err,
                    icon: 'error'
                }).then(() => {
                    document.getElementById("dis").style.display = 'block'

                })
            })
        })
    }).catch(err => {
        swal({
            title: err,
            icon: 'error'
        }).then(() => {
            document.getElementById("dis").style.display = 'block'
        })
    })
})

loginbtn.addEventListener('click', event => {
    event.preventDefault()
    loginbtn.style.display = 'none'
    const email = document.querySelector('#input_data').value
    const password = document.querySelector('#input_password').value
    auth.signInWithEmailAndPassword(email, password).then(cred => {

        loginbtn.style.display = 'block'
        document.querySelector('#login').reset()
        userDetails(cred.user.uid)

    }).catch(err => {
        swal({
            title: err,
            icon: 'error'
        }).then(() => {
            loginbtn.style.display = 'block'

        })
    })
})

// admin page