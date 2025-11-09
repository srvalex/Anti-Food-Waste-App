# Anti-Food-Waste-App
Proiect Tehnologii Web Anul 3 Semestrul 1 
Saraev Alexandru-Ioan + Soueidan Edward Philipe

Lista functionalitati

Pagina personala utilizator: Profil
Profil - functionalitati
- Editeaza username + pfp
- Adaugare / modificare preferinte alimente (TAG-uri)
- Adauga prieteni
- Vezi lista de prieteni
- Adauga TAG-uri custom pentru prieteni

Pagina lista alimente:
- Adaugare toate alimentele din frigider cu TAG-urile specifice acelui aliment + data de expirare
- Daca produsul mai are putin pana la expirare, atunci poate deveni disponibil de luat de catre altcineva
- Produsele disponibile intra in pagina Comunity
- Share pe Facebook/IG


Pagina Comunity:
- In pagina Comunity, vor aparea sub fomra de lista / grid produsele ce urmeaza a expira / produsele marcate ca fiind disponibile
- Produsele din comunity vin cu poze (stock / facute de utilizator), denumire, data de expirare
- Daca un produs este de interes, se poate face claim pe el -> Produsul intra in lista de Claims, iar utilizatorii sunt pusi in contact pentru a discuta

Din pagina Profil, putem ajunge in alte 2 pagini: History si Chat
In pagina History avem atat un istoric al produselor incarcate de utilizator, cat si al celor claim-uite de el
In pagina Chat, avem conversatiile cu ceilalti utilizatori


Structura baza de date

Tabela Utilizator
id int primary key,
Username string,
pfp blob,
descriere


Tabela Produse
id_produs
nume_produs
data_expirare
descriere
id_categorie (tag)

Tabela Produse+utilizarori

id_utilizator
id_produs
cantitate



Salvare filtre:
work in progress


Follow:
work in progress:

Un utilizator poate avea mai multe interese de alimente(TAG-uri). De exemplu, utilizatorul cu id = 1 este interesat de carne, lapte si legume, iar utilizatorul 2 este interesat doar de 


