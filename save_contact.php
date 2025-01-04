<?php
$host = "localhost";
$username = "root";
$password = "";
$database = "portofolio";

$conn = new mysqli($host, $username, $password, $database);

if ($conn->connect_error) {
    die("Koneksi gagal: " . $conn->connect_error);
}

$name = htmlspecialchars($_POST['name'], ENT_QUOTES);
$email = htmlspecialchars($_POST['email'], ENT_QUOTES);
$message = htmlspecialchars($_POST['message'], ENT_QUOTES);

if (!empty($name) && !empty($email) && !empty($message)) {
    if (filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $stmt = $conn->prepare("INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)");
        $stmt->bind_param("sss", $name, $email, $message);

        if ($stmt->execute()) {
            echo "<script>
                alert('Message sent successfully!');
                window.location.href = 'index.html';
            </script>";
        } else {
            echo "<script>alert('Failed to send message!');
            window.location.href = 'index.html';
            </script>";
        }

        $stmt->close();
    } else {
        echo "<script>alert('Invalid email!');
        window.location.href = 'index.html'; 
        </script>";
    }
} else {
    echo "<script>alert('Please fill in all fields!');
    window.location.href = 'index.html';
    </script>";
}

$conn->close();