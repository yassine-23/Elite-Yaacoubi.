<?php
// Check if the form is submitted using POST method
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Collect and sanitize form inputs
    $name = trim($_POST["name"]);
    $email = trim($_POST["email"]);
    $message = trim($_POST["message"]);

    // Validate form data
    if (!empty($name) && !empty($email) && !empty($message)) {
        // Email settings
        $to = "elite.yacobi@gmail.com"; // Replace with your email address
        $subject = "New Contact Form Submission from " . htmlspecialchars($name);
        $headers = "From: " . htmlspecialchars($email) . "\r\n";
        $headers .= "Reply-To: " . htmlspecialchars($email) . "\r\n";
        $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

        // Email body
        $body = "You have received a new message from your website contact form.\n\n";
        $body .= "Here are the details:\n";
        $body .= "Name: " . htmlspecialchars($name) . "\n";
        $body .= "Email: " . htmlspecialchars($email) . "\n";
        $body .= "Message:\n" . htmlspecialchars($message) . "\n";

        // Send email
        if (mail($to, $subject, $body, $headers)) {
            // Redirect to a thank you page
            header("Location: thank_you.html");
            exit;
        } else {
            // Display error if mail not sent
            echo "Oops! Something went wrong, and we couldn't send your message.";
        }
    } else {
        echo "Please fill in all fields.";
    }
} else {
    // If the form was not submitted via POST
    echo "Invalid request method.";
}
?>
