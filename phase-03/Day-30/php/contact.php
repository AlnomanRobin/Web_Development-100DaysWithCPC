<?php
// Simple PHP fallback for contact form. Configure recipient email below.
$recipient = 'robinalnoman@gmail.com';
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  http_response_code(405);
  echo json_encode(['success'=>false,'error'=>'Method not allowed']);
  exit;
}

$name = trim($_POST['name'] ?? '');
$email = trim($_POST['email'] ?? '');
$subject = trim($_POST['subject'] ?? 'Contact from portfolio');
$message = trim($_POST['message'] ?? '');

if (!$name || !$email || !$message) {
  http_response_code(400);
  echo json_encode(['success'=>false,'error'=>'Missing fields']);
  exit;
}

$body = "From: $name <$email>\n\n" . $message;
$headers = "From: $name <$email>\r\n" .
           "Reply-To: $email\r\n";

$ok = mail($recipient, $subject, $body, $headers);

if ($ok) echo json_encode(['success'=>true]);
else { http_response_code(500); echo json_encode(['success'=>false,'error'=>'Mail send failed']); }

?>
