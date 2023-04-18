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

window.onload = () => {

    let hl=0;
    dbRef.child("centre").get().then((snapshot) => { 
            if (snapshot.exists()) {
                let sydat = snapshot.val();
                hl=sydat.v;
            }
        }).then(()=>{
    for(let i=1;i<=hl;i++)
            {
                dbRef.child("centre").child("c"+i).get().then((snapshot) => { 
                    let sydat = snapshot.val();
                     let hname=sydat.name;
                     const msgHTML = `
                     <option value="c${i}">${hname}</option>
                   `;
                     document.getElementById("vcname").insertAdjacentHTML("beforeend", msgHTML);
                })
            }
        })
}

document.getElementById("bookv").addEventListener('click',event=>{
    event.preventDefault();
    document.getElementById("bookv").style.display='none'
    let pname=document.getElementById('pname').value;
    let pdob=document.getElementById('pdob').value;
    let vcname=document.getElementById('vcname').value;
    let pmobile=document.getElementById('pmobile').value;
    let vfdate=document.getElementById('vfdate').value;
    console.log(vfdate)
    let p=0

    dbRef.child("centre").child(vcname).child(vfdate).get().then((snapshot) => { 
        if (snapshot.exists()) {
            let sydat = snapshot.val();
            p=sydat.v+1;
            console.log(p)
        }
       
    }).then(()=>{
        if(p<11)
        {
            database.ref("centre").child(vcname).child(vfdate).child("p"+p).update({
                name:pname,
                mobile:pmobile,
                date_of_birth:pdob
        
            }).then(()=>{
                database.ref("centre").child(vcname).child(vfdate).update({
                    v:p
                })
            }).then(()=>{
                swal({
                    title:'Vaccination centre booked successfully',
                    icon:'success'
                }).then(()=>{
                    document.getElementById("addvf").reset()
                    document.getElementById("bookv").style.display='block'
                })
            }).catch((err)=>{
                console.log(err)
                document.getElementById("bookv").style.display='block'
            })
        }
        else
        {
            console.log(vfdate)
            console.log(p)
            swal({
                title:'the slat of your selected centre is completed, so please selected any other centre',
                icon:'warning'
            })
            document.getElementById("bookv").style.display='block'
        }

    }).catch(()=>{
        database.ref("centre").child(vcname).child(vfdate).child("p1").update({
            name:pname,
            mobile:pmobile,
            date_of_birth:pdob
    
        }).then(()=>{
            database.ref("centre").child(vcname).child(vfdate).update({
                v:1
            })
        }).then(()=>{
            swal({
                title:'Vaccination centre booked successfully',
                icon:'success'
            })
            document.getElementById("bookv").style.display='block'
        }).catch((err)=>{
            console.log(err)
            document.getElementById("bookv").style.display='block'
        })
    })

   

})

function logout() {
    window.localStorage.removeItem('currently_loggedIn')
    window.location.href = 'index.html'
}