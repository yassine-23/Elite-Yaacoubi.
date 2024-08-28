<?php
// Check if the form is submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Collect and sanitize form inputs
    $name = htmlspecialchars(strip_tags(trim($_POST["name"])));
    $email = htmlspecialchars(strip_tags(trim($_POST["email"])));
    $message = htmlspecialchars(strip_tags(trim($_POST["message"])));

    // Validate form data
    if (!empty($name) && !empty($email) && !empty($message)) {
        // Email settings
        $to = "elite.yacobi@gmail.com"; // Replace with your email address
        $subject = "New Contact Form Submission from " . $name;
        $headers = "From: " . $email . "\r\n";
        $headers .= "Reply-To: " . $email . "\r\n";
        $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

        // Email body
        $body = "You have received a new message from your website contact form.\n\n";
        $body .= "Here are the details:\n";
        $body .= "Name: " . $name . "\n";
        $body .= "Email: " . $email . "\n";
        $body .= "Message:\n" . $message . "\n";

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
    echo "There was a problem with your submission. Please try again.";
}
?>
