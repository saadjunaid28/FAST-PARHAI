// Forum Page JavaScript

document.addEventListener("DOMContentLoaded", () => {
    // Ask Question Modal
    const askQuestionBtn = document.getElementById("ask-question-btn")
    const askQuestionModal = document.getElementById("ask-question-modal")
    const modalCloseButtons = document.querySelectorAll(".modal-close")
  
    if (askQuestionBtn && askQuestionModal) {
      // Open modal when clicking the Ask Question button
      askQuestionBtn.addEventListener("click", () => {
        askQuestionModal.classList.add("active")
      })
  
      // Close modal when clicking the close button
      modalCloseButtons.forEach((button) => {
        button.addEventListener("click", () => {
          askQuestionModal.classList.remove("active")
        })
      })
  
      // Close modal when clicking outside
      window.addEventListener("click", (e) => {
        if (e.target === askQuestionModal) {
          askQuestionModal.classList.remove("active")
        }
      })
    }
  
    // Ask Question Form Submission
    const askQuestionForm = document.getElementById("ask-question-form")
    if (askQuestionForm) {
      askQuestionForm.addEventListener("submit", (e) => {
        e.preventDefault()
  
        // Get form data
        const title = document.getElementById("question-title").value
        const category = document.getElementById("question-category").value
        const semester = document.getElementById("question-semester").value
        const content = document.getElementById("question-content").value
        const tags = document.getElementById("question-tags").value
        const anonymous = document.getElementById("anonymous-question").checked
  
        // Validate form
        if (!title.trim() || !category || !semester || !content.trim()) {
          alert("Please fill in all required fields")
          return
        }
  
        // Submit question
        submitQuestion({
          title,
          category,
          semester,
          content,
          tags,
          anonymous,
        })
      })
    }
  
    // Submit question function
    function submitQuestion(questionData) {
      // Show loading state
      const submitButton = document.querySelector('#ask-question-form button[type="submit"]')
      const originalText = submitButton.textContent
      submitButton.disabled = true
      submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Posting...'
  
      // Simulate API call delay
      setTimeout(() => {
        // In a real app, this would call an API to create the question
  
        // Close the modal
        askQuestionModal.classList.remove("active")
  
        // Show success message
        const successMessage = document.createElement("div")
        successMessage.className = "success-message"
        successMessage.innerHTML = `
          <i class="fas fa-check-circle"></i>
          <p>Your question has been posted successfully!</p>
        `
        document.querySelector(".forum-container").prepend(successMessage)
  
        // Add the new question to the list
        addNewQuestion(questionData)
  
        // Remove success message after a delay
        setTimeout(() => {
          successMessage.style.opacity = "0"
          setTimeout(() => {
            successMessage.remove()
          }, 300)
        }, 3000)
  
        // Reset form
        askQuestionForm.reset()
  
        // Reset button
        submitButton.disabled = false
        submitButton.textContent = originalText
      }, 1500)
    }
  
    // Add new question to the list
    function addNewQuestion(questionData) {
      const questionsList = document.querySelector(".forum-questions")
      if (!questionsList) return
  
      // Get user info from localStorage (in a real app, this would come from the server)
      const userData = JSON.parse(localStorage.getItem("user")) || {
        name: "John Doe",
        avatar: "images/default-avatar.png",
      }
  
      // Format tags
      let tagsHTML = ""
      if (questionData.tags) {
        const tagsArray = questionData.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag)
        tagsHTML = tagsArray.map((tag) => `<span class="tag">${tag}</span>`).join("")
      }
  
      // Create question HTML
      const questionHTML = `
        <div class="question-card" style="opacity: 0; transform: translateY(20px);">
          <div class="question-stats">
            <div class="stat">
              <span class="stat-value">0</span>
              <span class="stat-label">Answers</span>
            </div>
            <div class="stat">
              <span class="stat-value">1</span>
              <span class="stat-label">Views</span>
            </div>
          </div>
          <div class="question-content">
            <h3 class="question-title">
              <a href="question-details.html">${questionData.title}</a>
            </h3>
            <div class="question-meta">
              <span class="question-category">${getCategoryName(questionData.category)}</span>
              <span class="question-semester">${getSemesterName(questionData.semester)}</span>
              <span class="question-time">Posted just now</span>
            </div>
            <p class="question-excerpt">${questionData.content.substring(0, 150)}${questionData.content.length > 150 ? "..." : ""}</p>
            <div class="question-tags">
              ${tagsHTML}
            </div>
            <div class="question-author ${questionData.anonymous ? "anonymous" : ""}">
              ${
                questionData.anonymous
                  ? `<i class="fas fa-user-secret"></i>
                <span>Asked anonymously</span>`
                  : `<img src="${userData.avatar}" alt="User Avatar">
                <span>Asked by: ${userData.name}</span>`
              }
            </div>
          </div>
        </div>
      `
  
      // Add to the top of the list
      questionsList.insertAdjacentHTML("afterbegin", questionHTML)
  
      // Animate the new question
      setTimeout(() => {
        const newQuestion = questionsList.firstElementChild
        newQuestion.style.opacity = "1"
        newQuestion.style.transform = "translateY(0)"
        newQuestion.style.transition = "opacity 0.3s ease, transform 0.3s ease"
      }, 10)
    }
  
    // Helper function to get category name
    function getCategoryName(categoryValue) {
      const categories = {
        general: "General",
        courses: "Courses",
        exams: "Exams & Quizzes",
        projects: "Projects",
        career: "Career",
      }
      return categories[categoryValue] || categoryValue
    }
  
    // Helper function to get semester name
    function getSemesterName(semesterValue) {
      if (semesterValue === "all") return "All Semesters"
      const suffixes = ["st", "nd", "rd", "th", "th", "th", "th", "th"]
      return `${semesterValue}${suffixes[Number.parseInt(semesterValue) - 1]} Semester`
    }
  
    // Forum search functionality
    const forumSearchInput = document.getElementById("forum-search-input")
    if (forumSearchInput) {
      forumSearchInput.addEventListener("keypress", function (e) {
        if (e.key === "Enter") {
          const searchTerm = this.value.trim().toLowerCase()
          if (searchTerm) {
            searchQuestions(searchTerm)
          }
        }
      })
    }
  
    // Search questions function
    function searchQuestions(searchTerm) {
      const questionCards = document.querySelectorAll(".question-card")
      let matchFound = false
  
      questionCards.forEach((card) => {
        const title = card.querySelector(".question-title").textContent.toLowerCase()
        const excerpt = card.querySelector(".question-excerpt").textContent.toLowerCase()
        const tags = Array.from(card.querySelectorAll(".tag")).map((tag) => tag.textContent.toLowerCase())
  
        // Check if the search term is in the title, excerpt, or tags
        if (title.includes(searchTerm) || excerpt.includes(searchTerm) || tags.some((tag) => tag.includes(searchTerm))) {
          card.style.display = "flex"
          card.style.animation = "highlight 2s"
          matchFound = true
        } else {
          card.style.display = "none"
        }
      })
  
      // Show message if no matches found
      const noResultsMessage = document.querySelector(".no-results-message")
      if (!matchFound) {
        if (!noResultsMessage) {
          const message = document.createElement("div")
          message.className = "no-results-message"
          message.innerHTML = `
            <i class="fas fa-search" style="font-size: 2rem; color: var(--text-light); margin-bottom: 1rem;"></i>
            <h3>No Results Found</h3>
            <p>No questions match your search term "${searchTerm}".</p>
            <button class="btn btn-primary clear-search">Clear Search</button>
          `
          document.querySelector(".forum-questions").prepend(message)
  
          // Add event listener to clear search button
          message.querySelector(".clear-search").addEventListener("click", () => {
            forumSearchInput.value = ""
            questionCards.forEach((card) => {
              card.style.display = "flex"
              card.style.animation = ""
            })
            message.remove()
          })
        }
      } else if (noResultsMessage) {
        noResultsMessage.remove()
      }
    }
  
    // Filter functionality
    const filterCategory = document.getElementById("filter-category")
    const filterSort = document.getElementById("filter-sort")
    const filterSemester = document.getElementById("filter-semester")
  
    const filterElements = [filterCategory, filterSort, filterSemester]
  
    filterElements.forEach((filter) => {
      if (filter) {
        filter.addEventListener("change", applyFilters)
      }
    })
  
    // Apply filters function
    function applyFilters() {
      const category = filterCategory ? filterCategory.value : "all"
      const sortBy = filterSort ? filterSort.value : "newest"
      const semester = filterSemester ? filterSemester.value : "all"
  
      // In a real app, this would call an API to get filtered questions
      // For demo, we'll just show a message
  
      const filterMessage = document.createElement("div")
      filterMessage.className = "filter-message"
      filterMessage.innerHTML = `
        <p>Filters applied: Category = ${getCategoryName(category)}, Sort = ${sortBy}, Semester = ${getSemesterName(semester)}</p>
      `
  
      // Remove any existing filter message
      const existingMessage = document.querySelector(".filter-message")
      if (existingMessage) {
        existingMessage.remove()
      }
  
      // Add the new message
      document.querySelector(".forum-filters").after(filterMessage)
  
      // Remove message after a delay
      setTimeout(() => {
        filterMessage.style.opacity = "0"
        setTimeout(() => {
          filterMessage.remove()
        }, 300)
      }, 3000)
    }
  
    // Pagination functionality
    const paginationButtons = document.querySelectorAll(".pagination-btn")
    if (paginationButtons.length > 0) {
      paginationButtons.forEach((button) => {
        button.addEventListener("click", function () {
          // Remove active class from all buttons
          paginationButtons.forEach((btn) => {
            if (btn.classList.contains("active")) {
              btn.classList.remove("active")
            }
          })
  
          // Add active class to clicked button
          if (!this.classList.contains("next")) {
            this.classList.add("active")
          } else {
            // If next button is clicked, activate the next page
            const activeButton = document.querySelector(".pagination-btn.active")
            const nextButton = activeButton.nextElementSibling
            if (nextButton && !nextButton.classList.contains("next")) {
              nextButton.classList.add("active")
            }
          }
  
          // Scroll to top
          window.scrollTo({ top: 0, behavior: "smooth" })
  
          // In a real app, this would load the next page of questions
          // For demo, we'll just show a loading indicator
  
          const questionsList = document.querySelector(".forum-questions")
          if (questionsList) {
            questionsList.innerHTML = `
              <div class="loading-indicator">
                <i class="fas fa-spinner fa-spin" style="font-size: 2rem; color: var(--primary-color);"></i>
                <p>Loading questions...</p>
              </div>
            `
  
            // Simulate loading delay
            setTimeout(() => {
              // Restore original questions (in a real app, this would load new questions)
              location.reload()
            }, 1500)
          }
        })
      })
    }
  })
  