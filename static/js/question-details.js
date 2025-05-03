document.addEventListener("DOMContentLoaded", () => {
    // Theme toggle functionality
    const themeToggle = document.querySelector(".theme-toggle")
    const body = document.body
  
    // Check if user has a saved theme preference
    const savedTheme = localStorage.getItem("theme")
    if (savedTheme === "dark") {
      body.classList.add("dark-mode")
      themeToggle.querySelector("i").classList.remove("fa-moon")
      themeToggle.querySelector("i").classList.add("fa-sun")
    }
  
    themeToggle.addEventListener("click", () => {
      body.classList.toggle("dark-mode")
  
      const icon = themeToggle.querySelector("i")
      if (body.classList.contains("dark-mode")) {
        icon.classList.remove("fa-moon")
        icon.classList.add("fa-sun")
        localStorage.setItem("theme", "dark")
      } else {
        icon.classList.remove("fa-sun")
        icon.classList.add("fa-moon")
        localStorage.setItem("theme", "light")
      }
    })
  
    // Sidebar toggle functionality
    const sidebarToggle = document.getElementById("sidebarToggle")
    const sidebar = document.querySelector(".sidebar")
  
    sidebarToggle.addEventListener("click", () => {
      sidebar.classList.toggle("collapsed")
    })
  
    // Logout functionality
    const logoutBtn = document.getElementById("logoutBtn")
  
    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault()
      if (confirm("Are you sure you want to logout?")) {
        // In a real application, this would call a logout API
        window.location.href = "login.html"
      }
    })
  
    // Vote buttons functionality
    const voteButtons = document.querySelectorAll(".upvote-btn, .downvote-btn")
  
    voteButtons.forEach((button) => {
      button.addEventListener("click", function () {
        // Check if this button is already active
        const isActive = this.classList.contains("active")
  
        // Get the parent element (question or answer)
        const parent = this.closest(".question-actions") || this.closest(".answer-actions")
  
        // Remove active class from all vote buttons in this parent
        const siblingVoteButtons = parent.querySelectorAll(".upvote-btn, .downvote-btn")
        siblingVoteButtons.forEach((btn) => btn.classList.remove("active"))
  
        // If the button wasn't active before, make it active now
        if (!isActive) {
          this.classList.add("active")
  
          // Update the vote count (in a real app, this would call an API)
          const countSpan = this.querySelector("span")
          const currentCount = Number.parseInt(countSpan.textContent)
  
          if (this.classList.contains("upvote-btn")) {
            countSpan.textContent = currentCount + 1
  
            // If there's a downvote button, decrease its count if it was previously active
            const downvoteBtn = parent.querySelector(".downvote-btn")
            if (downvoteBtn && downvoteBtn.classList.contains("active")) {
              const downvoteCount = Number.parseInt(downvoteBtn.querySelector("span").textContent)
              downvoteBtn.querySelector("span").textContent = downvoteCount - 1
            }
          } else {
            countSpan.textContent = currentCount + 1
  
            // If there's an upvote button, decrease its count if it was previously active
            const upvoteBtn = parent.querySelector(".upvote-btn")
            if (upvoteBtn && upvoteBtn.classList.contains("active")) {
              const upvoteCount = Number.parseInt(upvoteBtn.querySelector("span").textContent)
              upvoteBtn.querySelector("span").textContent = upvoteCount - 1
            }
          }
        }
      })
    })
  
    // Bookmark button functionality
    const bookmarkButtons = document.querySelectorAll(".bookmark-btn")
  
    bookmarkButtons.forEach((button) => {
      button.addEventListener("click", function () {
        const icon = this.querySelector("i")
  
        if (icon.classList.contains("far")) {
          // Not bookmarked yet, bookmark it
          icon.classList.remove("far")
          icon.classList.add("fas")
          this.querySelector("span").textContent = "Saved"
        } else {
          // Already bookmarked, remove bookmark
          icon.classList.remove("fas")
          icon.classList.add("far")
          this.querySelector("span").textContent = "Save"
        }
      })
    })
  
    // Comment button functionality
    const commentButtons = document.querySelectorAll(".comment-btn")
  
    commentButtons.forEach((button) => {
      button.addEventListener("click", function () {
        const commentsSection = this.closest(".answer-content").querySelector(".answer-comments")
  
        if (commentsSection.classList.contains("collapsed")) {
          // Show comments
          commentsSection.classList.remove("collapsed")
          commentsSection.innerHTML = `
            <div class="comment">
              <div class="comment-author">
                <img src="https://via.placeholder.com/30" alt="User Avatar">
                <span>Ali Hassan</span>
              </div>
              <div class="comment-text">
                <p>This explanation is incredibly clear! The diagrams really helped me understand the rotations. Thank you!</p>
              </div>
              <div class="comment-actions">
                <span class="comment-date">1 day ago</span>
                <button class="comment-like">
                  <i class="far fa-thumbs-up"></i>
                  <span>5</span>
                </button>
                <button class="comment-reply">Reply</button>
              </div>
            </div>
            <div class="comment">
              <div class="comment-author">
                <img src="https://via.placeholder.com/30" alt="User Avatar">
                <span>Usman Khan</span>
                <span class="op-badge">OP</span>
              </div>
              <div class="comment-text">
                <p>Thank you so much for this detailed explanation! I was able to implement it and it works perfectly.</p>
              </div>
              <div class="comment-actions">
                <span class="comment-date">1 day ago</span>
                <button class="comment-like">
                  <i class="far fa-thumbs-up"></i>
                  <span>3</span>
                </button>
                <button class="comment-reply">Reply</button>
              </div>
            </div>
            <div class="add-comment">
              <img src="https://via.placeholder.com/30" alt="Your Avatar">
              <input type="text" placeholder="Add a comment...">
              <button class="post-comment-btn">Post</button>
            </div>
          `
  
          // Add event listeners to the newly added elements
          setupCommentLikeButtons()
          setupPostCommentButtons()
        } else {
          // Hide comments
          commentsSection.classList.add("collapsed")
          commentsSection.innerHTML = `
            <div class="comment-count">
              <button class="show-comments-btn">
                <i class="fas fa-chevron-down"></i>
                <span>Show 2 comments</span>
              </button>
            </div>
          `
  
          // Add event listener to the show comments button
          const showCommentsBtn = commentsSection.querySelector(".show-comments-btn")
          showCommentsBtn.addEventListener("click", () => {
            button.click() // Simulate clicking the comment button
          })
        }
      })
    })
  
    // Show comments button functionality
    const showCommentsButtons = document.querySelectorAll(".show-comments-btn")
  
    showCommentsButtons.forEach((button) => {
      button.addEventListener("click", function () {
        const commentsSection = this.closest(".answer-comments")
        const commentBtn = commentsSection.closest(".answer-content").querySelector(".comment-btn")
        commentBtn.click() // Simulate clicking the comment button
      })
    })
  
    // Function to set up comment like buttons
    function setupCommentLikeButtons() {
      const commentLikeButtons = document.querySelectorAll(".comment-like")
  
      commentLikeButtons.forEach((button) => {
        button.addEventListener("click", function () {
          const icon = this.querySelector("i")
          const countSpan = this.querySelector("span")
          const currentCount = Number.parseInt(countSpan.textContent)
  
          if (icon.classList.contains("far")) {
            // Not liked yet, like it
            icon.classList.remove("far")
            icon.classList.add("fas")
            countSpan.textContent = currentCount + 1
          } else {
            // Already liked, unlike it
            icon.classList.remove("fas")
            icon.classList.add("far")
            countSpan.textContent = currentCount - 1
          }
        })
      })
    }
  
    // Function to set up post comment buttons
    function setupPostCommentButtons() {
      const postCommentButtons = document.querySelectorAll(".post-comment-btn")
  
      postCommentButtons.forEach((button) => {
        button.addEventListener("click", function () {
          const commentInput = this.previousElementSibling
          const commentText = commentInput.value.trim()
  
          if (commentText) {
            const commentsSection = this.closest(".answer-comments")
            const newComment = document.createElement("div")
            newComment.className = "comment"
            newComment.innerHTML = `
              <div class="comment-author">
                <img src="https://via.placeholder.com/30" alt="Your Avatar">
                <span>Ahmed Khan</span>
              </div>
              <div class="comment-text">
                <p>${commentText}</p>
              </div>
              <div class="comment-actions">
                <span class="comment-date">Just now</span>
                <button class="comment-like">
                  <i class="far fa-thumbs-up"></i>
                  <span>0</span>
                </button>
                <button class="comment-reply">Reply</button>
              </div>
            `
  
            // Insert the new comment before the add comment form
            const addCommentForm = this.closest(".add-comment")
            commentsSection.insertBefore(newComment, addCommentForm)
  
            // Clear the input
            commentInput.value = ""
  
            // Add event listener to the new comment's like button
            const newCommentLikeButton = newComment.querySelector(".comment-like")
            newCommentLikeButton.addEventListener("click", function () {
              const icon = this.querySelector("i")
              const countSpan = this.querySelector("span")
              const currentCount = Number.parseInt(countSpan.textContent)
  
              if (icon.classList.contains("far")) {
                icon.classList.remove("far")
                icon.classList.add("fas")
                countSpan.textContent = currentCount + 1
              } else {
                icon.classList.remove("fas")
                icon.classList.add("far")
                countSpan.textContent = currentCount - 1
              }
            })
          }
        })
      })
    }
  
    // Initialize the comment like buttons
    setupCommentLikeButtons()
  
    // Initialize the post comment buttons
    setupPostCommentButtons()
  
    // Answer sort functionality
    const answerSort = document.getElementById("answerSort")
  
    if (answerSort) {
      answerSort.addEventListener("change", function () {
        const sortBy = this.value
        const answersSection = document.querySelector(".answers-section")
        const answers = Array.from(answersSection.querySelectorAll(".answer:not(.best-answer)"))
  
        // Sort the answers based on the selected option
        answers.sort((a, b) => {
          if (sortBy === "votes") {
            const aVotes = Number.parseInt(a.querySelector(".upvote-btn span").textContent)
            const bVotes = Number.parseInt(b.querySelector(".upvote-btn span").textContent)
            return bVotes - aVotes
          } else if (sortBy === "newest") {
            // In a real app, this would compare actual dates
            // For this demo, we'll just use a random order
            return Math.random() - 0.5
          } else if (sortBy === "oldest") {
            // In a real app, this would compare actual dates
            // For this demo, we'll just use the reverse of the random order
            return 0.5 - Math.random()
          }
        })
  
        // Remove all answers except the best answer
        const bestAnswer = answersSection.querySelector(".best-answer")
        const answersContainer = bestAnswer.parentElement
        answers.forEach((answer) => answer.remove())
  
        // Append the sorted answers after the best answer
        answers.forEach((answer) => answersContainer.appendChild(answer))
      })
    }
  
    // Editor toolbar functionality
    const toolbarButtons = document.querySelectorAll(".toolbar-btn")
    const answerEditor = document.querySelector(".answer-editor")
  
    if (toolbarButtons.length > 0 && answerEditor) {
      toolbarButtons.forEach((button) => {
        button.addEventListener("click", function () {
          const icon = this.querySelector("i").classList
          let tag = ""
  
          if (icon.contains("fa-bold")) {
            tag = "**bold text**"
          } else if (icon.contains("fa-italic")) {
            tag = "*italic text*"
          } else if (icon.contains("fa-list")) {
            tag = "\n- List item 1\n- List item 2\n- List item 3"
          } else if (icon.contains("fa-list-ol")) {
            tag = "\n1. List item 1\n2. List item 2\n3. List item 3"
          } else if (icon.contains("fa-code")) {
            tag = "\n```\ncode block\n```"
          } else if (icon.contains("fa-link")) {
            tag = "[link text](https://example.com)"
          } else if (icon.contains("fa-image")) {
            tag = "![alt text](https://via.placeholder.com/150)"
          }
  
          // Insert the tag at the cursor position
          const start = answerEditor.selectionStart
          const end = answerEditor.selectionEnd
          const text = answerEditor.value
          const before = text.substring(0, start)
          const after = text.substring(end, text.length)
  
          answerEditor.value = before + tag + after
          answerEditor.focus()
          answerEditor.selectionStart = start + tag.length
          answerEditor.selectionEnd = start + tag.length
        })
      })
    }
  
    // Submit answer functionality
    const submitAnswerBtn = document.querySelector(".submit-answer-btn")
  
    if (submitAnswerBtn) {
      submitAnswerBtn.addEventListener("click", () => {
        const answerText = answerEditor.value.trim()
  
        if (answerText) {
          alert("Your answer has been submitted successfully!")
          answerEditor.value = ""
        } else {
          alert("Please write your answer before submitting.")
        }
      })
    }
  
    // Share button functionality
    const shareButtons = document.querySelectorAll(".share-btn")
  
    shareButtons.forEach((button) => {
      button.addEventListener("click", () => {
        // In a real app, this would open a share dialog
        alert("Share link copied to clipboard!")
      })
    })
  
    // Report button functionality
    const reportButtons = document.querySelectorAll(".report-btn")
  
    reportButtons.forEach((button) => {
      button.addEventListener("click", () => {
        // In a real app, this would open a report dialog
        const reason = prompt("Please provide a reason for reporting this content:")
  
        if (reason) {
          alert("Thank you for your report. Our moderators will review it shortly.")
        }
      })
    })
  })
  