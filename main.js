import { db, collection, addDoc, getDocs, getDoc, deleteDoc, doc, updateDoc, serverTimestamp } from "./firebase.js";


const cloudName = "dukmizgzg";
const unSignedUploadPreSet = "esqdfaa1";

// DOM Elements
let submitBtn = document.getElementById("submitBtn");
let studentsContainer = document.getElementById("addData");
let profilePicture = document.getElementById("image");

// Function to fetch and display students
async function fetchStudents() {
    try {
        const querySnapshot = await getDocs(collection(db, "students"));

        // Clear the container
        studentsContainer.innerHTML = "";

        // Display each student's data
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const docId = doc.id;

            // Get the timestamp and format it
            const createdAt = data.createdAt ? data.createdAt.toDate() : null;
            const formattedTime = createdAt ? createdAt.toLocaleString() : "Not available";

            studentsContainer.innerHTML += `
            <div id="student-${docId}">
                <img src="${data.imageUrl}" alt="Profile picture" style="width: 100px; height: 100px; border-radius: 50%; object-fit: cover;">
                <h4>Name: ${data.name}</h4>
                <p>Age: ${data.age}</p>
                <p>Grade: ${data.grade}</p>
                <p>Added on: ${formattedTime}</p>
                <button data-id="${docId}" data-action="delete">Delete</button>
                <button data-id="${docId}" data-action="edit">Edit</button>
            </div>
        `;
        
        });
    } catch (error) {
        console.error("Error getting documents: ", error);
    }
}

// Function to delete a student by document ID
async function deleteStudentById(docId) {
    try {
        await deleteDoc(doc(db, "students", docId));
        console.log("Document deleted with ID: ", docId);

        // Refresh the list after deletion
        fetchStudents();
    } catch (error) {
        console.error("Error deleting document: ", error);
    }
}

// Function to update student data
async function updateStudent(docId, updatedData) {
    try {
        const studentRef = doc(db, "students", docId);
        await updateDoc(studentRef, updatedData);
        console.log("Document updated with ID: ", docId);

        // Refresh the list after update
        fetchStudents();
    } catch (error) {
        console.error("Error updating document: ", error);
    }
}

// Handle student form submission (add student)
submitBtn.addEventListener("click", async function () {
    let name = document.getElementById("name").value;
    let age = document.getElementById("age").value;
    let grade = document.getElementById("grade").value;

    const file = profilePicture.files[0];  
    if (file) {

      const url = `https://api.cloudinary.com/v1_1/${cloudName}/upload`
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', unSignedUploadPreSet);  
      formData.append('cloud_name', cloudName); 

      const uploadResponse = await fetch(url, {
        method: 'POST',
        body: formData
      });

      const uploadData = await uploadResponse.json();
      const imageUrl = uploadData.secure_url; 
    
      

      try {
        const docRef = await addDoc(collection(db, "students"), {
            name,
            age,
            grade,
            imageUrl,
            createdAt: serverTimestamp() // Timestamp when student is added
        });
        console.log("Document written with ID: ", docRef.id);

        // Refresh the list of students after adding
        fetchStudents();

        // Clear form fields
        document.getElementById("name").value = "";
        document.getElementById("age").value = "";
        document.getElementById("grade").value = "";
      } catch (e) {
        console.error("Error adding document: ", e);
      }
    } else {
        console.log("No file selected");
    }
});

// Event delegation for delete and edit buttons
studentsContainer.addEventListener("click", async (event) => {
    const docId = event.target.getAttribute("data-id"); // Extract the document ID
    const action = event.target.getAttribute("data-action"); // Determine the action (edit or delete)

    if (!docId || !action) {
        return; // If docId or action is missing, do nothing
    }

    if (action === "delete") {
        // Handle delete action
        await deleteStudentById(docId);
    } else if (action === "edit") {
        // Handle edit action
        try {
            const studentRef = doc(db, "students", docId);
            const studentDoc = await getDoc(studentRef);

            if (studentDoc.exists()) {
                const data = studentDoc.data();

                // Show SweetAlert modal for editing
                const { value: formValues } = await Swal.fire({
                    title: "Edit Student Details",
                    html: `
                        <input id="swal-name" class="swal2-input" placeholder="Name" value="${data.name}">
                        <input id="swal-age" class="swal2-input" placeholder="Age" value="${data.age}">
                        <input id="swal-grade" class="swal2-input" placeholder="Grade" value="${data.grade}">
                    `,
                    focusConfirm: false,
                    showCancelButton: true,
                    confirmButtonText: "Save",
                    cancelButtonText: "Cancel",
                    preConfirm: () => {
                        return {
                            name: document.getElementById("swal-name").value,
                            age: document.getElementById("swal-age").value,
                            grade: document.getElementById("swal-grade").value,
                        };
                    },
                });

                if (formValues) {
                    // Update Firestore with new values
                    await updateStudent(docId, formValues);
                }
            } else {
                console.error("No such document!");
            }
        } catch (error) {
            console.error("Error fetching document for editing: ", error);
        }
    }
});

// Initially fetch and display students
fetchStudents();
