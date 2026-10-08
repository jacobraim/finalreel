// Roster. Role score order: Leader, Brains, Brawn, Wildcard, Scout, Marksman (0-10).
// Traits: heart, ego, reckless, loner, traitor, survivor
const FILMS_RAW = [
// ---------- SUPERHERO ----------
["The Avengers",2012,"SH","mcu",[
 "Captain America|9,6,8,4,6,6|heart","Iron Man|7,9,6,8,4,8|ego","Black Widow|6,7,6,6,9,8|","Hulk|2,1,10,10,1,0|reckless","Hawkeye|5,5,5,4,7,10|"]],
["Thor: Ragnarok",2017,"SH","mcu",[
 "Thor|7,4,10,7,4,5|ego","Valkyrie|6,4,8,6,5,6|reckless","Loki|5,8,4,9,8,4|ego,traitor","Korg|3,2,7,8,2,3|heart","Bruce Banner|2,9,9,9,2,1|reckless"]],
["Black Panther",2018,"SH","mcu",[
 "T'Challa|9,7,8,6,7,5|","Shuri|4,10,3,9,4,6|","Okoye|7,5,8,5,7,7|","Nakia|6,6,6,5,9,6|","M'Baku|7,4,9,6,4,3|ego"]],
["Guardians of the Galaxy",2014,"SH","mcu",[
 "Star-Lord|6,5,5,7,6,7|reckless","Gamora|6,6,8,5,8,6|","Rocket|4,9,4,9,5,10|ego","Groot|3,2,9,10,3,1|heart","Drax|2,2,9,7,0,4|reckless"]],
["Captain America: The Winter Soldier",2014,"SH","mcu",[
 "Captain America|9,7,8,4,7,6|heart","Black Widow|6,8,6,6,9,8|","Falcon|6,6,6,7,9,7|","Nick Fury|9,8,4,6,6,8|loner","Winter Soldier|3,4,9,5,8,10|loner"]],
["The Dark Knight",2008,"SH","dc",[
 "Batman|8,9,8,8,9,3|loner","Alfred|6,8,3,5,4,4|heart","Jim Gordon|8,6,5,3,5,7|","Lucius Fox|5,10,2,8,3,2|","Harvey Dent|7,6,5,5,3,6|reckless"]],
["Wonder Woman",2017,"SH","dc",[
 "Diana Prince|9,6,10,7,6,4|heart","Steve Trevor|8,6,6,4,8,7|","Etta Candy|4,5,3,6,3,2|heart","Sameer|4,6,4,7,7,4|","Chief|5,5,5,5,9,6|"]],
["Superman",1978,"SH","dc",[
 "Superman|8,7,10,9,8,4|heart","Lois Lane|6,7,3,5,8,2|reckless","Lex Luthor|6,9,2,6,4,5|ego,traitor","Jimmy Olsen|2,4,2,4,5,2|","Otis|1,1,3,6,1,1|"]],
["Spider-Man 2",2004,"SH","",[
 "Spider-Man|6,9,8,7,9,3|heart","Doc Ock|4,10,9,8,3,1|ego","Mary Jane Watson|5,5,3,3,5,2|","Aunt May|6,5,1,4,2,1|heart","Harry Osborn|5,6,4,4,3,5|reckless"]],
["Spider-Man: Into the Spider-Verse",2018,"SH","",[
 "Miles Morales|4,7,6,8,9,2|heart","Spider-Gwen|6,7,7,6,9,2|","Peter B. Parker|6,6,6,6,7,2|","Spider-Ham|2,3,4,9,6,3|","Kingpin|6,5,9,4,2,3|ego,traitor"]],
["X-Men",2000,"SH","xmen",[
 "Wolverine|6,4,10,8,8,2|loner","Professor X|9,10,1,8,9,0|","Storm|7,6,8,8,6,7|","Cyclops|7,6,6,5,5,9|ego","Rogue|3,4,6,8,5,2|"]],
["Logan",2017,"SH","xmen",[
 "Wolverine|6,5,10,7,8,4|loner","Laura|3,4,9,8,9,3|reckless","Professor X|7,9,1,8,6,0|","Caliban|4,7,2,6,8,1|","Donald Pierce|6,5,6,4,7,8|traitor"]],
["The Incredibles",2004,"SH","",[
 "Mr. Incredible|7,5,10,5,3,3|ego","Elastigirl|8,7,7,8,7,3|","Frozone|6,6,7,7,6,8|","Edna Mode|5,10,2,8,3,2|ego","Dash|3,4,4,8,10,1|reckless"]],
// ---------- ACTION ----------
["Die Hard",1988,"AC","",[
 "John McClane|6,6,8,7,8,9|reckless","Hans Gruber|8,9,4,6,5,7|ego,traitor","Al Powell|6,5,5,4,5,8|heart","Holly Gennero|8,6,3,3,4,2|","Argyle|3,3,3,6,4,1|"]],
["Mad Max: Fury Road",2015,"AC","",[
 "Furiosa|9,6,8,5,8,9|","Max Rockatansky|4,5,8,6,9,8|loner,survivor","Nux|2,3,6,8,5,3|reckless","Capable|4,5,3,4,5,3|heart","Immortan Joe|7,4,5,4,3,4|ego"]],
["John Wick",2014,"AC","",[
 "John Wick|5,6,9,5,8,10|loner","Winston|8,8,2,6,5,4|","Marcus|4,6,4,4,7,10|loner","Charon|4,6,5,4,5,8|","Viggo Tarasov|7,6,5,3,4,6|ego,traitor"]],
["Terminator 2: Judgment Day",1991,"AC","",[
 "T-800|5,6,10,7,5,9|","Sarah Connor|8,6,7,5,7,9|loner,survivor","John Connor|6,7,2,6,6,3|heart","Miles Dyson|4,10,2,5,2,1|","T-1000|3,7,9,9,10,6|traitor"]],
["Mission: Impossible – Fallout",2018,"AC","",[
 "Ethan Hunt|8,7,8,7,9,8|reckless","Benji Dunn|4,9,2,7,5,4|heart","Luther Stickell|6,10,4,6,4,4|","Ilsa Faust|6,7,7,5,9,9|loner","August Walker|4,5,9,4,6,8|ego,traitor"]],
["The Matrix",1999,"AC","",[
 "Neo|7,6,9,9,6,8|","Trinity|7,7,8,6,8,9|","Morpheus|10,8,7,6,6,7|","Tank|4,8,3,5,4,3|heart","Cypher|2,6,4,4,5,6|traitor"]],
["Top Gun: Maverick",2022,"AC","",[
 "Maverick|7,6,5,7,8,10|reckless","Rooster|5,5,5,5,6,8|","Hangman|4,5,5,6,6,9|ego","Phoenix|6,7,5,4,7,8|","Penny Benjamin|6,6,3,4,5,2|heart"]],
["Speed",1994,"AC","",[
 "Jack Traven|8,7,7,6,7,8|","Annie Porter|6,6,3,7,6,2|heart","Harry Temple|5,8,4,5,5,6|","Howard Payne|4,9,4,5,5,5|traitor"]],
["Fast Five",2011,"AC","",[
 "Dom Toretto|9,5,9,6,5,6|heart","Brian O'Conner|6,6,6,6,7,7|","Luke Hobbs|7,5,10,6,7,8|ego","Roman Pearce|3,4,4,8,4,4|","Tej Parker|4,9,5,7,4,5|"]],
["First Blood",1982,"AC","",[
 "John Rambo|4,6,9,7,10,9|loner,survivor","Colonel Trautman|8,7,4,4,5,7|","Sheriff Teasle|6,4,5,3,4,6|ego","Galt|2,2,4,2,3,7|reckless"]],
["Predator",1987,"AC","",[
 "Dutch|9,6,9,6,7,9|survivor","Dillon|6,6,7,4,5,8|ego","Billy|5,5,7,7,10,8|","Mac|3,3,7,6,4,9|reckless","Anna|4,5,2,6,7,2|"]],
["Gladiator",2000,"AC","",[
 "Maximus|10,7,9,5,6,6|heart","Juba|6,6,8,5,5,4|heart","Proximo|7,7,5,6,3,3|ego","Lucilla|7,8,2,5,5,1|","Commodus|4,6,6,4,3,4|traitor"]],
["The Bourne Identity",2002,"AC","",[
 "Jason Bourne|6,8,8,7,10,9|loner","Marie|5,5,2,5,6,2|heart","Conklin|6,7,3,3,3,4|ego","The Professor|3,5,5,4,7,10|loner"]],
// ---------- ADVENTURE ----------
["Raiders of the Lost Ark",1981,"AD","indy",[
 "Indiana Jones|7,8,7,8,8,6|reckless","Marion Ravenwood|6,5,6,7,6,6|","Sallah|6,6,6,6,5,3|heart","Marcus Brody|3,8,1,5,1,1|","Belloq|5,9,3,5,4,3|traitor"]],
["Indiana Jones and the Last Crusade",1989,"AD","indy",[
 "Indiana Jones|7,8,7,8,8,6|reckless","Henry Jones Sr.|5,10,1,7,3,1|","Sallah|6,6,6,6,5,3|heart","Elsa Schneider|6,8,3,5,6,4|traitor","Walter Donovan|6,7,2,3,2,2|ego,traitor"]],
["Jurassic Park",1993,"AD","jurassic",[
 "Alan Grant|6,8,4,5,8,4|","Ellie Sattler|7,8,4,6,6,4|","Ian Malcolm|4,9,2,7,3,2|ego","Robert Muldoon|6,6,6,4,9,9|","Dennis Nedry|1,8,2,6,2,1|traitor"]],
["Jurassic World",2015,"AD","jurassic",[
 "Owen Grady|7,6,7,8,9,9|","Claire Dearing|7,7,3,5,5,6|","Barry|6,5,7,5,7,8|","Gray Mitchell|1,7,1,6,3,1|","Vic Hoskins|5,4,5,4,4,7|traitor"]],
["Pirates of the Caribbean: The Curse of the Black Pearl",2003,"AD","",[
 "Jack Sparrow|6,8,4,10,8,5|reckless","Will Turner|6,6,7,5,6,4|heart","Elizabeth Swann|7,7,5,7,6,5|","Joshamee Gibbs|5,5,4,6,4,4|","Hector Barbossa|8,7,6,8,5,7|traitor"]],
["The Goonies",1985,"AD","",[
 "Mikey|7,6,2,6,6,2|heart","Brand|5,4,6,4,5,3|","Data|3,9,2,9,4,5|","Chunk|2,3,2,7,2,1|heart","Sloth|3,1,10,9,2,1|heart"]],
["Jumanji: Welcome to the Jungle",2017,"AD","",[
 "Dr. Bravestone|8,5,9,7,7,6|","Ruby Roundhouse|5,5,8,7,7,4|","Mouse Finbar|3,6,3,7,4,3|","Shelly Oberon|5,9,1,8,4,3|ego"]],
["The Mummy",1999,"AD","",[
 "Rick O'Connell|7,5,8,6,7,9|reckless","Evelyn Carnahan|5,10,3,7,5,2|","Jonathan Carnahan|2,4,3,7,3,4|","Ardeth Bay|8,7,7,5,8,7|","Beni|1,4,2,6,6,5|traitor"]],
["National Treasure",2004,"AD","",[
 "Ben Gates|6,10,4,7,8,2|","Riley Poole|3,9,2,7,4,1|heart","Abigail Chase|6,8,3,5,5,2|","Ian Howe|6,7,5,4,5,7|traitor"]],
["The Princess Bride",1987,"AD","",[
 "Westley|8,8,8,8,8,6|heart","Inigo Montoya|5,5,8,6,6,7|","Fezzik|3,2,10,6,3,2|heart","Miracle Max|2,6,1,9,1,0|","Vizzini|4,9,2,6,3,2|ego"]],
["The Revenant",2015,"AD","",[
 "Hugh Glass|6,7,7,6,9,7|loner,survivor","Captain Henry|8,6,5,3,5,6|","Jim Bridger|3,4,4,4,5,4|heart","John Fitzgerald|4,5,7,4,7,8|traitor"]],
["Moana",2016,"AD","",[
 "Moana|7,6,5,7,8,2|heart","Maui|5,5,10,9,6,2|ego","Heihei|0,0,0,6,1,0|reckless","Tamatoa|3,6,9,6,3,0|ego"]],
// ---------- FANTASY / SCI-FI ----------
["The Lord of the Rings: The Fellowship of the Ring",2001,"FS","lotr",[
 "Aragorn|10,7,9,5,9,7|heart","Gandalf|9,10,7,9,6,2|","Legolas|5,6,7,7,9,10|","Samwise Gamgee|4,5,5,6,5,2|heart","Boromir|7,4,8,4,4,4|traitor"]],
["The Lord of the Rings: The Two Towers",2002,"FS","lotr",[
 "Gimli|6,4,9,6,5,3|ego","Éowyn|7,6,7,7,6,4|","Théoden|9,5,6,4,4,4|","Faramir|8,7,6,4,7,8|","Gollum|1,6,3,8,10,1|traitor"]],
["Harry Potter and the Sorcerer's Stone",2001,"FS","hp",[
 "Harry Potter|6,5,4,7,7,3|reckless","Hermione Granger|6,10,3,7,6,3|","Ron Weasley|4,6,4,6,4,2|heart","Hagrid|5,4,9,8,5,2|heart","Dumbledore|10,10,4,9,6,3|"]],
["Harry Potter and the Deathly Hallows – Part 2",2011,"FS","hp",[
 "Neville Longbottom|7,5,6,8,4,3|heart","Professor McGonagall|9,9,5,7,4,4|","Molly Weasley|7,6,7,6,3,5|heart","Severus Snape|5,10,5,7,8,4|loner","Luna Lovegood|4,7,2,9,8,3|"]],
["Back to the Future",1985,"FS","",[
 "Marty McFly|5,5,4,7,6,3|reckless","Doc Brown|5,10,2,10,3,1|","Lorraine Baines|4,4,2,3,3,1|","George McFly|2,5,3,5,3,1|","Biff Tannen|3,1,7,4,2,2|traitor"]],
["Star Wars",1977,"FS","starwars",[
 "Luke Skywalker|6,5,6,7,7,8|","Princess Leia|9,8,4,5,6,8|","Han Solo|7,6,6,8,8,9|ego","Chewbacca|4,7,10,7,6,8|heart","Obi-Wan Kenobi|8,9,6,8,7,5|"]],
["The Empire Strikes Back",1980,"FS","starwars",[
 "Yoda|9,10,4,9,6,0|","Lando Calrissian|7,7,5,6,6,7|traitor","C-3PO|1,8,1,6,1,0|","Boba Fett|3,6,7,6,9,10|loner","Darth Vader|8,8,10,8,6,4|ego,traitor"]],
["Avatar",2009,"FS","",[
 "Jake Sully|8,5,8,7,8,7|","Neytiri|7,6,8,7,10,10|","Grace Augustine|6,10,2,5,5,1|","Trudy Chacón|5,5,5,5,6,8|heart","Colonel Quaritch|7,5,9,5,6,9|ego,traitor"]],
["Interstellar",2014,"FS","",[
 "Cooper|8,8,5,6,8,4|","Amelia Brand|6,10,3,5,5,2|","Murph|7,10,3,7,5,3|","TARS|4,9,8,9,7,8|heart","Dr. Mann|4,8,3,3,3,2|traitor"]],
["The Martian",2015,"FS","",[
 "Mark Watney|7,10,5,8,8,3|survivor","Commander Lewis|9,8,4,5,6,4|","Rick Martinez|5,7,4,5,5,3|heart","Rich Purnell|2,10,1,8,1,1|"]],
["Edge of Tomorrow",2014,"FS","",[
 "Cage|6,7,7,10,8,8|survivor","Rita Vrataski|7,7,9,6,8,9|loner","Master Sgt. Farell|7,4,6,4,3,5|ego","Dr. Carter|3,9,2,5,3,2|"]],
["Ghostbusters",1984,"FS","",[
 "Peter Venkman|5,6,3,7,3,5|ego","Egon Spengler|3,10,3,8,3,6|","Ray Stantz|5,8,4,7,4,6|heart","Winston Zeddemore|6,5,6,5,5,7|","Louis Tully|1,4,1,7,1,1|heart"]],
["Men in Black",1997,"FS","",[
 "Agent J|6,5,7,8,7,8|reckless","Agent K|9,9,6,7,7,9|loner","Laurel Weaver|5,9,3,6,4,5|","Zed|8,8,3,6,3,4|","Frank the Pug|1,7,1,8,5,0|"]],
["The Hunger Games",2012,"FS","",[
 "Katniss Everdeen|7,6,6,6,10,10|loner,survivor","Peeta Mellark|6,6,7,7,6,2|heart","Haymitch|7,9,4,6,4,3|reckless","Gale Hawthorne|6,5,7,5,8,9|","Rue|3,6,2,6,9,4|heart"]],
["Dune",2021,"FS","",[
 "Paul Atreides|8,8,6,8,8,4|","Lady Jessica|7,9,6,8,8,2|","Duncan Idaho|7,6,9,5,7,7|heart","Liet-Kynes|6,9,4,6,9,3|","Stilgar|8,7,8,5,10,6|"]],
["Shrek",2001,"FS","",[
 "Shrek|6,5,9,6,6,2|loner","Donkey|2,3,3,8,5,1|heart","Princess Fiona|6,6,9,7,5,3|","Dragon|3,2,10,9,3,6|","Lord Farquaad|4,5,1,3,1,4|ego"]],
["The Wizard of Oz",1939,"FS","",[
 "Dorothy Gale|6,5,2,8,6,1|heart","Scarecrow|3,9,2,6,4,1|","Tin Man|3,4,7,5,3,1|heart","Cowardly Lion|3,3,8,5,3,1|","Glinda|8,8,2,9,3,0|"]],
// ---------- HORROR ----------
["Jaws",1975,"HO","",[
 "Chief Brody|8,6,5,4,6,7|heart","Matt Hooper|5,10,4,6,5,4|","Quint|6,6,8,7,7,8|reckless","Mayor Vaughn|3,3,2,3,2,1|traitor"]],
["Alien",1979,"HO","alien",[
 "Ellen Ripley|8,7,6,6,7,8|survivor","Dallas|7,6,5,4,6,5|","Ash|3,9,6,6,4,2|traitor","Parker|4,5,7,5,4,7|ego","Lambert|2,6,2,3,4,2|"]],
["Aliens",1986,"HO","alien",[
 "Ellen Ripley|9,8,7,7,8,10|survivor","Corporal Hicks|8,6,7,5,7,9|","Vasquez|5,4,8,6,6,10|reckless","Bishop|5,10,6,7,5,6|heart","Carter Burke|4,7,2,3,4,2|traitor"]],
["Halloween",1978,"HO","",[
 "Laurie Strode|6,6,4,6,6,3|survivor","Dr. Loomis|7,8,3,5,5,7|","Sheriff Brackett|6,4,5,3,4,7|","Annie Brackett|3,3,2,3,2,1|reckless","Tommy Doyle|1,3,1,6,4,0|"]],
["Night of the Living Dead",1968,"HO","",[
 "Ben|8,7,7,5,6,7|","Barbra|2,3,2,3,2,1|","Harry Cooper|4,4,5,3,3,5|ego","Tom|4,4,5,4,4,3|","Johnny|2,2,3,2,1,0|reckless"]],
["Shaun of the Dead",2004,"HO","",[
 "Shaun|5,4,4,7,5,6|heart,survivor","Ed|1,2,4,7,2,6|reckless","Liz|6,6,3,5,4,3|","David|4,7,3,3,3,4|ego","Dianne|3,3,2,6,3,2|heart"]],
["Zombieland",2009,"HO","",[
 "Columbus|4,8,3,8,6,6|survivor","Tallahassee|5,3,9,8,5,10|reckless,survivor","Wichita|7,8,4,7,7,7|","Little Rock|3,7,2,6,6,6|"]],
["28 Days Later",2002,"HO","",[
 "Jim|6,5,6,5,7,5|survivor","Selena|7,7,7,5,8,5|loner","Frank|7,5,7,5,5,4|heart","Hannah|3,5,2,5,4,2|","Major West|7,6,5,4,4,8|traitor"]],
["World War Z",2013,"HO","",[
 "Gerry Lane|8,9,6,7,9,7|survivor","Segen|4,5,7,5,6,8|","Thierry Umutoni|7,7,3,5,4,4|","Karin Lane|5,4,2,3,3,1|heart","Dr. Fassbach|3,10,1,4,1,1|reckless"]],
["Scream",1996,"HO","",[
 "Sidney Prescott|6,6,5,6,6,6|survivor","Gale Weathers|5,7,3,6,7,4|ego","Dewey Riley|6,4,4,5,4,5|heart","Randy Meeks|3,9,2,8,3,2|","Billy Loomis|4,6,5,4,5,3|traitor"]],
["The Thing",1982,"HO","",[
 "MacReady|8,8,6,7,7,8|survivor","Childs|6,5,7,5,5,7|ego","Garry|6,5,5,3,4,7|","Dr. Copper|4,7,2,4,3,1|","Blair|3,10,4,5,3,2|traitor"]],
["Gremlins",1984,"HO","",[
 "Billy Peltzer|6,5,4,6,6,4|heart","Kate Beringer|5,6,3,5,5,2|","Gizmo|2,6,1,9,9,1|heart","Rand Peltzer|3,7,2,8,3,2|","Mr. Futterman|3,2,6,6,2,7|reckless"]],
["Tremors",1990,"HO","",[
 "Valentine McKee|6,5,7,6,6,4|","Earl Bassett|6,5,6,6,6,5|","Rhonda LeBeck|5,10,2,7,6,2|","Burt Gummer|5,6,6,8,5,10|survivor","Heather Gummer|4,4,5,6,4,9|"]],
["A Quiet Place",2018,"HO","",[
 "Lee Abbott|9,8,6,6,8,5|heart,survivor","Evelyn Abbott|7,7,4,6,6,5|","Regan Abbott|6,8,4,9,6,2|","Marcus Abbott|2,4,2,5,4,1|"]],
["Train to Busan",2016,"HO","",[
 "Seok-woo|6,6,5,4,6,2|","Sang-hwa|6,4,10,6,5,1|heart","Seong-kyeong|5,5,2,4,4,1|heart","Su-an|2,4,1,6,4,0|heart","Yon-suk|3,5,3,3,3,1|traitor"]],
["I Am Legend",2007,"HO","",[
 "Robert Neville|7,10,7,6,8,9|loner,survivor","Sam the Dog|1,1,6,9,10,0|heart","Anna|6,6,3,5,6,4|","Ethan|1,3,1,4,3,0|"]],
];

const ROLES = [
 {k:"L",name:"Leader",w:1.3},
 {k:"B",name:"Brains",w:1.0},
 {k:"R",name:"Brawn",w:1.0},
 {k:"W",name:"Wildcard",w:0.9},
 {k:"S",name:"Scout",w:0.9},
 {k:"K",name:"Marksman",w:0.9},
];
const GENRES = {SH:"Superhero",AC:"Action",AD:"Adventure",FS:"Fantasy / Sci-Fi",HO:"Horror"};

const FILMS = FILMS_RAW.map(([title,year,genre,franchise,chars],i)=>({
  id:i,title,year,genre,franchise,
  chars:chars.map(s=>{const [name,sc,tr]=s.split("|");return {name,film:i,scores:sc.split(",").map(Number),traits:tr?tr.split(","):[]};})
}));

if (typeof module!=="undefined") module.exports={FILMS,ROLES,GENRES};
