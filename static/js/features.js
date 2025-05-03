document.addEventListener("DOMContentLoaded", () => {
    // Testimonials slider functionality
    const testimonialCards = document.querySelectorAll(".testimonial-card")
    const dots = document.querySelectorAll(".dot")
    const prevBtn = document.querySelector(".prev-btn")
    const nextBtn = document.querySelector(".next-btn")
  
    let currentSlide = 0
    let slideInterval
  
    // Hide all testimonials except the first one
    function initSlider() {
      testimonialCards.forEach((card, index) => {
        if (index !== 0) {
          card.style.display = "none"
        }
      })
    }
  
    // Show a specific slide
    function showSlide(index) {
      // Hide all slides
      testimonialCards.forEach((card) => {
        card.style.display = "none"
      })
  
      // Remove active class from all dots
      dots.forEach((dot) => {
        dot.classList.remove("active")
      })
  
      // Show the selected slide and activate corresponding dot
      testimonialCards[index].style.display = "block"
      dots[index].classList.add("active")
  
      // Add fade-in animation
      testimonialCards[index].style.opacity = "0"
      setTimeout(() => {
        testimonialCards[index].style.opacity = "1"
        testimonialCards[index].style.transition = "opacity 0.5s ease"
      }, 50)
  
      // Update current slide index
      currentSlide = index
    }
  
    // Next slide function
    function nextSlide() {
      let nextIndex = currentSlide + 1
      if (nextIndex >= testimonialCards.length) {
        nextIndex = 0
      }
      showSlide(nextIndex)
    }
  
    // Previous slide function
    function prevSlide() {
      let prevIndex = currentSlide - 1
      if (prevIndex < 0) {
        prevIndex = testimonialCards.length - 1
      }
      showSlide(prevIndex)
    }
  
    // Start automatic slideshow
    function startSlideshow() {
      slideInterval = setInterval(nextSlide, 5000)
    }
  
    // Stop automatic slideshow
    function stopSlideshow() {
      clearInterval(slideInterval)
    }
  
    // Initialize slider
    initSlider()
    startSlideshow()
  
    // Event listeners for slider controls
    if (prevBtn) {
      prevBtn.addEventListener("click", () => {
        prevSlide()
        stopSlideshow()
        startSlideshow()
      })
    }
  
    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        nextSlide()
        stopSlideshow()
        startSlideshow()
      })
    }
  
    // Add click event to dots
    dots.forEach((dot, index) => {
      dot.addEventListener("click", () => {
        showSlide(index)
        stopSlideshow()
        startSlideshow()
      })
    })
  
    // Feature cards animation on scroll
    const featureCards = document.querySelectorAll(".feature-card")
  
    // Function to check if element is in viewport
    function isInViewport(element) {
      const rect = element.getBoundingClientRect()
      return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
      )
    }
  
    // Function to handle scroll animation
    function handleScrollAnimation() {
      featureCards.forEach((card) => {
        if (isInViewport(card)) {
          card.classList.add("animate")
        }
      })
    }
  
    // Add scroll event listener
    window.addEventListener("scroll", handleScrollAnimation)
  
    // Trigger once on page load
    handleScrollAnimation()
  
    // Comparison table row highlight on hover
    const tableRows = document.querySelectorAll(".comparison-table tr")
  
    tableRows.forEach((row) => {
      row.addEventListener("mouseenter", () => {
        row.classList.add("highlight")
      })
  
      row.addEventListener("mouseleave", () => {
        row.classList.remove("highlight")
      })
    })
  
    // CTA buttons hover effect
    const ctaButtons = document.querySelectorAll(".cta-buttons a")
  
    ctaButtons.forEach((button) => {
      button.addEventListener("mouseenter", () => {
        button.style.transform = "translateY(-5px)"
        button.style.boxShadow = "0 10px 20px rgba(0, 0, 0, 0.2)"
      })
  
      button.addEventListener("mouseleave", () => {
        button.style.transform = "translateY(0)"
        button.style.boxShadow = "none"
      })
    })
  })
  