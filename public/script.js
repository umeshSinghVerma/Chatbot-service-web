const currentScript = document.currentScript;
document.addEventListener("DOMContentLoaded", function () {
  // Create Floating Button
  const chatbotButton = document.createElement("button");
  chatbotButton.innerHTML = "💬"; // Chat Icon
  chatbotButton.style.position = "fixed";
  chatbotButton.style.bottom = "20px";
  chatbotButton.style.right = "20px";
  chatbotButton.style.width = "60px";
  chatbotButton.style.height = "60px";
  chatbotButton.style.background = "linear-gradient(135deg, #007bff, #00d4ff)";
  chatbotButton.style.color = "white";
  chatbotButton.style.border = "none";
  chatbotButton.style.borderRadius = "50%";
  chatbotButton.style.fontSize = "24px";
  chatbotButton.style.display = "flex";
  chatbotButton.style.justifyContent = "center";
  chatbotButton.style.alignItems = "center";
  chatbotButton.style.cursor = "pointer";
  chatbotButton.style.boxShadow = "0 5px 15px rgba(0, 0, 0, 0.2)";
  chatbotButton.style.transition = "all 0.3s ease-in-out";
  
  chatbotButton.addEventListener("mouseenter", () => chatbotButton.style.transform = "scale(1.1)");
  chatbotButton.addEventListener("mouseleave", () => chatbotButton.style.transform = "scale(1)");

  // Create Chatbot Container (Initially Hidden)
  const chatbotContainer = document.createElement("div");
  chatbotContainer.style.position = "fixed";
  chatbotContainer.style.bottom = "80px";
  chatbotContainer.style.right = "20px";
  chatbotContainer.style.width = "380px";
  chatbotContainer.style.height = "550px";
  chatbotContainer.style.background = "white";
  chatbotContainer.style.borderRadius = "15px";
  chatbotContainer.style.boxShadow = "0 10px 25px rgba(0, 0, 0, 0.3)";
  chatbotContainer.style.overflow = "hidden";
  chatbotContainer.style.display = "none";
  chatbotContainer.style.animation = "fadeIn 0.3s ease-in-out, slideUp 0.3s ease-in-out";

  // Create Close Button
  const closeButton = document.createElement("button");
  closeButton.innerHTML = "✖";
  closeButton.style.position = "absolute";
  closeButton.style.top = "15px";
  closeButton.style.right = "15px";
  closeButton.style.border = "none";
  closeButton.style.background = "none";
  closeButton.style.fontSize = "18px";
  closeButton.style.cursor = "pointer";
  closeButton.style.color = "#fff";


  console.log(currentScript.id);

  // Create Iframe
  const chatbotIframe = document.createElement("iframe");
  chatbotIframe.src = `https://chatbot-service-bot.vercel.app/${currentScript.id}`;
  chatbotIframe.style.width = "100%";
  chatbotIframe.style.height = "100%";
  chatbotIframe.style.border = "none";

  // Append Elements
  chatbotContainer.appendChild(closeButton);
  chatbotContainer.appendChild(chatbotIframe);
  document.body.appendChild(chatbotButton);
  document.body.appendChild(chatbotContainer);

  // Toggle Chatbot on Button Click
  chatbotButton.addEventListener("click", function () {
      chatbotContainer.style.display = chatbotContainer.style.display === "none" ? "flex" : "none";
  });

  // Close Chatbot on Close Button Click
  closeButton.addEventListener("click", function () {
      chatbotContainer.style.display = "none";
  });
});
