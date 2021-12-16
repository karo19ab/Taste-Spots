# Kommentarer til aflevering

Youtube link for gennemgang af funktionalitet: https://youtu.be/5c5Etq2wErQ 


## Advarsler i appen:

Når nan logger ind, så kommer den med en rød error, 
hvor "The action 'NAVIGATE' with payload {"name": "MainNavigator"} was not 
handled by any navigator. 
Det må vel være pga. vores MainTabNavigator i App.js, men ved ikke helt hvorfor. 
Appen virker til trods for denne fejlbesked...

Andre gange kommer der en advarsel om at Profil-stacken går i et loop. 
Det er vi godt klar over og det sådan set med vilje, så man kan trykke på de 
forskellige undersider hvor end man i stacken. 

Der kommer en gul advarsel når man laver en ny anmeldelse. Er ikke helt sikker på hvorfor, 
men det fungerer som tilsigtet på trods af advarslen :D

Der kommer også en gul advarsel når man følger venner, men det er også helt normalt!


## Gode råd til brugeroplevelse:

På Venner/følge-siden: Tryk to gange på clear liste for rent faktisk cleare den

På kort-siden: Prøv at skriv en lokation ind og se hvad der sker med pin'en. 
Derefter, tryk på pin'en og efterfølgende tryk igen på navnet der dukker op. 
Trykker du på "add to wishlist", så bliver stedet rent faktisk sendt ind i databasen i Firebase!
Desværre har vi ikke rigtig haft tid til at smide det ind på profil-siden endnu. 
Trykker du på den anden knap i stedet, vil du bar få en tekst i konsollen.

