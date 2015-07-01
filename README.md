#ScacciaBot
A telegram bot for manage all the blacklist service for the SFcoding group. 

### List of features
- two type of users, administration and normal users.
- add/remove world to the black list of each users or in the common blacklist.
- update the amount of money for a specific users and words, by 1 or a custom value.
- auto check of the blacklist world in the telegram group in witch the bot is put.
- show same statistic about the blacklist and users


### Commands

__Admin commands__:
- `/addword` add a world to the user blacklist
- `/delword` remove a world to the user blacklist
- `/update` change the money for a user word to a custom value
- `/increase` increase by one the amount of money for a given user, word

__User commands__:
- `/statistic` show the total cost in euro for each users.
- `/list` list all the words for a given user
- `/help` show an help
- `/ask` ask same change in the blacklist
