NOTE :-
1. MAKE SURE ALL THE SERVERS SUCH AS "REDIS", "SQL" & "PHP" (or XAMPP), "MONGO DB" is working in backend. Otherwise, the form will show weird behaviour.
2. Please add the "vendor" folder (i.e. Using Composer, download the Predis (PHP Redis extension) & Mongo Db PHP extension) yourself in order to make mongo db and redis work.

It is a precisely desinged authentication webpage, which uses tokens and all to verify the users reauthentication.. it matches the user's email, username & token group to verify and automatically login him/her and fetch the data..(the token , username are stored in client side in Local Storage & On server side on Redis)
