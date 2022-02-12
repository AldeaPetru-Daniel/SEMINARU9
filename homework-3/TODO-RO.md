# Subject 2 (2.5 pts)
# TOPIC: Javascript

Avem definite rutele de get: create si food-items. 
Trebuie sa implementam ruta de post food-items pentru a insera o noua inregistrare in baza de date.
Obiectul inserat este de forma: 
{
    name: "",
    category: "",
    calories: ""
}


# Complete the following tasks:

- Daca body-ul este null, undefined sau este trimis un obiect gol sa se trimita statusul 400(Bad request) impreuna cu mesajul `body is missing`; (0.5 pts)
- Daca body-ul nu respecta forma de mai sus (are mai mult sau mai putin de 3 elemente) se da statusul 400 cu mesajul: `malformed request`; (0.5 pts)
- Daca calories este negativ se da statusul 400 cu mesajul `calories should be a positive number` (0.5 pts)
- Daca totul este ok sa se insereze noua inregistrare in baza de date, apoi se va da statusul 201(created) impreuna cu mesajul `created` (0.5 pts)
- Daca categoria are o lungime mai mica de 3 sau mai mare de 10 se da statusul 400 impreuna cu mesajul `not a valid category` (0.5 pts)