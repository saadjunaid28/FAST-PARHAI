// Profile Page JavaScript

document.addEventListener("DOMContentLoaded", () => {
    // Initialize sidebar toggle
    initSidebar()
  
    // Load user data from localStorage (in a real app, this would come from an API)
    const userData = JSON.parse(localStorage.getItem("user")) || {
      name: "Ahmed Khan",
      email: "ahmed.khan@nu.edu.pk",
      semester: "6",
      avatar: "images/default-avatar.png",
    }
  
    // Update user information in the UI
    updateUserInfo(userData)
  
    // Tab switching functionality
    const tabButtons = document.querySelectorAll(".tab-btn")
    const tabContents = document.querySelectorAll(".tab-content")
  
    tabButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const tabId = button.getAttribute("data-tab")
  
        // Remove active class from all buttons and contents
        tabButtons.forEach((btn) => btn.classList.remove("active"))
        tabContents.forEach((content) => content.classList.remove("active"))
  
        // Add active class to clicked button and corresponding content
        button.classList.add("active")
        document.getElementById(tabId).classList.add("active")
      })
    })
  
    // Profile picture upload
    const profilePicUpload = document.getElementById("profile-pic-upload")
    if (profilePicUpload) {
      profilePicUpload.addEventListener("change", function () {
        const file = this.files[0]
  
        if (file) {
          // Validate file type
          const fileType = file.type
          if (fileType !== "image/jpeg" && fileType !== "image/png") {
            alert("Please select a JPG or PNG image")
            return
          }
  
          // Validate file size (max 2MB)
          if (file.size > 2 * 1024 * 1024) {
            alert("Image size should not exceed 2MB")
            return
          }
  
          // Show preview
          const reader = new FileReader()
          reader.onload = (e) => {
            const profileAvatarImg = document.getElementById("profile-avatar-img")
            const sidebarAvatar = document.getElementById("sidebar-avatar")
  
            if (profileAvatarImg) {
              profileAvatarImg.src = e.target.result
            }
  
            if (sidebarAvatar) {
              sidebarAvatar.src = e.target.result
            }
  
            // Update in localStorage (in a real app, this would be uploaded to a server)
            userData.avatar = e.target.result
            localStorage.setItem("user", JSON.stringify(userData))
          }
          reader.readAsDataURL(file)
        }
      })
    }
  
    // Edit profile button
    const editProfileBtn = document.getElementById("edit-profile-btn")
    if (editProfileBtn) {
      editProfileBtn.addEventListener("click", () => {
        // Switch to account settings tab
        tabButtons.forEach((btn) => btn.classList.remove("active"))
        tabContents.forEach((content) => content.classList.remove("active"))
  
        document.querySelector('[data-tab="account-settings"]').classList.add("active")
        document.getElementById("account-settings").classList.add("active")
  
        // Scroll to the form
        document.getElementById("account-settings").scrollIntoView({ behavior: "smooth" })
      })
    }
  
    // Profile form submission
    const profileForm = document.getElementById("profile-form")
    if (profileForm) {
      profileForm.addEventListener("submit", (e) => {
        e.preventDefault()
  
        // Get form data
        const name = document.getElementById("name").value
        const semester = document.getElementById("semester").value
        const darkMode = document.getElementById("dark_mode").checked
        const emailNotifications = document.getElementById("email_notifications").checked
  
        // Validate name (only alphabets, min 3 characters)
        if (!name.trim()) {
          showFormError("name", "Name is required")
          return
        } else if (name.length < 3) {
          showFormError("name", "Name must be at least 3 characters")
          return
        } else if (!/^[a-zA-Z\s]+$/.test(name)) {
          showFormError("name", "Name must contain only alphabets")
          return
        } else {
          clearFormError("name")
        }
  
        // Check if password fields are filled
        const currentPassword = document.getElementById("current_password").value
        const newPassword = document.getElementById("new_password").value
        const confirmPassword = document.getElementById("confirm_password").value
  
        if (currentPassword || newPassword || confirmPassword) {
          // Validate current password (in a real app, this would be verified with the server)
          if (!currentPassword) {
            showFormError("current_password", "Current password is required")
            return
          } else {
            clearFormError("current_password")
          }
  
          // Validate new password
          if (!newPassword) {
            showFormError("new_password", "New password is required")
            return
          } else if (newPassword.length < 8) {
            showFormError("new_password", "Password must be at least 8 characters")
            return
          } else if (!/[a-zA-Z]/.test(newPassword)) {
            showFormError("new_password", "Password must include at least one letter")
            return
          } else if (!/[0-9]/.test(newPassword)) {
            showFormError("new_password", "Password must include at least one number")
            return
          } else if (!/[^a-zA-Z0-9]/.test(newPassword)) {
            showFormError("new_password", "Password must include at least one special character")
            return
          } else {
            clearFormError("new_password")
          }
  
          // Validate confirm password
          if (!confirmPassword) {
            showFormError("confirm_password", "Please confirm your password")
            return
          } else if (confirmPassword !== newPassword) {
            showFormError("confirm_password", "Passwords do not match")
            return
          } else {
            clearFormError("confirm_password")
          }
        }
  
        // If validation passes, save changes
        saveProfileChanges({
          name,
          semester,
          darkMode,
          emailNotifications,
        })
      })
    }
  
    // Helper function to show form errors
    function showFormError(fieldId, message) {
      const field = document.getElementById(fieldId)
      const errorElement = document.createElement("div")
      errorElement.className = "error-message"
      errorElement.textContent = message
  
      // Remove any existing error message
      const existingError = field.parentElement.querySelector(".error-message")
      if (existingError) {
        existingError.remove()
      }
  
      // Add error class to field and append error message
      field.classList.add("error")
      field.parentElement.appendChild(errorElement)
    }
  
    // Helper function to clear form errors
    function clearFormError(fieldId) {
      const field = document.getElementById(fieldId)
      const existingError = field.parentElement.querySelector(".error-message")
  
      if (existingError) {
        existingError.remove()
      }
  
      field.classList.remove("error")
    }
  
    // Save profile changes
    function saveProfileChanges(data) {
      // Show loading state
      const submitButton = document.querySelector('#profile-form button[type="submit"]')
      const originalText = submitButton.textContent
      submitButton.disabled = true
      submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...'
  
      // Simulate API call delay
      setTimeout(() => {
        // Update user data in localStorage
        userData.name = data.name
        userData.semester = data.semester
        localStorage.setItem("user", JSON.stringify(userData))
  
        // Apply dark mode if selected
        if (data.darkMode) {
          document.body.classList.add("dark-mode")
          localStorage.setItem("theme", "dark")
          updateThemeIcons(true)
        } else {
          document.body.classList.remove("dark-mode")
          localStorage.setItem("theme", "light")
          updateThemeIcons(false)
        }
  
        // Update UI
        updateUserInfo(userData)
  
        // Show success message
        submitButton.innerHTML = '<i class="fas fa-check"></i> Saved!'
  
        // Reset button after a delay
        setTimeout(() => {
          submitButton.disabled = false
          submitButton.textContent = originalText
        }, 2000)
      }, 1500)
    }
  
    // Update user information in the UI
    function updateUserInfo(userData) {
      // Update profile header
      const profileName = document.getElementById("profile-name")
      const profileEmail = document.querySelector(".profile-email")
      const profileSemester = document.querySelector(".profile-semester")
  
      if (profileName) profileName.textContent = userData.name
      if (profileEmail) profileEmail.textContent = userData.email
      if (profileSemester) profileSemester.textContent = `${userData.semester}th Semester - Computer Science`
  
      // Update sidebar user info
      const sidebarUserName = document.getElementById("userName")
      if (sidebarUserName) sidebarUserName.textContent = userData.name
  
      // Update form fields
      const nameField = document.getElementById("name")
      const emailField = document.getElementById("email")
      const semesterField = document.getElementById("semester")
  
      if (nameField) nameField.value = userData.name
      if (emailField) emailField.value = userData.email
      if (semesterField) semesterField.value = userData.semester
    }
  
    // Initialize sidebar functionality
    function initSidebar() {
      const sidebarToggle = document.getElementById("sidebarToggle")
      const menuToggle = document.getElementById("menuToggle")
      const sidebar = document.querySelector(".sidebar")
      const mainContent = document.querySelector(".main-content")
  
      // Check if sidebar state is saved in localStorage
      const sidebarCollapsed = localStorage.getItem("sidebarCollapsed") === "true"
  
      if (sidebarCollapsed) {
        sidebar.classList.add("collapsed")
        mainContent.classList.add("expanded")
        if (sidebarToggle) {
          sidebarToggle.innerHTML = '<i class="fas fa-chevron-right"></i>'
        }
      }
  
      // Sidebar toggle button click event
      if (sidebarToggle) {
        sidebarToggle.addEventListener("click", toggleSidebar)
      }
  
      // Menu toggle button click event
      if (menuToggle) {
        menuToggle.addEventListener("click", toggleSidebar)
      }
  
      function toggleSidebar() {
        sidebar.classList.toggle("collapsed")
        mainContent.classList.toggle("expanded")
  
        const isCollapsed = sidebar.classList.contains("collapsed")
  
        // Update toggle button icon
        if (sidebarToggle) {
          sidebarToggle.innerHTML = isCollapsed
            ? '<i class="fas fa-chevron-right"></i>'
            : '<i class="fas fa-chevron-left"></i>'
        }
  
        // Save state to localStorage
        localStorage.setItem("sidebarCollapsed", isCollapsed)
      }
  
      // Close sidebar when clicking outside on mobile
      document.addEventListener("click", (event) => {
        const isMobile = window.innerWidth < 992
        if (
          isMobile &&
          !sidebar.contains(event.target) &&
          !menuToggle.contains(event.target) &&
          sidebar.classList.contains("active")
        ) {
          sidebar.classList.remove("active")
        }
      })
    }
  
    // Edit note functionality
    const editNoteButtons = document.querySelectorAll(".edit-note")
    if (editNoteButtons.length > 0) {
      editNoteButtons.forEach((button) => {
        button.addEventListener("click", function () {
          const noteId = this.getAttribute("data-id")
          openEditNoteModal(noteId)
        })
      })
    }
  
    // Delete note functionality
    const deleteNoteButtons = document.querySelectorAll(".delete-note")
    if (deleteNoteButtons.length > 0) {
      deleteNoteButtons.forEach((button) => {
        button.addEventListener("click", function () {
          const noteId = this.getAttribute("data-id")
          openDeleteNoteModal(noteId)
        })
      })
    }
  
    // Unsave note functionality
    const unsaveNoteButtons = document.querySelectorAll(".unsave-note")
    if (unsaveNoteButtons.length > 0) {
      unsaveNoteButtons.forEach((button) => {
        button.addEventListener("click", function () {
          const noteId = this.getAttribute("data-id")
          if (confirm("Are you sure you want to remove this note from your saved notes?")) {
            // In a real app, this would call an API to unsave the note
            const noteCard = this.closest(".note-card")
            if (noteCard) {
              noteCard.style.opacity = "0"
              setTimeout(() => {
                noteCard.remove()
  
                // Check if there are no more saved notes
                const savedNotesGrid = document.querySelector("#saved-notes .notes-grid")
                if (savedNotesGrid && savedNotesGrid.children.length === 0) {
                  savedNotesGrid.innerHTML = `
                    <div class="empty-state">
                      <i class="fas fa-bookmark" style="font-size: 3rem; color: var(--text-light); margin-bottom: 1rem;"></i>
                      <h3>No Saved Notes</h3>
                      <p>You haven't saved any notes yet. Browse notes and save them for later.</p>
                      <a href="browse-notes.html" class="btn btn-primary">Browse Notes</a>
                    </div>
                  `
                }
              }, 300)
            }
          }
        })
      })
    }
  
    // Open edit note modal
    function openEditNoteModal(noteId) {
      const modal = document.getElementById("edit-note-modal")
      const noteIdField = document.getElementById("edit-note-id")
  
      if (modal && noteIdField) {
        // In a real app, this would fetch the note data from an API
        // For demo, we'll use hardcoded data based on the note ID
        let noteData = {}
  
        if (noteId === "1") {
          noteData = {
            id: 1,
            title: "Computer Networks",
            course: "CS301",
            semester: "5",
            description: "Comprehensive notes covering TCP/IP, OSI model, routing protocols, and network security.",
          }
        } else if (noteId === "2") {
          noteData = {
            id: 2,
            title: "Operating Systems",
            course: "CS330",
            semester: "6",
            description: "Complete notes on process management, memory management, file systems, and virtualization.",
          }
        } else if (noteId === "3") {
          noteData = {
            id: 3,
            title: "Web Development",
            course: "CS335",
            semester: "6",
            description: "Detailed notes on HTML, CSS, JavaScript, React, and backend development with Node.js.",
          }
        }
  
        // Populate the form
        noteIdField.value = noteData.id
        document.getElementById("edit-note-title").value = noteData.title
        document.getElementById("edit-note-course").value = noteData.course
        document.getElementById("edit-note-semester").value = noteData.semester
        document.getElementById("edit-note-description").value = noteData.description
  
        // Show the modal
        modal.classList.add("active")
  
        // Add event listener to close button
        const closeButtons = modal.querySelectorAll(".modal-close")
        closeButtons.forEach((button) => {
          button.addEventListener("click", () => {
            modal.classList.remove("active")
          })
        })
  
        // Add event listener to form submission
        const form = document.getElementById("edit-note-form")
        form.addEventListener("submit", (e) => {
          e.preventDefault()
          saveNoteChanges(form)
        })
      }
    }
  
    // Open delete note modal
    function openDeleteNoteModal(noteId) {
      const modal = document.getElementById("delete-note-modal")
      const noteIdField = document.getElementById("delete-note-id")
  
      if (modal && noteIdField) {
        noteIdField.value = noteId
  
        // Show the modal
        modal.classList.add("active")
  
        // Add event listener to close button
        const closeButtons = modal.querySelectorAll(".modal-close")
        closeButtons.forEach((button) => {
          button.addEventListener("click", () => {
            modal.classList.remove("active")
          })
        })
  
        // Add event listener to confirm delete button
        const confirmDeleteBtn = document.getElementById("confirm-delete")
        confirmDeleteBtn.addEventListener("click", () => {
          deleteNote(noteId)
        })
      }
    }
  
    // Save note changes
    function saveNoteChanges(form) {
      const noteId = form.querySelector("#edit-note-id").value
      const title = form.querySelector("#edit-note-title").value
      const course = form.querySelector("#edit-note-course").value
      const semester = form.querySelector("#edit-note-semester").value
      const description = form.querySelector("#edit-note-description").value
  
      // Validate form
      if (!title.trim() || !course || !semester || !description.trim()) {
        alert("Please fill in all fields")
        return
      }
  
      // Show loading state
      const submitButton = form.querySelector('button[type="submit"]')
      const originalText = submitButton.textContent
      submitButton.disabled = true
      submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...'
  
      // Simulate API call delay
      setTimeout(() => {
        // In a real app, this would call an API to update the note
  
        // Update the note card in the UI
        const noteCard = document.querySelector(`.edit-note[data-id="${noteId}"]`).closest(".note-card")
        if (noteCard) {
          noteCard.querySelector("h3").textContent = title
          noteCard.querySelector(".note-meta").textContent = `${course} • ${semester}th Semester`
        }
  
        // Close the modal
        document.getElementById("edit-note-modal").classList.remove("active")
  
        // Show success message
        alert("Note updated successfully!")
  
        // Reset button
        submitButton.disabled = false
        submitButton.textContent = originalText
      }, 1500)
    }
  
    // Delete note
    function deleteNote(noteId) {
      // Show loading state
      const confirmDeleteBtn = document.getElementById("confirm-delete")
      const originalText = confirmDeleteBtn.textContent
      confirmDeleteBtn.disabled = true
      confirmDeleteBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Deleting...'
  
      // Simulate API call delay
      setTimeout(() => {
        // In a real app, this would call an API to delete the note
  
        // Remove the note card from the UI
        const noteCard = document.querySelector(`.delete-note[data-id="${noteId}"]`).closest(".note-card")
        if (noteCard) {
          noteCard.style.opacity = "0"
          setTimeout(() => {
            noteCard.remove()
  
            // Check if there are no more notes
            const myNotesGrid = document.querySelector("#my-notes .notes-grid")
            if (myNotesGrid && myNotesGrid.children.length === 0) {
              myNotesGrid.innerHTML = `
                <div class="empty-state">
                  <i class="fas fa-file-alt" style="font-size: 3rem; color: var(--text-light); margin-bottom: 1rem;"></i>
                  <h3>No Uploaded Notes</h3>
                  <p>You haven't uploaded any notes yet. Share your knowledge with the community!</p>
                  <a href="upload-notes.html" class="btn btn-primary">Upload Notes</a>
                </div>
              `
            }
          }, 300)
        }
  
        // Close the modal
        document.getElementById("delete-note-modal").classList.remove("active")
  
        // Show success message
        alert("Note deleted successfully!")
  
        // Reset button
        confirmDeleteBtn.disabled = false
        confirmDeleteBtn.textContent = originalText
      }, 1500)
    }
  
    // Close modals when clicking outside
    window.addEventListener("click", (e) => {
      const modals = document.querySelectorAll(".modal")
      modals.forEach((modal) => {
        if (e.target === modal) {
          modal.classList.remove("active")
        }
      })
    })
  
    function updateThemeIcons(isDark) {
      const themeIcon = document.querySelector(".theme-toggle i")
      if (themeIcon) {
        themeIcon.classList.remove(isDark ? "fa-moon" : "fa-sun")
        themeIcon.classList.add(isDark ? "fa-sun" : "fa-moon")
      }
    }
  })
  