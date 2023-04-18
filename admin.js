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
const dbRef = firebase.database().ref();


document.getElementById("Add").addEventListener('click', event => {
    event.preventDefault()
    document.getElementById("dis").style.display = 'none'
    let length = 0;
    const dbRef = firebase.database().ref();
    dbRef.child("centre").get().then((snapshot) => {
        if (snapshot.exists()) {
            let sydat = snapshot.val();
            length = sydat.v + 1;
        }
    }).then(() => {
        database.ref("centre").child("c" + length).set({
            name: document.getElementById("vname").value,
            mobile: document.getElementById("vmobile").value,
            open_time: document.getElementById("vot").value,
            close_time: document.getElementById("vct").value,

        }).then(() => {
            database.ref("centre").update({
                v: length
            })
            swal({
                title: 'Centre Add successfully',
                icon: 'success'
            }).then(() => {
                document.querySelector('#addvf').reset()
                document.getElementById("dis").style.display = 'block'
            })
        })
    })


})

document.getElementById("addbtn").addEventListener('click', event => {
    document.getElementById("display").style.display = 'none';
    document.getElementById("addpage").style.display = 'block';
})

document.getElementById("Back").addEventListener('click', event => {
    document.getElementById("centre_list").innerHTML = "";
    display();
    document.getElementById("display").style.display = 'block';
    document.getElementById("addpage").style.display = 'none';
})

function display() {
    document.getElementById("centre_list").innerHTML = "";
    let l = 0;

    dbRef.child("centre").get().then((snapshot) => {
        if (snapshot.exists()) {
            let sydat = snapshot.val();
            l = sydat.v + 1;
            console.log(l)
        }
    }).then(() => {
        for (let i = 1; i < l; i++) {
            dbRef.child("centre").child("c" + i).get().then((snapshot) => {
                let sydat = snapshot.val();
                let name = sydat.name;
                let mobile = sydat.mobile;
                let otime = sydat.open_time;
                let ctime = sydat.close_time;
                const msgHTML = `
               <tr>
               <td>${name}</td>
              <td>${mobile}</td>
              <td>${otime}-${ctime}</td>
              <td><button class="btncheck" name="btn" onclick="editc(${i})">Edit</button></td>
              <td><button class="btncheck" name="btn" onclick="deletec(${i})">Delete</button></td>
           </tr>
             `;
                document.getElementById("centre_list").insertAdjacentHTML("beforeend", msgHTML);
            }).catch((err) => {
                console.log(err)
            })
        }
    })
}
// display the centre in table
window.onload = () => {

    display();
}

function editc(id) {

    document.getElementById("display").style.display = 'none'
    document.getElementById("editpage").style.display = 'block'
    dbRef.child("centre").child("c" + id).get().then((snapshot) => {
        let sydat = snapshot.val();
        console.log(sydat)
        let name = sydat.name;
        let mobile = sydat.mobile;
        let otime = sydat.open_time;
        let ctime = sydat.close_time;

        document.getElementById("id").value = id
        document.getElementById("ename").value = name
        document.getElementById("emobile").value = mobile
        document.getElementById("eot").value = otime
        document.getElementById("ect").value = ctime

    })
}

document.getElementById('eAdd').addEventListener('click', event => {
    event.preventDefault();
    document.getElementById("dis").style.display = 'none'
    const id = document.getElementById('id').value
    console.log(id)
    database.ref("centre").child("c" + id).set({
        name: document.getElementById("ename").value,
        mobile: document.getElementById("emobile").value,
        open_time: document.getElementById("eot").value,
        close_time: document.getElementById("ect").value,

    }).then(() => {
        swal({
            title: 'Data updated successfully',
            icon: 'success'
        })
        document.querySelector('#editvf').reset()
        document.getElementById("dis").style.display = 'block'
        document.getElementById("editpage").style.display = 'none'
        document.getElementById("centre_list").innerHTML = "";
        display();
        document.getElementById("display").style.display = 'block'

    })
})

function deletec(id) {

    dbRef.child("centre").child("c" + id).remove().then((snapshot) => {
        document.getElementById("centre_list").innerHTML = "";
        display();
    })
}

function logout() {
    window.localStorage.removeItem('currently_loggedIn')
    window.location.href = 'index.html'
}