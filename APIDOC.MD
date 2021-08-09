# API Doc
## Auth
<u>Getting QR Code</u>
 ``GET : /auth/getqr``
> Used to get a QR Code to Log into Whatsapp Web
	- If not logged in, returns a **QR Code**
	- If logged in, returns an "Authenticated" message.

## Chat
<u>Sending Messages</u>
``POST : /chat/sendmessage/<phone_number>``
> Request Body
>   - message - contains the message to be sent
<hr>

> NOTE: Do not use nodemon to run this, as it messes with the authentication process.