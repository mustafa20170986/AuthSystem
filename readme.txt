(signup) -> frotnend 
first user will login using the form 
request  for signup will hit the server 
the token and role will be saved in the localstorage 

(signin) -> frotnend 
the same will be happen 

(signup) -> backend 
first check if the same suer exists 
hash the password 
generate the payload 
signin the payload and return response 

(signin)-> backend 
find the user 
compare the password 
return user object (conert it from mongoose document to js object)
